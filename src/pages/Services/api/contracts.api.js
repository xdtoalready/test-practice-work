// contracts.api.js - API для работы с договорами

import { useState } from 'react';
import { getToken } from '../../../shared/http';
import { handleError, handleSubmit } from '../../../utils/snackbar';
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

const useContractsApi = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Создание договора
   * @param {string} number - Номер договора
   * @param {number} serviceId - ID услуги
   * @param {number} legalEntityId - ID юридического лица
   */
  const createContract = async (number, serviceId, legalEntityId) => {
    try {
      setIsLoading(true);
      const token = getToken();
      const url = `${API_URL}/api/contracts`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number,
          service_id: serviceId,
          legal_id: legalEntityId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      handleSubmit('Договор успешно создан');
      return data.data;
    } catch (error) {
      console.error('Error creating contract:', error);
      handleError('Ошибка при создании договора');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Получение информации о договоре
   * @param {number} contractId - ID договора
   */
  const getContract = async (contractId) => {
    try {
      setIsLoading(true);
      const token = getToken();
      const url = `${API_URL}/api/contracts/${contractId}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching contract:', error);
      handleError('Ошибка при загрузке договора');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Обновление договора
   * @param {number} contractId - ID договора
   * @param {string} number - Новый номер договора
   * @param {number} legalEntityId - ID юридического лица
   */
  const updateContract = async (contractId, number, legalEntityId) => {
    try {
      setIsLoading(true);
      const token = getToken();
      const url = `${API_URL}/api/contracts/${contractId}`;

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number,
          legal_id: legalEntityId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      handleSubmit('Договор успешно обновлен');
      return data.data;
    } catch (error) {
      console.error('Error updating contract:', error);
      handleError('Ошибка при обновлении договора');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Удаление договора
   * @param {number} contractId - ID договора
   */
  const deleteContract = async (contractId) => {
    try {
      setIsLoading(true);
      const token = getToken();
      const url = `${API_URL}/api/contracts/${contractId}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      handleSubmit('Договор успешно удален');
      return true;
    } catch (error) {
      console.error('Error deleting contract:', error);
      handleError('Ошибка при удалении договора');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Просмотр договора в PDF (открывает в новой вкладке)
   * @param {number} contractId - ID договора
   */
  const viewContractPdf = async (contractId) => {
    try {
      setIsLoading(true);
      const token = getToken();
      const url = `${API_URL}/api/contracts/${contractId}/print`;

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
      console.error('Error viewing contract PDF:', error);
      handleError('Ошибка при просмотре договора');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Получить blob PDF договора (для компонента просмотра)
   * @param {number} contractId - ID договора
   * @returns {Promise<Blob>}
   */
  const getContractPdfBlob = async (contractId) => {
    try {
      const token = getToken();
      const url = `${API_URL}/api/contracts/${contractId}/print`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error fetching contract PDF blob:', error);
      throw error;
    }
  };

  /**
   * Скачать PDF договора
   * @param {number} contractId - ID договора
   */
  const downloadContractPdf = async (contractId) => {
    try {
      setIsLoading(true);
      const token = getToken();
      const url = `${API_URL}/api/contracts/${contractId}/download`;

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
      const filename = extractFilenameFromXHeader(xFilename) || `contract_${contractId}.pdf`;

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
      console.error('Error downloading contract PDF:', error);
      handleError('Ошибка при скачивании договора');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createContract,
    getContract,
    updateContract,
    deleteContract,
    viewContractPdf,
    getContractPdfBlob,
    downloadContractPdf,
    isLoading,
  };
};

export default useContractsApi;
