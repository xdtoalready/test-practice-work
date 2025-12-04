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

const ContractModal = ({ contract, serviceId, clientLegalType, onClose, onSuccess, isEdit = false }) => {
  const [number, setNumber] = useState('');
  const [sum, setSum] = useState('');
  const [legalEntity, setLegalEntity] = useState(null);
  const [clientContactPhone, setClientContactPhone] = useState('');
  const [clientContactEmail, setClientContactEmail] = useState('');
  const [director, setDirector] = useState('');
  const [signer, setSigner] = useState('');
  const [signerTitle, setSignerTitle] = useState('');
  const api = useContractsApi();

  useEffect(() => {
    if (isEdit && contract) {
      setNumber(contract.number ? String(contract.number) : '');
      setSum(contract.sum ? String(contract.sum) : '');
      setClientContactPhone(contract.clientContactPhone || '+7 ');
      setClientContactEmail(contract.clientContactEmail || '');
      setDirector(contract.director || '');
      setSigner(contract.signer || '');
      setSignerTitle(contract.signerTitle || '');
      // Если есть legalEntityId в contract, найдем соответствующее юр лицо
      if (contract.legalEntityId) {
        const foundEntity = legalEntities.find(e => e.id === contract.legalEntityId);
        setLegalEntity(foundEntity || null);
      }
    } else if (!isEdit) {
      // При создании нового договора инициализируем телефон с +7
      setClientContactPhone('+7 ');
    }
  }, [contract, isEdit]);

  // Обработчик изменения номера договора (только цифры, максимум 4 символа)
  const handleNumberChange = (e) => {
    const value = e.target.value;
    // Разрешаем только цифры и максимум 4 символа
    if (/^\d{0,4}$/.test(value)) {
      setNumber(value);
    }
  };

  // Обработчик изменения суммы (только положительные числа)
  const handleSumChange = (e) => {
    const value = e.target.value;
    // Разрешаем только цифры
    if (value === '' || /^\d+$/.test(value)) {
      setSum(value);
    }
  };

  const handleSubmit = async () => {
    try {
      const sumNumber = parseInt(sum, 10);
      const contractData = {
        number,
        sum: sumNumber,
        legalEntityId: legalEntity?.id,
        clientContactPhone,
        clientContactEmail,
        director,
        signer,
        signerTitle,
      };

      if (isEdit && contract?.id) {
        await api.updateContract(contract.id, contractData);
      } else {
        await api.createContract(serviceId, contractData);
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

  // Проверяем, является ли клиент юридическим лицом (LEGAL) а не индивидуальным предпринимателем (INDIVIDUAL)
  // Показываем поля director, signer, signer_title только для LEGAL
  const isLegalEntity = clientLegalType === 'LEGAL';

  return (
    <FormValidatedModal
      handleSubmit={handleSubmit}
      handleClose={handleClose}
      size={'md'}
      title={isEdit ? 'Редактирование договора' : 'Создание договора'}
      submitButtonText={isEdit ? 'Сохранить' : 'Создать'}
      isLoading={api.isLoading}
      disableSubmit={api.isLoading || !number.trim() || !sum.trim() || parseInt(sum) <= 0 || !legalEntity || clientContactPhone.length < 18 || !clientContactEmail.trim()}
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
          onChange={handleNumberChange}
          name={'number'}
          value={number}
          placeholder={'Введите номер договора (4 цифры)'}
          label={'Номер договора'}
          className={styles.input}
        />
        <TextInput
          required={true}
          onChange={handleSumChange}
          name={'sum'}
          value={sum}
          placeholder={'Введите сумму договора'}
          label={'Сумма'}
          className={styles.input}
          type={'number'}
        />
        <TextInput
          required={true}
          onChange={(e) => setClientContactPhone(e.target.value)}
          name={'clientContactPhone'}
          value={clientContactPhone}
          placeholder={'+7 (___) ___-__-__'}
          label={'Контактный телефон'}
          className={styles.input}
          type={'phone'}
        />
        <TextInput
          required={true}
          onChange={(e) => setClientContactEmail(e.target.value)}
          name={'clientContactEmail'}
          value={clientContactEmail}
          placeholder={'Введите контактный e-mail'}
          label={'Контактный e-mail'}
          className={styles.input}
          type={'email'}
        />
        {isLegalEntity && (
          <>
            <TextInput
              onChange={(e) => setDirector(e.target.value)}
              name={'director'}
              value={director}
              placeholder={'Введите ФИО директора'}
              label={'ФИО директора'}
              className={styles.input}
            />
            <TextInput
              onChange={(e) => setSigner(e.target.value)}
              name={'signer'}
              value={signer}
              placeholder={'Введите ФИО подписанта'}
              label={'ФИО подписанта'}
              className={styles.input}
            />
            <TextInput
              onChange={(e) => setSignerTitle(e.target.value)}
              name={'signerTitle'}
              value={signerTitle}
              placeholder={'Введите должность подписанта'}
              label={'Должность подписанта'}
              className={styles.input}
            />
          </>
        )}
      </div>
    </FormValidatedModal>
  );
};

export default ContractModal;
