// documents-print.api.js - API для получения PDF документов

import { useState } from 'react';
import { handleHttpError, http, resetApiProvider, getToken } from '../../../shared/http';
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
  const [error, setError] = useState(null);

  /**
   * Получить PDF счета
   * @param {number} billId - ID счета
   * @param {boolean} stamp - С печатью или без (true/false)
   * @returns {Promise<Blob>} - PDF файл в формате blob
   */
  const getBillPdf = async (billId, stamp = true) => {
    resetApiProvider();
    setIsLoading(true);
    setError(null);

    try {
      const response = await http.get(`/api/bills/${billId}/print`, {
        params: { stamp: stamp ? 1 : 0 }, // Конвертируем boolean в 1/0 для API
        responseType: 'blob', // Важно для получения файла
      });

      return response.data;
    } catch (err) {
      setError(err);
      handleHttpError(err);
      if (err.response?.status === 403) {
        handleError('Доступ к документу запрещен');
      } else if (err.response?.status === 404) {
        handleError('Документ не найден');
      } else {
        handleError('Ошибка при загрузке документа');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Получить PDF акта
   * @param {number} actId - ID акта
   * @param {boolean} stamp - С печатью или без (true/false)
   * @returns {Promise<Blob>} - PDF файл в формате blob
   */
  const getActPdf = async (actId, stamp = true) => {
    resetApiProvider();
    setIsLoading(true);
    setError(null);

    try {
      const response = await http.get(`/api/acts/${actId}/print`, {
        params: { stamp: stamp ? 1 : 0 }, // Конвертируем boolean в 1/0 для API
        responseType: 'blob',
      });

      return response.data;
    } catch (err) {
      setError(err);
      handleHttpError(err);
      if (err.response?.status === 403) {
        handleError('Доступ к документу запрещен');
      } else if (err.response?.status === 404) {
        handleError('Документ не найден');
      } else {
        handleError('Ошибка при загрузке документа');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Получить PDF отчета
   * @param {number} reportId - ID отчета
   * @returns {Promise<Blob>} - PDF файл в формате blob
   */
  const getReportPdf = async (reportId) => {
    resetApiProvider();
    setIsLoading(true);
    setError(null);

    try {
      const response = await http.get(`/api/reports/${reportId}`, {
        responseType: 'blob',
      });

      return response.data;
    } catch (err) {
      setError(err);
      handleHttpError(err);
      if (err.response?.status === 403) {
        handleError('Доступ к документу запрещен');
      } else if (err.response?.status === 404) {
        handleError('Документ не найден');
      } else {
        handleError('Ошибка при загрузке документа');
      }
      throw err;
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
    }
  };

  /**
   * Скачать PDF акта
   * @param {number} actId - ID акта
   * @param {boolean} stamp - С печатью или без (true/false)
   */
  const downloadActPdf = async (actId, stamp = true) => {
    try {
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
    }
  };

  /**
   * Скачать PDF отчета
   * @param {number} reportId - ID отчета
   */
  const downloadReportPdf = async (reportId) => {
    try {
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
    }
  };

  return {
    getBillPdf,
    getActPdf,
    getReportPdf,
    downloadBillPdf,
    downloadActPdf,
    downloadReportPdf,
    isLoading,
    error,
  };
};

export default useDocumentsPrintApi;
