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
import RequisitesComponent from './Inputs/Requisites.component';
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
    <Card classTitle={styles.title} className={styles.card}>
      <Title
        smallTable={true}
        actions={
          {
            // add: {
            //   action: () => null,
            //   title: 'Добавить клиента',
            // },
          }
        }
        title={'Контактные данные'}
      />
      <MultiInputContacts
        onAdd={onAdd}
        contactData={contactData}
        label={'Телефон'}
        param={'tel'}
        type={'tel'}
        onActions={(path) => ({call: handlePhoneClick, ...defaultActions(path, 'Телефон сохранен', 'Телефон восстановлен')})
        }
      />
      <MultiInputContacts
        onAdd={onAdd}
        contactData={contactData}
        label={'Адрес'}
        param={'address'}
        type={'textarea'}
        classInput={styles.input}
        onActions={(path) =>
          defaultActions(path, 'Адрес сохранен', 'Адрес восстановлен')
        }
      />
      <MultiInputContacts
        onAdd={onAdd}
        contactData={contactData}
        label={'Почта'}
        param={'email'}
        type={'email'}
        onActions={(path) =>
          defaultActions(path, 'Почта сохранена', 'Почта восстановлена')
        }
      />
      {/*<MultiInputContacts*/}
      {/*  onAdd={onAdd}*/}
      {/*  contactData={contactData}*/}
      {/*  label={'Сайт'}*/}
      {/*  param={'site'}*/}
      {/*  type={'email'}*/}
      {/*  onActions={(path) =>*/}
      {/*    defaultActions(path, 'Сайт сохранен', 'Сайт восстановлен')*/}
      {/*  }*/}
      {/*/>*/}
      <RequisitesComponent
        onAdd={onAdd}
        contactData={contactData}
        label={'Юр. реквизиты'}
        onActions={(path, onSaveText, onCloseText) =>
          defaultActions(path, onSaveText, onCloseText)
        }
      />
    </Card>
  );
};

export default ClientsContacts;
