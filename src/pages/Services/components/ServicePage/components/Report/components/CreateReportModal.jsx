import React, { useState } from 'react';
import FormValidatedModal from '../../../../../../../shared/Modal/FormModal';
import styles from './CreateReportModal.module.sass';
import {
  handleError,
  handleSubmit as handleSubmitSnackbar,
} from '../../../../../../../utils/snackbar';
import { http, handleHttpError } from '../../../../../../../shared/http';
import { splitHtmlIntoPages } from '../../../../../../../utils/pdf-report.utils';

const CreateReportModal = ({ stageId, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Шаг 1: Получаем контент через prepare_tasks
      const prepareResponse = await http.get(`/api/reports/${stageId}/prepare_tasks`);
      const htmlContent = prepareResponse.data?.data || prepareResponse.data || '';

      // Шаг 2: Разбиваем контент на страницы (с предзагрузкой изображений)
      const splitContent = await splitHtmlIntoPages(htmlContent);

      // Шаг 3: Отправляем на generate (теперь POST с телом)
      const response = await http.post(`/api/reports/${stageId}/generate`, {
        tasks: splitContent,
      });

      const reportData = response.data?.data;

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