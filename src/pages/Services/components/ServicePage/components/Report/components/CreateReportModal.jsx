import React, { useState } from 'react';
import FormValidatedModal from '../../../../../../../shared/Modal/FormModal';
import TextInput from '../../../../../../../shared/TextInput';
import styles from './CreateReportModal.module.sass';
import { 
  handleError, 
  handleSubmit as handleSubmitSnackbar 
} from '../../../../../../../utils/snackbar';
import { http, handleHttpError } from '../../../../../../../shared/http';

const CreateReportModal = ({ stageId, onClose, onSuccess }) => {
  const [seoConclusion, setSeoConclusion] = useState(' ');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Отправляем GET запрос с параметром work_plan в теле
      const response = await http.get(
        `/api/report/${stageId}/generate`,
        {
          params: {
            work_plan: seoConclusion === ' ' ? '' : seoConclusion
          }
        }
      );

      // Данные отчета приходят в response.data
      const reportData = response.data?.data;
      
      handleSubmitSnackbar('Отчет успешно создан');
      
      if (onSuccess) {
        onSuccess(reportData);
      }
      
      onClose();
    } catch (error) {
      console.error('Ошибка при создании отчета:', error);
      handleHttpError(error);
      handleError('Ошибка при создании отчета', error);
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
        <TextInput
          onChange={({ target }) => setSeoConclusion(target.value)}
          name={'seo_conclusion'}
          value={seoConclusion}
          edited={true}
          type={'editor'}
          className={styles.textarea}
          label={'Вывод от seo-специалиста'}
          disabled={isLoading}
        />
      </div>
    </FormValidatedModal>
  );
};

export default CreateReportModal;