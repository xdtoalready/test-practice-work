import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../../../../../../shared/Modal';
import modlaStyles from '../../../ClientsTable/CreateModal/styles.module.sass';
import TextInput from '../../../../../../shared/TextInput';
import styles from '../../../../../Services/components/ServicesTable/components/EditModal/Modal.module.sass';
import cn from 'classnames';
import { handleInfo, handleSubmit as handleSubmitSnackbar } from '../../../../../../utils/snackbar';
import FormValidatedModal from '../../../../../../shared/Modal/FormModal';
import CustomButtonContainer from '../../../../../../shared/Button/CustomButtonContainer';
import DeleteButton from '../../../../../../shared/Button/Delete';
import ConfirmationModal from '../../../../../../components/ConfirmationModal';

const CreateSiteModal = ({
                           companyId,
                           onClose,
                           siteId,
                           onSubmit,
                           store,
  api
                         }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [newSite, setNewSite] = useState({
    url: '',
    topvisor_token: '',
    ymetrics_token: '',
  });
  const client = useMemo(() => {
    return isEditMode
      ? store.getById(companyId)?.sites?.[siteId]
      : newSite;
  }, [isEditMode, companyId, store.currentClient, store.drafts, newSite]);


  const handleChange = (name, value, withId = true) => {

    if (isEditMode) {
      store.changeById(companyId, name, value, withId);
    } else {
      setNewSite((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    setIsEditMode(Number.isInteger(siteId));
  }, [siteId]);

  const handleReset = () => {
    if (isEditMode) {
      store.resetDraft(companyId); // Сброс черновика в режиме редактирования
    }
    onClose(); // Закрытие модалки
  };
  const handleSubmit = async (onError = null) => {
    try {


      if (isEditMode) {
        await api
          .updateSite(
            companyId,
            siteId, null,
            'Сайт клиента обновлен!',
          )
      } else {
        await api.createSite(companyId, newSite)
        handleSubmitSnackbar('Создано контактное лицо!');
      }
      store.submitDraft(companyId);

      onClose();
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      onError && onError();
    }
  };


  const handleDeleteTask = async () => {
    try {
      await api.deleteSite(companyId, siteId)
      handleInfo('Сайт удален');

      onClose();
    } catch (e) {
      handleInfo('Ошибка при удалении сайта:', e);
    }
  };


  return (
    <>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
        label="Вы уверены, что хотите удалить данные метрик для сайта?"
      />
    <FormValidatedModal
      handleSubmit={()=>{
        handleSubmit();
      }}
      handleClose={handleReset}
      customButtons={
        isEditMode && (
          <CustomButtonContainer>
            <DeleteButton
              handleDelete={() => setIsDeleteModalOpen(true)}
              label={'Удалить доступы к сайту '}
            />
          </CustomButtonContainer>
        )
      }
      size={'md'}
    >
      <div className={modlaStyles.header}>
        {isEditMode ? 'Редактирование сайта' : 'Создание сайта'}
      </div>
      <div className={modlaStyles.flexDiv}>
        <TextInput
          onChange={({ target }) =>
            handleChange(
              isEditMode ? `sites.${siteId}.url` : 'url',
              target.value,
            )
          }
          // name={
          //   isEditMode ? `sites.${siteId}.url` : 'url'
          // }

          value={client?.url}
          edited={true}
          className={cn(styles.input, modlaStyles.grow)}
          label={'URL сайта'}
          required={true}
          placeholder={'https://example.com'}
        />
      </div>
      <div className={modlaStyles.flexDiv}>
        <TextInput
          onChange={({ target }) =>
            handleChange(
              isEditMode ? `sites.${siteId}.topvisor_token` : 'topvisor_token',
              target.value,
            )
          }
          // name={
          //   isEditMode ? `sites.${siteId}.topvisor_token` : 'topvisor_token'
          // }
          value={client?.topvisor_token}
          edited={true}
          className={cn(styles.input, modlaStyles.grow)}
          label={'Id проекта Topvisor'}
          placeholder={'12345'}
        />
        <TextInput
          onChange={({ target }) =>
            handleChange(
              isEditMode ? `sites.${siteId}.ymetrics_token` : 'ymetrics_token',
              target.value,
            )
          }
          // name={
          //   isEditMode ? `sites.${siteId}.ymetrics_token` : 'ymetrics_token'
          // }
          value={client?.ymetrics_token}
          edited={true}
          className={cn(styles.input, modlaStyles.grow)}
          label={'Id счетчика Яндекс'}
          placeholder={'67890'}
        />
      </div>
    </FormValidatedModal>
    </>
  );
};

export default CreateSiteModal;