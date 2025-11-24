import React, { useState, useEffect } from 'react';
import FormValidatedModal from '../../../../../../shared/Modal/FormModal';
import TextInput from '../../../../../../shared/TextInput';
import styles from './ContractModal.module.sass';
import useContractsApi from '../../../../api/contracts.api';

const ContractModal = ({ contract, serviceId, onClose, onSuccess, isEdit = false }) => {
  const [number, setNumber] = useState('');
  const api = useContractsApi();

  useEffect(() => {
    if (isEdit && contract) {
      setNumber(contract.number || '');
    }
  }, [contract, isEdit]);

  const handleSubmit = async () => {
    try {
      if (isEdit && contract?.id) {
        await api.updateContract(contract.id, number);
      } else {
        await api.createContract(number, serviceId);
      }

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error('Error saving contract:', error);
    }
  };

  const handleClose = () => {
    if (!api.isLoading) {
      onClose();
    }
  };

  return (
    <FormValidatedModal
      handleSubmit={handleSubmit}
      handleClose={handleClose}
      size={'md'}
      title={isEdit ? 'Редактирование договора' : 'Создание договора'}
      submitButtonText={isEdit ? 'Сохранить' : 'Создать'}
      isLoading={api.isLoading}
      disableSubmit={api.isLoading || !number.trim()}
    >
      <div className={styles.modal_content}>
        <TextInput
          required={true}
          onChange={({ target }) => setNumber(target.value)}
          name={'number'}
          value={number}
          placeholder={'Введите номер договора'}
          label={'Номер договора'}
          className={styles.input}
        />
      </div>
    </FormValidatedModal>
  );
};

export default ContractModal;
