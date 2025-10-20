import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import CardInput from '../../../../../shared/Input/Card';
import {
  handleError,
  handleInfo,
  handleSubmit,
} from '../../../../../utils/snackbar';
import Title from '../../../../../shared/Title';
import Card from '../../../../../shared/Card';
import styles from './Contacts.module.sass';
import RequisitesCard from './Requisites';
import MultiInputContacts from './Inputs/MultiInput.component';
import {useCallsContext} from "../../../../../providers/CallsProvider";

const ClientsContacts = ({
  contactData,
  onRemove,
  onChange,
  onSubmit,
  onReset,
  onAdd,
}) => {
    const { setSelectedPhone,openCallModal } = useCallsContext();
  const defaultActions = (path, success, info, copy = 'Элемент скопирован') => {
    // console.log(properties,'smile')
    return {
      copy: (text) => {
        navigator.clipboard.writeText(text).then((r) => handleInfo(copy));
      },
      // delete: ({ name }) => {
      //   onRemove(name);
      //   // setLength((prev) => ({...prev,[middleProp]:prev[middleProp]-1}))
      //   handleError('Элемент удален');
      // },
      edit: ({ name, value }) => {
        onChange(name, value);
      },
      submit: () => {
        onSubmit(path, success);
      },
      reset: () => {
        onReset(path);
        handleInfo(info);
      },
    };
  };

    const handlePhoneClick = (phone) => {
        openCallModal(phone);
    };

  return (
    <>
      {/* КАРТОЧКА 1: Контактные данные */}
      <Card title="Контактные данные" className={styles.card}>
        <MultiInputContacts
          onAdd={onAdd}
          contactData={contactData}
          label="Телефон"
          param="tel"
          type="phone"
          onActions={(path) =>
            defaultActions(path, 'Телефон сохранен', 'Телефон восстановлен')
          }
        />
        
        <MultiInputContacts
          onAdd={onAdd}
          contactData={contactData}
          label="Адрес"
          param="address"
          type="textarea"
          classInput={styles.input}
          onActions={(path) =>
            defaultActions(path, 'Адрес сохранен', 'Адрес восстановлен')
          }
        />
        
        <MultiInputContacts
          onAdd={onAdd}
          contactData={contactData}
          label="Почта"
          param="email"
          type="email"
          onActions={(path) =>
            defaultActions(path, 'Почта сохранена', 'Почта восстановлена')
          }
        />
      </Card>

      {/* КАРТОЧКА 2: Юридические реквизиты */}
      <RequisitesCard
        contactData={contactData}
        onActions={defaultActions}
      />
    </>
  );
};

export default ClientsContacts;
