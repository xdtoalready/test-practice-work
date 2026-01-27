import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { http } from '../../shared/http';
import Loader from '../../shared/Loader';
import styles from './ReportViewer.module.sass';

/**
 * Компонент для просмотра HTML отчетов
 * URL: /reports/:id
 */
const ReportViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reportHtml, setReportHtml] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await http.get(`/api/reports/${id}`);
        const htmlContent = response.data?.data?.html || response.data?.html || response.data;

        setReportHtml(htmlContent);
      } catch (err) {
        console.error('Error loading report:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadReport();
    }
  }, [id]);

  const handleClose = () => {
    navigate('/documents?filter=report');
  };

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader />
        <p>Загрузка отчета...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>Ошибка загрузки отчета</h2>
          <p>
            {error.response?.status === 403
              ? 'У вас нет доступа к этому отчету'
              : error.response?.status === 404
                ? 'Отчет не найден'
                : 'Не удалось загрузить отчет. Попробуйте еще раз.'}
          </p>
          <button onClick={handleClose} className={styles.backButton}>
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.viewerContainer}>
      <div
        className={styles.reportContent}
        dangerouslySetInnerHTML={{ __html: reportHtml }}
      />
    </div>
  );
};

export default ReportViewer;
