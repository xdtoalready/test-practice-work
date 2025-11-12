// documents-print.api.js - API для просмотра и скачивания PDF документов

import { useState } from 'react';
import { getToken } from '../../../shared/http';
import { handleError } from '../../../utils/snackbar';
import { API_URL } from '../../../shared/constants';

/**
 * Извлекает и декодирует имя файла из кастомного заголовка X-Filename
 * Бэкенд отправляет имя файла в URL-encoded формате (rawurlencode)
 */
const extractFilenameFromXHeader = (xFilename) => {
  if (!xFilename) {
    return null;
  }

  try {
    return decodeURIComponent(xFilename);
  } catch (e) {
    console.error('Error decoding X-Filename:', e);
    return null;
  }
};

const useDocumentsPrintApi = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Просмотр счета в PDF (открывает в новой вкладке)
   * @param {number} billId - ID счета
   * @param {boolean} stamp - С печатью или без (true/false)
   */
  const viewBillPdf = async (billId, stamp = true) => {
    try {
      setIsLoading(true);
      const token = getToken();
      const stampParam = stamp ? 1 : 0;
      const url = `${API_URL}/api/bills/${billId}/print?stamp=${stampParam}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Открываем PDF в новой вкладке
      window.open(blobUrl, '_blank');

      // Очищаем blob URL после небольшой задержки
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error('Error viewing bill PDF:', error);
      handleError('Ошибка при просмотре счета');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Просмотр акта в PDF (открывает в новой вкладке)
   * @param {number} actId - ID акта
   * @param {boolean} stamp - С печатью или без (true/false)
   */
  const viewActPdf = async (actId, stamp = true) => {
    try {
      setIsLoading(true);
      const token = getToken();
      const stampParam = stamp ? 1 : 0;
      const url = `${API_URL}/api/acts/${actId}/print?stamp=${stampParam}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Открываем PDF в новой вкладке
      window.open(blobUrl, '_blank');

      // Очищаем blob URL после небольшой задержки
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error('Error viewing act PDF:', error);
      handleError('Ошибка при просмотре акта');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Просмотр отчета в PDF (открывает в новой вкладке)
   * @param {number} reportId - ID отчета
   */
  const viewReportPdf = async (reportId) => {
    try {
      setIsLoading(true);
      const token = getToken();
      const url = `${API_URL}/api/reports/${reportId}/print`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Открываем PDF в новой вкладке
      window.open(blobUrl, '_blank');

      // Очищаем blob URL после небольшой задержки
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error('Error viewing report PDF:', error);
      handleError('Ошибка при просмотре отчета');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Скачать PDF счета
   * @param {number} billId - ID счета
   * @param {boolean} stamp - С печатью или без (true/false)
   */
  const downloadBillPdf = async (billId, stamp = true) => {
    try {
      setIsLoading(true);
      const token = getToken();
      const stampParam = stamp ? 1 : 0;
      const url = `${API_URL}/api/bills/${billId}/download?stamp=${stampParam}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Извлечение имени файла из кастомного заголовка X-Filename
      const xFilename = response.headers.get('X-Filename');
      const filename = extractFilenameFromXHeader(xFilename) || `bill_${billId}.pdf`;

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading bill PDF:', error);
      handleError('Ошибка при скачивании счета');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Скачать PDF акта
   * @param {number} actId - ID акта
   * @param {boolean} stamp - С печатью или без (true/false)
   */
  const downloadActPdf = async (actId, stamp = true) => {
    try {
      setIsLoading(true);
      const token = getToken();
      const stampParam = stamp ? 1 : 0;
      const url = `${API_URL}/api/acts/${actId}/download?stamp=${stampParam}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Извлечение имени файла из кастомного заголовка X-Filename
      const xFilename = response.headers.get('X-Filename');
      const filename = extractFilenameFromXHeader(xFilename) || `act_${actId}.pdf`;

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading act PDF:', error);
      handleError('Ошибка при скачивании акта');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Скачать PDF отчета
   * @param {number} reportId - ID отчета
   */
  const downloadReportPdf = async (reportId) => {
    try {
      setIsLoading(true);
      const token = getToken();
      const url = `${API_URL}/api/reports/${reportId}/download`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Извлечение имени файла из кастомного заголовка X-Filename
      const xFilename = response.headers.get('X-Filename');
      const filename = extractFilenameFromXHeader(xFilename) || `report_${reportId}.pdf`;

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading report PDF:', error);
      handleError('Ошибка при скачивании отчета');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    viewBillPdf,
    viewActPdf,
    viewReportPdf,
    downloadBillPdf,
    downloadActPdf,
    downloadReportPdf,
    isLoading,
  };
};

export default useDocumentsPrintApi;
