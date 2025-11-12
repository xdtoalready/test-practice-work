import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useDocumentsPrintApi from '../../api/documents-print.api';
import Loader from '../../../../shared/Loader';
import styles from './DocumentViewer.module.sass';

/**
 * Компонент для просмотра документов в отдельной вкладке
 * URL: /documents/:type/:id
 * type: bills, acts, reports
 */
const DocumentViewer = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const documentsPrintApi = useDocumentsPrintApi();

  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let blob;
        switch (type) {
          case 'bills':
            blob = await documentsPrintApi.getBillPdfBlob(id, true);
            break;
          case 'acts':
            blob = await documentsPrintApi.getActPdfBlob(id, true);
            break;
          case 'reports':
            blob = await documentsPrintApi.getReportPdfBlob(id);
            break;
          default:
            throw new Error(`Unknown document type: ${type}`);
        }

        if (blob) {
          const blobUrl = URL.createObjectURL(blob);
          setPdfUrl(blobUrl);
        }
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (type && id) {
      loadPdf();
    }

    // Cleanup blob URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [type, id]);

  const handleClose = () => {
    navigate('/documents');
  };

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader />
        <p>Загрузка документа...</p>
      </div>
    );
  }

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

  return (
    <div className={styles.viewerContainer}>
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          className={styles.pdfIframe}
          title="Document Viewer"
        />
      )}
    </div>
  );
};

export default DocumentViewer;
