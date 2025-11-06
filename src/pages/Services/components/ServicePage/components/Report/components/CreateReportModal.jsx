import React, { useState } from 'react';
import FormValidatedModal from '../../../../../../../shared/Modal/FormModal';
import styles from './CreateReportModal.module.sass';
import {
  handleError,
  handleSubmit as handleSubmitSnackbar
} from '../../../../../../../utils/snackbar';
import { http, handleHttpError } from '../../../../../../../shared/http';
import { splitHtmlIntoPages } from '../../../../../../../utils/pdf-report.utils';

const CreateReportModal = ({ stageId, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      console.log('[CreateReportModal] Начало создания отчёта для stage:', stageId);

      // Шаг 1: Получаем контент через prepare_tasks
      console.log('[CreateReportModal] Получаем контент через prepare_tasks...');
      const prepareResponse = await http.get(`/api/reports/${stageId}/prepare_tasks`);

      // ВАЖНО: Логируем полную структуру ответа для отладки
      console.log('[CreateReportModal] Полный ответ от prepare_tasks:', prepareResponse);
      console.log('[CreateReportModal] prepareResponse.data:', prepareResponse.data);
      console.log('[CreateReportModal] Тип prepareResponse.data:', typeof prepareResponse.data);

      // Умное извлечение HTML контента из ответа API
      let htmlContent = '';
      const responseData = prepareResponse.data;

      if (typeof responseData === 'string') {
        // Вариант 1: data - это строка напрямую
        htmlContent = responseData;
        console.log('[CreateReportModal] Используем prepareResponse.data как строку');
      } else if (responseData && typeof responseData === 'object') {
        // Вариант 2: data - это объект, ищем HTML в известных свойствах
        console.log('[CreateReportModal] Ответ - объект, ищем HTML контент в свойствах...');
        console.log('[CreateReportModal] Ключи объекта:', Object.keys(responseData));

        // Пробуем разные варианты названий свойств
        const possibleKeys = ['data', 'html', 'content', 'tasks', 'body', 'htmlContent'];

        for (const key of possibleKeys) {
          if (responseData[key] && typeof responseData[key] === 'string') {
            htmlContent = responseData[key];
            console.log(`[CreateReportModal] Найден HTML контент в свойстве '${key}'`);
            break;
          }
        }

        // Если не нашли в известных свойствах, логируем весь объект
        if (!htmlContent) {
          console.warn('[CreateReportModal] Не удалось найти HTML контент в известных свойствах');
          console.warn('[CreateReportModal] Полная структура responseData:', JSON.stringify(responseData, null, 2));
        }
      }

      console.log('[CreateReportModal] Получен HTML контент:', htmlContent);
      console.log('[CreateReportModal] Длина контента:', htmlContent.length);

      // Проверяем, что контент не пустой
      if (!htmlContent || htmlContent.trim().length === 0) {
        throw new Error('Получен пустой HTML контент от prepare_tasks. Проверьте структуру ответа API.');
      }

      // Шаг 2: Разбиваем контент на страницы (с предзагрузкой изображений)
      console.log('[CreateReportModal] Разбиваем контент на страницы...');
      const splitContent = await splitHtmlIntoPages(htmlContent);
      console.log('[CreateReportModal] Разбитый контент:', splitContent);

      // Шаг 3: Отправляем на generate (теперь POST с телом)
      console.log('[CreateReportModal] Отправляем на generate...');
      const response = await http.post(`/api/reports/${stageId}/generate`, {
        tasks: splitContent
      });

      const reportData = response.data?.data;
      console.log('[CreateReportModal] Отчёт создан:', reportData);

      handleSubmitSnackbar('Отчет успешно создан');

      if (onSuccess) {
        onSuccess(reportData);
      }

      onClose();
    } catch (error) {
      console.error('[CreateReportModal] Ошибка при создании отчета:', error);
      handleHttpError(error);
      handleError('Ошибка при создании отчета');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <FormValidatedModal
      handleSubmit={handleSubmit}
      handleClose={handleClose}
      size={'md'}
      title={'Создание отчета'}
      submitButtonText={'Создать отчет'}
      isLoading={isLoading}
      disableSubmit={isLoading}
    >
      <div className={styles.modal_content}>
        <p>Вы уверены, что хотите создать отчет для этого этапа?</p>
        {isLoading && <p style={{ marginTop: '10px', color: '#1890ff' }}>Разбиваем на страницы...</p>}
      </div>
    </FormValidatedModal>
  );
};

export default CreateReportModal;