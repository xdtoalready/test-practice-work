import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../../../../../../shared/Modal';
import modlaStyles from '../../../ClientsTable/CreateModal/styles.module.sass';
import TextInput from '../../../../../../shared/TextInput';
import styles from '../../../../../Services/components/ServicesTable/components/EditModal/Modal.module.sass';
import cn from 'classnames';
import useClientsApi from '../../../../clients.api';
import { genderType } from '../../../../../Settings/settings.types';
import Radio from '../../../../../../shared/Radio';
import RadioGenderInput from '../../../../../../components/RadioGenderInput';
import { handleSubmit as handleSubmitSnackbar, handleInfo } from '../../../../../../utils/snackbar';
import useStore from '../../../../../../hooks/useStore';
import { observer } from 'mobx-react';
import FormValidatedModal from '../../../../../../shared/Modal/FormModal';
import ConfirmationModal from '../../../../../../components/ConfirmationModal';
import DeleteButton from '../../../../../../shared/Button/Delete';

const CreateClientsModal = ({
  entityId,
  companyId,
  onClose,
  clientId,
  store,
  api,
  onSubmit,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    site: '',
    role: '',
    comment: '',
    whatsapp: '',
    telegram: '',
    viber: '',
    email: '',
    phone: '',
    gender: genderType.male,
    name: '',
    middle_name: '',
    last_name: '',
  });
  const client = useMemo(() => {
    return isEditMode
      ? store.getById(entityId)?.contactPersons?.[clientId]
      : newClient;
  }, [isEditMode, clientId, store.currentClient, store.drafts, newClient]);

  useEffect(() => {
    if (Number.isInteger(clientId)) {
      setIsEditMode(true); // Режим редактирования
    } else {
      setIsEditMode(false); // Режим создания
    }
  }, [clientId]);
  const handleChange = (name, value, withId = true) => {

    if (isEditMode) {
      store.changeById(entityId, name, value, withId);
    } else {
      setNewClient((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleReset = () => {
    if (isEditMode) {
      store.resetDraft(entityId); // Сброс черновика в режиме редактирования
    }
    onClose(); // Закрытие модалки
  };
  const handleSubmit = async (onError = null) => {
    try {
      if (isEditMode) {
        await api
          .updateClient(
            store,
            entityId,
            clientId,
            'Контактные данные клиента обновлены!',
          )
          .then(onSubmit);
      } else {
        await api.createClient(companyId, newClient).then(onSubmit);
        handleSubmitSnackbar('Создано контактное лицо!');
      }
      store.submitDraft(entityId);

      onClose(); // Закрываем модалку
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      onError && onError();
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteClient(clientId, companyId);
      handleInfo('Контактное лицо удалено');
      setIsDeleteModalOpen(false);
      onClose();
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error('Ошибка при удалении контактного лица:', error);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <FormValidatedModal
        handleSubmit={handleSubmit}
        handleClose={handleReset}
        size={'md'}
        customButtons={
          isEditMode && (
            <DeleteButton
              label={'Удалить контактное лицо'}
              handleDelete={() => setIsDeleteModalOpen(true)}
            />
          )
        }
      >
        <div className={modlaStyles.header}>
          {isEditMode
            ? 'Редактирование контактного лица'
            : 'Создание контактного лица'}
        </div>
      <div className={modlaStyles.flexDiv}>
        <TextInput
          onChange={({ target }) =>
            handleChange(
              isEditMode ? `contactPersons.${clientId}.last_name` : 'last_name',
              target.value,
            )
          }
          name={
            isEditMode ? `contactPersons.${clientId}.last_name` : 'last_name'
          }
          value={client?.last_name}
          edited={true}
          className={cn(styles.input, modlaStyles.grow)}
          label={'Фамилия'}
          // required={true}
          placeholder={'Фамилия'}
        />
        <TextInput
          onChange={({ target }) =>
            handleChange(
              isEditMode ? `contactPersons.${clientId}.name` : 'name',
              target.value,
            )
          }
          name={isEditMode ? `contactPversons.${clientId}.name` : 'name'}
          value={client?.name}
          edited={true}
          className={cn(styles.input, modlaStyles.grow)}
          label={'Имя'}
          // required={true}
          placeholder={'Имя'}
        />
        <TextInput
          onChange={({ target }) =>
            handleChange(
              isEditMode
                ? `contactPersons.${clientId}.middle_name`
                : 'middle_name',
              target.value,
            )
          }
          name={
            isEditMode
              ? `contactPersons.${clientId}.middle_name`
              : 'middle_name'
          }
          value={client?.middle_name}
          edited={true}
          className={cn(styles.input)}
          label={'Отчество'}
          placeholder={'Отчество'}
        />
      </div>
      <div className={modlaStyles.flexDiv}></div>
      <div className={modlaStyles.flexDiv}>
        {/*<TextInput*/}
        {/*  onChange={({ target }) =>*/}
        {/*    handleChange(*/}
        {/*      isEditMode ? `contactPersons.${clientId}.last_name` : 'last_name',*/}
        {/*      target.value,*/}
        {/*    )*/}
        {/*  }*/}
        {/*  name={*/}
        {/*    isEditMode ? `contactPersons.${clientId}.last_name` : 'last_name'*/}
        {/*  }*/}
        {/*  value={client.last_name}*/}
        {/*  edited={true}*/}
        {/*  className={cn(styles.input)}*/}
        {/*  label={'Отчество'}*/}
        {/*  placeholder={'Отчество'}*/}
        {/*/>*/}
        {/*<RadioGenderInput*/}
        {/*  value={newClient.gender}*/}
        {/*  onChange={handleChange}*/}
        {/*  isEditMode={false}*/}
        {/*/>*/}
      </div>
      <div className={modlaStyles.flexDiv}>
        <TextInput
          onChange={({ target }) =>
            handleChange(
              isEditMode ? `contactPersons.${clientId}.tel` : 'phone',
              target.value,
            )
          }
          name={isEditMode ? `contactPersons.${clientId}.tel` : 'phone'}
          value={isEditMode ? client?.tel : client?.phone}
          edited={true}
          className={cn(styles.input, modlaStyles.grow)}
          label={'Телефон'}
          placeholder={'Телефон'}
        />
        <TextInput
          onChange={({ target }) =>
            handleChange(
              isEditMode ? `contactPersons.${clientId}.email` : 'email',
              target.value,
            )
          }
          name={isEditMode ? `contactPersons.${clientId}.email` : 'email'}
          value={client?.email}
          edited={true}
          className={cn(styles.input, modlaStyles.grow)}
          label={'Почта'}
          placeholder={'Почта'}
        />

        {/*<TextInput*/}
        {/*  onChange={({ target }) => handleChange('email', target.value)}*/}
        {/*  name={'email'}*/}
        {/*  value={newClient.email}*/}
        {/*  edited={true}*/}
        {/*  className={cn(styles.input, modlaStyles.grow)}*/}
        {/*  label={'email'}*/}
        {/*  placeholder={'email'}*/}
        {/*/>*/}
      </div>
      <div>
        <TextInput
          onChange={({ target }) =>
            handleChange(
              isEditMode ? `contactPersons.${clientId}.comment` : 'comment',
              target.value,
            )
          }
          name={isEditMode ? `contactPersons.${clientId}.comment` : 'comment'}
          value={isEditMode ? client?.comment : client?.comment}
          edited={true}
          className={cn(styles.input, modlaStyles.grow)}
          label={'Комментарий к телефону'}
          placeholder={'Комментарий...'}
        />
      </div>
      <div className={modlaStyles.flexDiv}>
        {/*<TextInput*/}
        {/*  onChange={({ target }) =>*/}
        {/*    handleChange(*/}
        {/*      isEditMode ? `contactPersons.${clientId}.site` : 'site',*/}
        {/*      target.value,*/}
        {/*    )*/}
        {/*  }*/}
        {/*  name={isEditMode ? `contactPersons.${clientId}.site` : 'site'}*/}
        {/*  value={client?.site}*/}
        {/*  edited={true}*/}
        {/*  className={cn(styles.input, modlaStyles.grow)}*/}
        {/*  label={'Сайт'}*/}
        {/*  placeholder={'Сайт'}*/}
        {/*/>*/}
        <TextInput
          onChange={({ target }) =>
            handleChange(
              isEditMode ? `contactPersons.${clientId}.role` : 'role',
              target.value,
            )
          }
          name={isEditMode ? `contactPersons.${clientId}.role` : 'role'}
          value={client?.role}
          edited={true}
          className={cn(styles.input, modlaStyles.grow)}
          label={'Должность'}
          placeholder={'Должность'}
        />
      </div>
      <div className={modlaStyles.flexDiv}>
        <TextInput
          onChange={({ target }) =>
            handleChange(
              isEditMode
                ? `contactPersons.${clientId}.messengers.whatsapp.value`
                : 'whatsapp',
              isEditMode ? target.value : target.value,
            )
          }
          name={
            isEditMode
              ? `contactPersons.${clientId}.messengers.whatsapp.value`
              : 'whatsapp'
          }
          value={
            isEditMode ? client?.messengers?.whatsapp?.value : client?.whatsapp
          }
          edited={true}
          className={cn(styles.input, modlaStyles.grow)}
          label={'Whatsapp (Телефон)'}
          placeholder={'Телефон'}
        />
        <TextInput
          onChange={({ target }) =>
            handleChange(
              isEditMode
                ? `contactPersons.${clientId}.messengers.telegram.value`
                : 'telegram',
              isEditMode ? target.value : target.value,
            )
          }
          name={
            isEditMode
              ? `contactPersons.${clientId}.messengers.telegram.value`
              : 'telegram'
          }
          value={
            isEditMode ? client?.messengers?.telegram?.value : client?.telegram
          }
          edited={true}
          className={cn(styles.input, modlaStyles.grow)}
          label={'Telegram (без @)'}
          validate={(value) =>
            value?.toString()?.includes('@')
              ? 'Вводите юзернейм телеграмма без @'
              : true
          }
          placeholder={'telegram'}
        />

        {/*<TextInput*/}
        {/*  onChange={({ target }) =>*/}
        {/*    handleChange(*/}
        {/*      isEditMode*/}
        {/*        ? `contactPersons.${clientId}.messengers.viber.value`*/}
        {/*        : 'viber',*/}
        {/*      isEditMode ? target.value : { value: target.value },*/}
        {/*    )*/}
        {/*  }*/}
        {/*  name={*/}
        {/*    isEditMode*/}
        {/*      ? `contactPersons.${clientId}.messengers.viber.value`*/}
        {/*      : 'viber'*/}
        {/*  }*/}
        {/*  value={client?.viber?.value}*/}
        {/*  edited={true}*/}
        {/*  className={cn(styles.input, modlaStyles.grow)}*/}
        {/*  label={'Viber'}*/}
        {/*  placeholder={'viber'}*/}
        {/*/>*/}
      </div>

      <div className={modlaStyles.flexDiv}></div>
      </FormValidatedModal>

      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          label="Вы уверены, что хотите удалить контактное лицо?"
        />
      )}
    </>
  );
};

export default CreateClientsModal;
