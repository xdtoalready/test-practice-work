import React from 'react';
import { handleInfo } from '../../../../../utils/snackbar';
import Card from '../../../../../shared/Card';
import styles from './Contacts.module.sass';
import RequisitesCard from './Requisites';
import MultiInputContacts from './Inputs/MultiInput.component';

const ClientsContacts = ({ contactData, client, onChange, onSubmit, onReset, onAdd }) => {
  const defaultActions = (path, success, info, copy = 'Элемент скопирован') => {
    return {
      copy: (text) => {
        navigator.clipboard.writeText(text).then(() => handleInfo(copy));
      },
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

  return (
    <>
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

      <RequisitesCard
        contactData={contactData}
        client={client}
        onActions={defaultActions}
      />
    </>
  );
};

export default ClientsContacts;
