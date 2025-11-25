import React, { useState, useEffect } from 'react';
import FormValidatedModal from '../../../../../../shared/Modal/FormModal';
import TextInput from '../../../../../../shared/TextInput';
import Dropdown from '../../../../../../shared/Dropdown/Default';
import styles from './ContractModal.module.sass';
import useContractsApi from '../../../../api/contracts.api';

// Хардкод юридических лиц (как в фильтрах счетов)
const legalEntities = [
  { id: 1, name: 'ИП Шилов Александр Александрович' },
  { id: 2, name: 'ООО "СОВРЕМЕННЫЙ МАРКЕТИНГ"' },
  { id: 3, name: 'ООО "СМ-РЕКЛАМА"' },
];

const ContractModal = ({ contract, serviceId, onClose, onSuccess, isEdit = false }) => {
  const [number, setNumber] = useState('');
  const [legalEntity, setLegalEntity] = useState(null);
  const api = useContractsApi();

  useEffect(() => {
    if (isEdit && contract) {
      setNumber(contract.number || '');
      // Если есть legalEntityId в contract, найдем соответствующее юр лицо
      if (contract.legalEntityId) {
        const foundEntity = legalEntities.find(e => e.id === contract.legalEntityId);
        setLegalEntity(foundEntity || null);
      }
    }
  }, [contract, isEdit]);

  const handleSubmit = async () => {
    try {
      if (isEdit && contract?.id) {
        await api.updateContract(contract.id, number, legalEntity?.id);
      } else {
        await api.createContract(number, serviceId, legalEntity?.id);
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
      disableSubmit={api.isLoading || !number.trim() || !legalEntity}
    >
      <div className={styles.modal_content}>
        <Dropdown
          required={true}
          name={'legalEntity'}
          setValue={setLegalEntity}
          classNameContainer={styles.input}
          label={'Юридическое лицо'}
          value={legalEntity}
          renderValue={(val) => val.name}
          renderOption={(opt) => opt.name}
          options={legalEntities}
        />
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
