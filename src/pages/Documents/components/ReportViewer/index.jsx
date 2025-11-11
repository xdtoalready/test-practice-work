import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PDFViewer from '../../../../shared/PDFViewer';
import Loader from '../../../../shared/Loader';
import useDocumentsPrintApi from '../../api/documents-print.api';
import styles from './ReportViewer.module.sass';

/**
 * Страница для просмотра отчетов в PDF формате
 * URL: /reports/:id
 */
const ReportViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useDocumentsPrintApi();

  const [pdfBlob, setPdfBlob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const blob = await api.getReportPdf(id);
        setPdfBlob(blob);
      } catch (err) {
        setError(err);
      }
    };

    if (id) {
      loadPdf();
    }
  }, [id]);

  const handleClose = () => {
    navigate('/documents?filter=report');
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>Ошибка загрузки документа</h2>
          <p>
            {error.response?.status === 403
              ? 'У вас нет доступа к этому документу'
              : error.response?.status === 404
              ? 'Документ не найден'
              : 'Не удалось загрузить документ. Попробуйте еще раз.'}
          </p>
          <button onClick={handleClose} className={styles.backButton}>
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  if (api.isLoading || !pdfBlob) {
    return (
      <div className={styles.loaderContainer}>
        <Loader />
        <p>Загрузка отчета...</p>
      </div>
    );
  }

  return (
    <PDFViewer
      pdfBlob={pdfBlob}
      fileName={`Отчет_${id}.pdf`}
      onClose={handleClose}
    />
  );
};

export default ReportViewer;
