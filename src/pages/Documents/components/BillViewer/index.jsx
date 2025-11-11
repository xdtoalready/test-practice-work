import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import PDFViewer from '../../../../shared/PDFViewer';
import Loader from '../../../../shared/Loader';
import useDocumentsPrintApi from '../../api/documents-print.api';
import styles from './BillViewer.module.sass';

/**
 * Страница для просмотра счетов в PDF формате
 * URL: /bills/:id?stamp=true/false
 */
const BillViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const api = useDocumentsPrintApi();

  const [pdfBlob, setPdfBlob] = useState(null);
  const [error, setError] = useState(null);

  // Получаем параметр stamp из URL (по умолчанию true)
  const stamp = searchParams.get('stamp') !== 'false';

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const blob = await api.getBillPdf(id, stamp);
        setPdfBlob(blob);
      } catch (err) {
        setError(err);
      }
    };

    if (id) {
      loadPdf();
    }
  }, [id, stamp]);

  const handleClose = () => {
    navigate('/documents?filter=bill');
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
        <p>Загрузка счета...</p>
      </div>
    );
  }

  return (
    <PDFViewer
      pdfBlob={pdfBlob}
      fileName={`Счет_${id}${stamp ? '_с_печатью' : ''}.pdf`}
      onClose={handleClose}
    />
  );
};

export default BillViewer;
