import React, { useState } from 'react';
import FormValidatedModal from '../../../../../../../shared/Modal/FormModal';
import styles from './CreateReportModal.module.sass';
import {
  handleError,
  handleSubmit as handleSubmitSnackbar
} from '../../../../../../../utils/snackbar';
import { http, handleHttpError } from '../../../../../../../shared/http';

const CreateReportModal = ({ stageId, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const response = await http.get(`/api/reports/${stageId}/generate`);

      const reportData = response.data?.data;

      handleSubmitSnackbar('Отчет успешно создан');

      if (onSuccess) {
        onSuccess(reportData);
      }

      onClose();
    } catch (error) {
      console.error('Ошибка при создании отчета:', error);
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
    >
      <div className={styles.modal_content}>
        <p>Вы уверены, что хотите создать отчет для этого этапа?</p>
      </div>
    </FormValidatedModal>
  );
};

export default CreateReportModal;