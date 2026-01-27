// src/Calls/components/SeoAnalyzerModal/index.jsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './SeoAnalyzerModal.module.sass';
import Icon from '../../../../shared/Icon';
import { handleError, handleSubmit } from '../../../../utils/snackbar';
import useUser from '../../../../hooks/useUser';
import ConfirmationModal from '../../../../components/ConfirmationModal';

const SeoAnalyzerModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const { user } = useUser();
  const [keyword, setKeyword] = useState('');
  const [taskName, setTaskName] = useState('');
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

  // Состояние для правой панели
  const [rightPanelView, setRightPanelView] = useState('list'); // 'list' | 'detail'
  const [tasksList, setTasksList] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasksPage, setTasksPage] = useState(1);
  const [tasksTotal, setTasksTotal] = useState(0);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // Состояние для удаления
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Загрузка списка отчётов
  const loadTasksList = async (page = 1) => {
    if (!user?.user_id) return;

    setIsLoadingTasks(true);
    try {
      const response = await fetch(
        `https://serp.lead-bro.ru/api/v1/tasks?page=${page}&per_page=10&status=completed&created_by=${user.user_id}`
      );
      if (response.ok) {
        const data = await response.json();
        setTasksList(data.items || []);
        setTasksTotal(data.total || 0);
        setTasksPage(page);
      }
    } catch (error) {
      console.error('Ошибка загрузки списка отчётов:', error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Загрузка деталей отчёта
  const loadTaskDetail = async (taskId) => {
    setIsLoadingTasks(true);
    try {
      const response = await fetch(`https://serp.lead-bro.ru/api/v1/tasks/${taskId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedTask(data);
        setRightPanelView('detail');
      }
    } catch (error) {
      console.error('Ошибка загрузки деталей отчёта:', error);
      handleError('Ошибка загрузки отчёта');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Загружаем список при открытии модального окна
  useEffect(() => {
    if (isOpen && user?.user_id) {
      loadTasksList(1);
    }
  }, [isOpen, user?.user_id]);

  // Удаление задачи
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`https://serp.lead-bro.ru/api/v1/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        handleSubmit('Отчёт успешно удалён');

        // Если удаляем из деталей - вернуться к списку
        if (rightPanelView === 'detail') {
          setRightPanelView('list');
          setSelectedTask(null);
        }

        // Обновляем список отчётов
        loadTasksList(tasksPage);
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка удаления отчёта');
      }
    } catch (error) {
      console.error('Ошибка удаления отчёта:', error);
      handleError(error.message || 'Не удалось удалить отчёт');
    } finally {
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  // Открытие модального окна подтверждения удаления
  const confirmDelete = (taskId) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

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
      handleError('Введите ключевое слово');
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
          task_name: taskName.trim() || undefined,
          keyword: keyword.trim(),
          region_id: regionId,
          target_url: targetUrl.trim() || undefined,
          created_by: user?.user_id,
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
      handleError(error.message);
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
          // Обновляем список отчётов после завершения анализа
          loadTasksList(tasksPage);
        } else if (data.status === 'failed') {
          setIsProcessing(false);
          clearInterval(pollingIntervalRef.current);
          handleError(data.error || 'Анализ завершился с ошибкой');
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

        <div className={styles.mainContainer}>
          {/* Левая панель - форма создания отчёта */}
          <div className={styles.leftPanel}>
            <div className={styles.content}>
              {!isProcessing && !results && (
                <>
                  <div className={styles.field}>
                    <label className={styles.label}>Название отчёта</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      placeholder="Анализ займов в Москве"
                      disabled={isProcessing}
                    />
                  </div>

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
                {regionSuggestions.filter(r => r.id !== regionId).length > 0 && (
                  <div className={styles.suggestions}>
                    {regionSuggestions.filter(r => r.id !== regionId).map((region) => (
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
                  setKeyword('');
                  setTaskName('');
                  setTargetUrl('');
                }}
              >
                Новый анализ
              </button>
            </div>
          )}
            </div>
          </div>

          {/* Правая панель - история отчётов */}
          <div className={styles.rightPanel}>
            {rightPanelView === 'list' ? (
              <TaskListPanel
                tasks={tasksList}
                isLoading={isLoadingTasks}
                onTaskClick={loadTaskDetail}
                onDelete={confirmDelete}
                page={tasksPage}
                total={tasksTotal}
                onPageChange={loadTasksList}
              />
            ) : (
              <TaskDetailPanel
                task={selectedTask}
                isLoading={isLoadingTasks}
                onBack={() => setRightPanelView('list')}
                onDownload={downloadReport}
                onDelete={confirmDelete}
              />
            )}
          </div>
        </div>

        {/* Модальное окно подтверждения удаления */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
          }}
          onConfirm={() => handleDeleteTask(taskToDelete)}
          label="Вы уверены, что хотите удалить этот отчёт?"
        />
      </div>
    </div>
  );
};

// Компонент списка отчётов
const TaskListPanel = ({ tasks, isLoading, onTaskClick, onDelete, page, total, onPageChange }) => {
  const perPage = 10;
  const totalPages = Math.ceil(total / perPage);

  if (isLoading && tasks.length === 0) {
    return (
      <div className={styles.rightContent}>
        <div className={styles.rightHeader}>
          <h4 className={styles.rightTitle}>История отчётов</h4>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingText}>Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.rightContent}>
      <div className={styles.rightHeader}>
        <h4 className={styles.rightTitle}>История отчётов</h4>
      </div>

      {tasks.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Нет сохранённых отчётов</p>
        </div>
      ) : (
        <>
          <div className={styles.tasksList}>
            {tasks.map((task) => (
              <div key={task.task_id} className={styles.taskCard}>
                <div onClick={() => onTaskClick(task.task_id)} className={styles.taskCardContent}>
                  <div className={styles.taskCardHeader}>
                    <div>
                      <h5 className={styles.taskCardTitle}>
                        {task.task_name || task.keyword}
                      </h5>
                      <span className={styles.taskCardDate}>
                        {new Date(task.created_at).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                  <div className={styles.taskCardInfo}>
                    <span className={styles.taskCardKeyword}>{task.keyword}</span>
                    <span className={styles.taskCardRegion}>{task.region_name}</span>
                  </div>
                  {task.total_entities > 0 && (
                    <div className={styles.taskCardStats}>
                      {task.total_entities} сущностей из {task.total_sources} сайтов
                    </div>
                  )}
                </div>
                <button
                  className={styles.deleteIconButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.task_id);
                  }}
                  title="Удалить отчёт"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationButton}
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
              >
                &larr;
              </button>
              <span className={styles.paginationInfo}>
                {page} / {totalPages}
              </span>
              <button
                className={styles.paginationButton}
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
              >
                &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Компонент деталей отчёта
const TaskDetailPanel = ({ task, isLoading, onBack, onDownload, onDelete }) => {
  if (isLoading || !task) {
    return (
      <div className={styles.rightContent}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingText}>Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.rightContent}>
      <div className={styles.rightHeader}>
        <button className={styles.backButton} onClick={onBack}>
          <Icon name="arrow-left" size={16} />
          <span>Назад</span>
        </button>
      </div>

      <div className={styles.taskDetail}>
        <h4 className={styles.detailTitle}>{task.task_name || task.keyword}</h4>

        <div className={styles.detailSection}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Ключевое слово:</span>
            <span className={styles.detailValue}>{task.keyword}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Регион:</span>
            <span className={styles.detailValue}>{task.region_name}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Поисковик:</span>
            <span className={styles.detailValue}>
              {task.engine === 'yandex' ? 'Яндекс' : 'Google'}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Глубина:</span>
            <span className={styles.detailValue}>{task.depth}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Дата создания:</span>
            <span className={styles.detailValue}>
              {new Date(task.created_at).toLocaleString('ru-RU')}
            </span>
          </div>
        </div>

        {task.results && (
          <div className={styles.detailSection}>
            <h5 className={styles.detailSectionTitle}>Результаты</h5>
            <div className={styles.detailStats}>
              <div className={styles.detailStat}>
                <span className={styles.detailStatLabel}>Всего сущностей:</span>
                <span className={styles.detailStatValue}>{task.results.total_entities}</span>
              </div>
              <div className={styles.detailStat}>
                <span className={styles.detailStatLabel}>Источников:</span>
                <span className={styles.detailStatValue}>{task.results.total_sources}</span>
              </div>
              <div className={styles.detailStat}>
                <span className={styles.detailStatLabel}>Универсальные:</span>
                <span className={styles.detailStatValue}>{task.results.universal_entities}</span>
              </div>
              <div className={styles.detailStat}>
                <span className={styles.detailStatLabel}>Частые:</span>
                <span className={styles.detailStatValue}>{task.results.common_entities}</span>
              </div>
              <div className={styles.detailStat}>
                <span className={styles.detailStatLabel}>Редкие:</span>
                <span className={styles.detailStatValue}>{task.results.rare_entities}</span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.detailActions}>
          <button
            className={styles.downloadButton}
            onClick={() => {
              const url = `https://serp.lead-bro.ru/api/v1/download/${task.task_id}`;
              window.open(url, '_blank');
            }}
          >
            Скачать Excel отчет
          </button>

          <button
            className={styles.deleteButton}
            onClick={() => onDelete(task.task_id)}
          >
            <Icon name="trash" size={16} />
            <span>Удалить отчёт</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeoAnalyzerModal;
