// src/Calls/components/SeoAnalyzerModal/index.jsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './SeoAnalyzerModal.module.sass';
import Icon from '../../../../shared/Icon';
import { handleShowError, handleSubmit } from '../../../../utils/snackbar';

const SeoAnalyzerModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const [keyword, setKeyword] = useState('');
  const [regionId, setRegionId] = useState(213); // Москва по умолчанию
  const [regionQuery, setRegionQuery] = useState('');
  const [regionSuggestions, setRegionSuggestions] = useState([]);
  const [targetUrl, setTargetUrl] = useState('');
  const [depth, setDepth] = useState(10);
  const [engine, setEngine] = useState('yandex');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [taskId, setTaskId] = useState(null);
  const [results, setResults] = useState(null);
  const pollingIntervalRef = useRef(null);

  // Поиск регионов
  const searchRegions = async (query) => {
    if (!query || query.length < 2) {
      setRegionSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://serp.lead-bro.ru/api/v1/regions/search?q=${encodeURIComponent(query)}&limit=10`
      );

      if (!response.ok) {
        console.error('Ошибка поиска регионов: HTTP', response.status);
        return;
      }

      const data = await response.json();
      setRegionSuggestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ошибка поиска регионов:', error);
      // Не показываем ошибку пользователю, просто логируем
      setRegionSuggestions([]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (regionQuery) {
        searchRegions(regionQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [regionQuery]);

  // Запуск анализа
  const startAnalysis = async () => {
    if (!keyword.trim()) {
      handleShowError('Введите ключевое слово');
      return;
    }

    const newTaskId = `task-${Date.now()}`;
    setTaskId(newTaskId);
    setIsProcessing(true);
    setProgress(0);
    setResults(null);

    try {
      const response = await fetch('https://serp.lead-bro.ru/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: newTaskId,
          keyword: keyword.trim(),
          region_id: regionId,
          target_url: targetUrl.trim() || undefined,
          settings: {
            depth: depth,
            engine: engine,
            exclude_domains: []
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        handleSubmit('Анализ запущен');
        startPolling(newTaskId);
      } else {
        throw new Error(data.detail || 'Ошибка запуска анализа');
      }
    } catch (error) {
      handleShowError(error.message);
      setIsProcessing(false);
    }
  };

  // Polling статуса
  const startPolling = (id) => {
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`https://serp.lead-bro.ru/api/v1/status/${id}`);
        const data = await response.json();

        if (data.status === 'processing') {
          setProgress(data.progress || 0);
        } else if (data.status === 'completed') {
          setProgress(100);
          setResults(data.results);
          setIsProcessing(false);
          clearInterval(pollingIntervalRef.current);
          handleSubmit('Анализ завершен!');
        } else if (data.status === 'failed') {
          setIsProcessing(false);
          clearInterval(pollingIntervalRef.current);
          handleShowError(data.error || 'Анализ завершился с ошибкой');
        }
      } catch (error) {
        console.error('Ошибка проверки статуса:', error);
      }
    }, 2000);
  };

  // Скачивание отчета
  const downloadReport = () => {
    if (!taskId) return;
    const url = `https://serp.lead-bro.ru/api/v1/download/${taskId}`;
    window.open(url, '_blank');
  };

  // Cleanup при закрытии
  useEffect(() => {
    if (!isOpen) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    }
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getProgressStage = () => {
    if (progress <= 20) return 'Сбор поисковой выдачи';
    if (progress <= 40) return 'Извлечение контента';
    if (progress <= 70) return 'AI-анализ сущностей';
    if (progress <= 90) return 'Агрегация результатов';
    return 'Генерация отчета';
  };

  return (
    <div className={styles.modalOverlay}>
      <div ref={modalRef} className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>SEO Анализатор</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {!isProcessing && !results && (
            <>
              <div className={styles.field}>
                <label className={styles.label}>Ключевое слово *</label>
                <input
                  type="text"
                  className={styles.input}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="купить автомобиль"
                  disabled={isProcessing}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Регион</label>
                <input
                  type="text"
                  className={styles.input}
                  value={regionQuery}
                  onChange={(e) => setRegionQuery(e.target.value)}
                  placeholder="Москва"
                  disabled={isProcessing}
                />
                {regionSuggestions.length > 0 && (
                  <div className={styles.suggestions}>
                    {regionSuggestions.map((region) => (
                      <div
                        key={region.id}
                        className={styles.suggestion}
                        onClick={() => {
                          setRegionId(region.id);
                          setRegionQuery(region.title);
                          setRegionSuggestions([]);
                        }}
                      >
                        {region.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>URL своей страницы (опционально)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://your-site.com"
                  disabled={isProcessing}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Глубина анализа</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={depth}
                    onChange={(e) => setDepth(Math.min(100, Math.max(1, parseInt(e.target.value) || 10)))}
                    min="1"
                    max="100"
                    disabled={isProcessing}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Поисковик</label>
                  <select
                    className={styles.input}
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    disabled={isProcessing}
                  >
                    <option value="yandex">Яндекс</option>
                    <option value="google">Google</option>
                  </select>
                </div>
              </div>

              <button
                className={styles.startButton}
                onClick={startAnalysis}
                disabled={isProcessing || !keyword.trim()}
              >
                Запустить анализ
              </button>
            </>
          )}

          {isProcessing && (
            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                {getProgressStage()}
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className={styles.progressPercent}>{progress}%</div>
            </div>
          )}

          {results && (
            <div className={styles.results}>
              <h4 className={styles.resultsTitle}>Результаты анализа</h4>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Всего сущностей:</span>
                <span className={styles.statValue}>{results.total_entities}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Источников:</span>
                <span className={styles.statValue}>{results.total_sources}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Универсальные:</span>
                <span className={styles.statValue}>{results.universal_entities}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Частые:</span>
                <span className={styles.statValue}>{results.common_entities}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Редкие:</span>
                <span className={styles.statValue}>{results.rare_entities}</span>
              </div>

              <button className={styles.downloadButton} onClick={downloadReport}>
                Скачать Excel отчет
              </button>

              <button
                className={styles.newAnalysisButton}
                onClick={() => {
                  setResults(null);
                  setProgress(0);
                  setTaskId(null);
                }}
              >
                Новый анализ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeoAnalyzerModal;
