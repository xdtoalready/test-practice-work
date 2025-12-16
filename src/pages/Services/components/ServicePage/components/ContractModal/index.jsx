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

const ContractModal = ({ contract, serviceId, clientLegalType, serviceType, onClose, onSuccess, isEdit = false }) => {
  const [sum, setSum] = useState('');
  const [legalEntity, setLegalEntity] = useState(null);
  const [clientContactPhone, setClientContactPhone] = useState('');
  const [clientContactEmail, setClientContactEmail] = useState('');
  const [director, setDirector] = useState('');
  const [signer, setSigner] = useState('');
  const [signerTitle, setSignerTitle] = useState('');
  const [task1, setTask1] = useState('');
  const [task2, setTask2] = useState('');
  const [task3, setTask3] = useState('');
  const [task4, setTask4] = useState('');
  const [task5, setTask5] = useState('');
  const [task6, setTask6] = useState('');
  const [sum1, setSum1] = useState('');
  const [sum2, setSum2] = useState('');
  const [sum3, setSum3] = useState('');
  const api = useContractsApi();

  useEffect(() => {
    if (isEdit && contract) {
      setSum(contract.sum ? String(contract.sum) : '');
      setClientContactPhone(contract.clientContactPhone || '+7 ');
      setClientContactEmail(contract.clientContactEmail || '');
      setDirector(contract.director || '');
      setSigner(contract.signer || '');
      setSignerTitle(contract.signerTitle || '');
      setTask1(contract.task1 || '');
      setTask2(contract.task2 || '');
      setTask3(contract.task3 || '');
      setTask4(contract.task4 || '');
      setTask5(contract.task5 || '');
      setTask6(contract.task6 || '');
      setSum1(contract.sum1 ? String(contract.sum1) : '');
      setSum2(contract.sum2 ? String(contract.sum2) : '');
      setSum3(contract.sum3 ? String(contract.sum3) : '');
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

  // Обработчик изменения суммы (только положительные числа)
  const handleSumChange = (e) => {
    const value = e.target.value;
    // Разрешаем только цифры
    if (value === '' || /^\d+$/.test(value)) {
      setSum(value);
    }
  };

  // Обработчики изменения сумм платежей (только положительные числа)
  const handleSum1Change = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setSum1(value);
    }
  };

  const handleSum2Change = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setSum2(value);
    }
  };

  const handleSum3Change = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setSum3(value);
    }
  };

  const handleSubmit = async () => {
    try {
      const sumNumber = parseInt(sum, 10);
      const contractData = {
        sum: sumNumber,
        legalEntityId: legalEntity?.id,
        clientContactPhone,
        clientContactEmail,
        director: director || '',
        signer: signer || '',
        signerTitle: signerTitle || '',
        task1: task1 || '',
        task2: task2 || '',
        task3: task3 || '',
        task4: task4 || '',
        task5: task5 || '',
        task6: task6 || '',
        sum1: sum1 ? parseInt(sum1, 10) : 0,
        sum2: sum2 ? parseInt(sum2, 10) : 0,
        sum3: sum3 ? parseInt(sum3, 10) : 0,
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

  // Проверяем, является ли услуга типом "development" для отображения дополнительных полей
  const isDevelopment = serviceType === 'development';

  // Проверка обязательных полей для LEGAL
  const legalFieldsValid = !isLegalEntity || (director.trim() && signer.trim() && signerTitle.trim());

  // Проверка обязательных полей для development
  const developmentFieldsValid = !isDevelopment || (task1.trim() && task2.trim() && task3.trim() && task4.trim() && task5.trim() && task6.trim());

  // Проверка суммы платежей для development (sum1 + sum2 + sum3 = sum)
  const sum1Number = sum1 ? parseInt(sum1, 10) : 0;
  const sum2Number = sum2 ? parseInt(sum2, 10) : 0;
  const sum3Number = sum3 ? parseInt(sum3, 10) : 0;
  const sumNumber = sum ? parseInt(sum, 10) : 0;
  const developmentSumsValid = !isDevelopment || (sum1Number + sum2Number + sum3Number === sumNumber && sum1.trim() && sum2.trim() && sum3.trim());

  return (
    <FormValidatedModal
      handleSubmit={handleSubmit}
      handleClose={handleClose}
      size={'md'}
      title={isEdit ? 'Редактирование договора' : 'Создание договора'}
      submitButtonText={isEdit ? 'Сохранить' : 'Создать'}
      isLoading={api.isLoading}
      disableSubmit={api.isLoading || !sum.trim() || parseInt(sum) <= 0 || !legalEntity || clientContactPhone.length < 18 || !clientContactEmail.trim() || !legalFieldsValid || !developmentFieldsValid || !developmentSumsValid}
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
          onChange={handleSumChange}
          name={'sum'}
          value={sum}
          placeholder={'Введите сумму договора'}
          label={'Сумма'}
          className={styles.input}
          type={'number'}
        />
        {isDevelopment && (
          <div className={styles.sum_row}>
            <TextInput
              required={true}
              onChange={handleSum1Change}
              name={'sum1'}
              value={sum1}
              placeholder={'Введите сумму 1-го платежа'}
              label={'Сумма 1-го платежа'}
              type={'number'}
            />
            <TextInput
              required={true}
              onChange={handleSum2Change}
              name={'sum2'}
              value={sum2}
              placeholder={'Введите сумму 2-го платежа'}
              label={'Сумма 2-го платежа'}
              type={'number'}
            />
            <TextInput
              required={true}
              onChange={handleSum3Change}
              name={'sum3'}
              value={sum3}
              placeholder={'Введите сумму 3-го платежа'}
              label={'Сумма 3-го платежа'}
              type={'number'}
            />
          </div>
        )}
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
              required={true}
              onChange={(e) => setDirector(e.target.value)}
              name={'director'}
              value={director}
              placeholder={'Введите ФИО директора'}
              label={'ФИО директора'}
              className={styles.input}
            />
            <TextInput
              required={true}
              onChange={(e) => setSigner(e.target.value)}
              name={'signer'}
              value={signer}
              placeholder={'Введите ФИО подписанта'}
              label={'ФИО подписанта'}
              className={styles.input}
            />
            <TextInput
              required={true}
              onChange={(e) => setSignerTitle(e.target.value)}
              name={'signerTitle'}
              value={signerTitle}
              placeholder={'Введите должность подписанта'}
              label={'Должность подписанта'}
              className={styles.input}
            />
          </>
        )}
        {isDevelopment && (
          <>
            <TextInput
              required={true}
              onChange={(e) => setTask1(e.target.value)}
              name={'task1'}
              value={task1}
              placeholder={'Введите задачу 1'}
              label={'Задача 1'}
              className={styles.input}
              type={'textarea'}
            />
            <TextInput
              required={true}
              onChange={(e) => setTask2(e.target.value)}
              name={'task2'}
              value={task2}
              placeholder={'Введите задачу 2'}
              label={'Задача 2'}
              className={styles.input}
              type={'textarea'}
            />
            <TextInput
              required={true}
              onChange={(e) => setTask3(e.target.value)}
              name={'task3'}
              value={task3}
              placeholder={'Введите задачу 3'}
              label={'Задача 3'}
              className={styles.input}
              type={'textarea'}
            />
            <TextInput
              required={true}
              onChange={(e) => setTask4(e.target.value)}
              name={'task4'}
              value={task4}
              placeholder={'Введите задачу 4'}
              label={'Задача 4'}
              className={styles.input}
              type={'textarea'}
            />
            <TextInput
              required={true}
              onChange={(e) => setTask5(e.target.value)}
              name={'task5'}
              value={task5}
              placeholder={'Введите задачу 5'}
              label={'Задача 5'}
              className={styles.input}
              type={'textarea'}
            />
            <TextInput
              required={true}
              onChange={(e) => setTask6(e.target.value)}
              name={'task6'}
              value={task6}
              placeholder={'Введите задачу 6'}
              label={'Задача 6'}
              className={styles.input}
              type={'textarea'}
            />
          </>
        )}
      </div>
    </FormValidatedModal>
  );
};

export default ContractModal;
