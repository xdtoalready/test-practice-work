// documents-print.api.js - API для получения PDF документов

import { useState } from 'react';
import { handleHttpError, http, resetApiProvider } from '../../../shared/http';
import { handleError } from '../../../utils/snackbar';

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
        params: { stamp },
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
        params: { stamp },
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

  return {
    getBillPdf,
    getActPdf,
    getReportPdf,
    isLoading,
    error,
  };
};

export default useDocumentsPrintApi;
