import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import {
  handleError,
  handleInfo,
  handleSubmit as handleSubmitSnackbar,
} from '../../../../../../utils/snackbar';
import Modal from '../../../../../../shared/Modal';
import TextInput from '../../../../../../shared/TextInput';
import styles from './Modal.module.sass';
import cn from 'classnames';
import { formatDateToBackend } from '../../../../../../utils/formate.date';
import useLegals from '../../../../hooks/useLegals';
import useLegalsApi from '../../../../api/legals.api';
import { mapChangedFieldsForBackend } from '../../../../../../utils/store.utils';
import { mapSettingsDataToBackend } from '../../../../settings.mapper';
import FileUpload from '../../../../../../shared/FileUpload';
import Checkbox from '../../../../../../shared/Checkbox';
import FormValidatedModal from '../../../../../../shared/Modal/FormModal';
import CustomButtonContainer from '../../../../../../shared/Button/CustomButtonContainer';
import DeleteButton from '../../../../../../shared/Button/Delete';
import ConfirmationModal from '../../../../../../components/ConfirmationModal';
import useQueryParam from '../../../../../../hooks/useQueryParam';

const EditModal = observer(({ legalId, onClose }) => {
  const { store: legalsStore } = useLegals();
  const api = useLegalsApi();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const page = useQueryParam('page', 1);
  const [localLegal, setLocalLegal] = useState({
    companyName: '',
    email: '',
    inn: '',
    kpp: '',
    ogrn: '',
    checkingAccount: '',
    correspondentAccount: '',
    bankBic: '',
    bankName: '',
    legalAddress: '',
    realAddress: '',
    postAddress: '',
    certificateOfRegistration: '',
    directorName: '',
    isMainLegalEntity: false,
    signScan: null,
    stampScan: null,
  });

  const legal = useMemo(() => {
    return isEditMode ? legalsStore.getById(legalId) : localLegal;
  }, [
    isEditMode,
    legalId,
    legalsStore.services,
    legalsStore.drafts,
    localLegal,
  ]);

  useEffect(() => {
    if (legalId) {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [legalId]);

  const handleChange = (name, value, withId = true) => {
    if (isEditMode) {
      legalsStore.changeById(legalId, name, value, withId);
    } else {
      setLocalLegal((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (onError=null) => {
    try {
      if (isEditMode) {
        await api.updateLegal(legalId, legal);
      } else {
        await api.createLegal(
          mapSettingsDataToBackend(localLegal, Object.keys(localLegal)),
        );
      }
      handleSubmitSnackbar(
        isEditMode
          ? 'Юр. лицо успешно отредактировано'
          : 'Юр. лицо успешно создано',
      );
      onClose();
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      onError && onError()
    }
  };

  const handleReset = () => {
    if (isEditMode) {
      legalsStore.resetDraft(legalId);
    }
    onClose();
  };

  const handleDeleteLegal = async () => {
    try {
      await api.deleteLegal(legal?.id, page);
      handleInfo('Клиент удален');
    } catch (error) {
      handleError('Ошибка при удалении:', error);
    }
  };

  return (
    <>
      <ConfirmationModal
        label={'Вы действительно хотите удалить сделку?'}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        onConfirm={handleDeleteLegal}
      />
      <FormValidatedModal
        customButtons={
          isEditMode && (
            <CustomButtonContainer>
              <DeleteButton
                handleDelete={() => setIsDeleteModalOpen(true)}
                label={'Удалить сделку'}
              />
            </CustomButtonContainer>
          )
        }
        closeButton={'Отменить'}
        handleSubmit={handleSubmit}
        handleClose={handleReset}
        size={'md'}
      >
        <div className={styles.name}>
          {isEditMode ? 'Редактирование компании' : 'Создание компании'}
        </div>

        <TextInput
          name={'companyName'}
          required={true}
          placeholder={'Название предприятия'}
          onChange={({ target }) => handleChange('companyName', target.value)}
          value={legal.companyName || ''}
          edited={true}
          className={styles.input}
          label={'Название предприятия'}
        />

        <div className={styles.flex}>
          <TextInput
            name={'inn'}
            required={true}
            placeholder={'ИНН'}
            onChange={({ target }) => handleChange('inn', target.value)}
            value={legal.inn || ''}
            edited={true}
            className={styles.input}
            label={'ИНН'}
          />
          <TextInput
            required={true}
            name={'ogrn'}
            placeholder={'ОГРН'}
            onChange={({ target }) => handleChange('ogrn', target.value)}
            value={legal.ogrn || ''}
            edited={true}
            className={styles.input}
            label={'ОГРН'}
          />
        </div>
        <TextInput
          required={true}
          placeholder={'КПП'}
          name={'kpp'}
          onChange={({ target }) => handleChange('kpp', target.value)}
          value={legal.kpp || ''}
          edited={true}
          className={styles.input}
          label={'КПП'}
        />

        <div className={styles.flex}>
          <TextInput
            required={true}
            name={'checkingAccount'}
            placeholder={'Р/с №'}
            onChange={({ target }) =>
              handleChange('checkingAccount', target.value)
            }
            value={legal.checkingAccount || ''}
            edited={true}
            className={styles.input}
            label={'Р/с №'}
          />
          <TextInput
            required={true}
            name={'correspondentAccount'}
            placeholder={'Корреспондентский счет'}
            onChange={({ target }) =>
              handleChange('correspondentAccount', target.value)
            }
            value={legal.correspondentAccount || ''}
            edited={true}
            className={styles.input}
            label={'Корреспондентский счет'}
          />
        </div>

        <div className={styles.flex}>
          <TextInput
            required={true}
            name={'bankBic'}
            placeholder={'БИК'}
            onChange={({ target }) => handleChange('bankBic', target.value)}
            value={legal.bankBic || ''}
            edited={true}
            className={styles.input}
            label={'БИК'}
          />
          <TextInput
            required={true}
            name={'bankName'}
            placeholder={'Банк'}
            onChange={({ target }) => handleChange('bankName', target.value)}
            value={legal.bankName || ''}
            edited={true}
            className={styles.input}
            label={'Банк'}
          />
        </div>

        <TextInput
          required={true}
          name={'legalAddress'}
          placeholder={'Юридический адрес'}
          onChange={({ target }) => handleChange('legalAddress', target.value)}
          value={legal.legalAddress || ''}
          edited={true}
          className={styles.input}
          label={'Юридический адрес'}
        />

        <TextInput
          required={true}
          name={'realAddress'}
          placeholder={'Фактический адрес'}
          onChange={({ target }) => handleChange('realAddress', target.value)}
          value={legal.realAddress || ''}
          edited={true}
          className={styles.input}
          label={'Фактический адрес'}
        />

        <TextInput
          required={true}
          name={'postAddress'}
          placeholder={'Почтовый адрес'}
          onChange={({ target }) => handleChange('postAddress', target.value)}
          value={legal.postAddress || ''}
          edited={true}
          className={styles.input}
          label={'Почтовый адрес'}
        />

        <TextInput
          required={true}
          name={'certificateOfRegistration'}
          placeholder={'Свидетельство о гос. регистрации'}
          onChange={({ target }) =>
            handleChange('certificateOfRegistration', target.value)
          }
          value={legal.certificateOfRegistration || ''}
          edited={true}
          className={styles.input}
          label={'Свидетельство о гос. регистрации'}
        />

        <div className={styles.flex}>
          <TextInput
            required={true}
            name={'email'}
            placeholder={'E-mail'}
            onChange={({ target }) => handleChange('email', target.value)}
            value={legal.email || ''}
            edited={true}
            type={'email'}
            className={styles.input}
            label={'E-mail'}
          />
          <TextInput
            required={true}
            name={'directorName'}
            placeholder={'Директор'}
            onChange={({ target }) =>
              handleChange('directorName', target.value)
            }
            value={legal.directorName || ''}
            edited={true}
            className={styles.input}
            label={'Директор'}
          />
        </div>
        <div className={styles.flex}>
          <FileUpload
            required
            label="Скан подписи"
            name="signScan"
            value={legal.signScan}
            onChange={handleChange}
            acceptTypes=".pdf,.png,.jpg"
          />
          <FileUpload
            required
            label="Скан подписи"
            name="stampScan"
            value={legal.stampScan}
            onChange={handleChange}
            acceptTypes=".pdf,.png,.jpg"
          />
        </div>
        <Checkbox
          name={'isMainLegalEntity'}
          content={
            <span className={styles.checkbox_mainLegal}>Основное юр. лицо</span>
          }
          className={styles.checkbox}
          value={legal?.isMainLegalEntity ?? false}
          onChange={(name, value) => handleChange(name, value)}
        />
      </FormValidatedModal>
    </>
  );
});

export default EditModal;
