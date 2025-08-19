// components/PasswordsDisplay.js
import React from 'react';
import styles from './Passwords.module.sass';
import useMappedObj from '../../../../../../hooks/useMappedObj';
import { handleInfo } from '../../../../../../utils/snackbar';
import Card from '../../../../../../shared/Card';
import Title from '../../../../../../shared/Title';
import MultiInputPasswords from '../../../../../Clients/components/ClientPage/Passwords/Inputs/MultiInput.component';

const PasswordsDisplay = ({ passwordsData }) => {
  const mappedPasswords = useMappedObj(passwordsData);

  const defaultActions = (passId, path) => {
    return {
      // Оставляем только copy и see, остальные действия null
      copy: (text) => {
        navigator.clipboard
          .writeText(text)
          .then(() => handleInfo('Скопировано'));
      },
      delete: null,
      edit: null,
      submit: null,
      reset: null,
    };
  };

  return (
    <Card
      title={'Пароли клиента'}
      classTitle={styles.title}
      className={styles.card}
    >
      {/*<Title smallTable={true} title={'Пароли клиента'} />*/}
      {mappedPasswords?.map(([key, password]) => (
        <MultiInputPasswords
          key={password.id}
          index={password.id}
          param={'values'}
          onAdd={null} // Отключаем добавление
          passwordData={password}
          label={password.name}
          onActions={(path, parentId) => defaultActions(password.id, path)}
          isInput={false}
        />
      ))}
    </Card>
  );
};

export default PasswordsDisplay;
