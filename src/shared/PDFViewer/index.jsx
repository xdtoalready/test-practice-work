import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import styles from './PDFViewer.module.sass';
import Button from '../Button';
import Loader from '../Loader';
import Icon from '../Icon';

// Настройка worker для PDF.js (версия 5.x для pdfjs-dist@5.4.394)
// Используем CDN с правильной версией для совместимости с react-pdf 10.x
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/**
 * Компонент для просмотра PDF документов
 * @param {Blob} pdfBlob - PDF файл в формате blob
 * @param {string} fileName - Название файла для скачивания
 * @param {Function} onClose - Callback для закрытия просмотра
 */
const PDFViewer = ({ pdfBlob, fileName = 'document.pdf', onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pdfBlob) {
      // Создаем URL из blob для отображения
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      // Очистка URL при размонтировании
      return () => URL.revokeObjectURL(url);
    }
  }, [pdfBlob]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error('Ошибка загрузки PDF:', error);
    setIsLoading(false);
  };

  const handlePreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1.0);
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };

  if (!pdfBlob || !pdfUrl) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>
          <Loader />
          <p>Загрузка документа...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Панель инструментов */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          {onClose && (
            <Button
              type="secondary"
              isSmall={true}
              onClick={onClose}
              name="Назад"
              classname={styles.button}
            />
          )}
          <div className={styles.pageInfo}>
            Страница {pageNumber} из {numPages || '...'}
          </div>
        </div>

        <div className={styles.toolbarCenter}>
          <button
            onClick={handlePreviousPage}
            disabled={pageNumber <= 1}
            className={styles.iconButton}
            title="Предыдущая страница"
          >
            <Icon name="arrow-left" size={20} />
          </button>

          <button
            onClick={handleNextPage}
            disabled={pageNumber >= numPages}
            className={styles.iconButton}
            title="Следующая страница"
          >
            <Icon name="arrow-right" size={20} />
          </button>

          <div className={styles.divider}></div>

          <button
            onClick={handleZoomOut}
            className={styles.iconButton}
            title="Уменьшить"
          >
            <Icon name="minus" size={20} viewBox={20} />
          </button>

          <span className={styles.zoomLevel}>{Math.round(scale * 100)}%</span>

          <button
            onClick={handleZoomIn}
            className={styles.iconButton}
            title="Увеличить"
          >
            <Icon name="plus" size={20} />
          </button>

          <button
            onClick={handleResetZoom}
            className={styles.iconButton}
            title="Сбросить масштаб"
          >
            100%
          </button>
        </div>

        <div className={styles.toolbarRight}>
          <Button
            type="secondary"
            isSmall={true}
            onClick={handlePrint}
            name="Печать"
            classname={styles.button}
          />
          <Button
            type="primary"
            isSmall={true}
            onClick={handleDownload}
            name="Скачать"
            classname={styles.button}
          />
        </div>
      </div>

      {/* Область просмотра PDF */}
      <div className={styles.viewerContainer}>
        {isLoading && (
          <div className={styles.loader}>
            <Loader />
          </div>
        )}

        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className={styles.loader}>
              <Loader />
            </div>
          }
          className={styles.document}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            loading={
              <div className={styles.pageLoader}>
                <Loader />
              </div>
            }
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className={styles.page}
          />
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
