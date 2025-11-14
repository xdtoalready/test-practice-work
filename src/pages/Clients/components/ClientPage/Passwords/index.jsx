import React from 'react';
import { handleError, handleInfo } from '../../../../../utils/snackbar';
import Card from '../../../../../shared/Card';
import styles from './Passwords.module.sass';
import Title from '../../../../../shared/Title';
import MultiInputPasswords from './Inputs/MultiInput.component';
import useMappedObj from '../../../../../hooks/useMappedObj';

const ClientPasswords = ({
                           passwordsData,
                           onRemove,
                           onChange,
                           onSubmit,
                           onReset,
                           onAdd,
                         }) => {
  const mappedPasswords = useMappedObj(passwordsData);
  const defaultActions = (
    passId,
    path,
    success,
    info,
    parentId = '',
    copy = 'Элемент скопирован',
  ) => {
    const password = passwordsData[passId];
    const isReadonly = password?.readonly;
    return {
      copy: (text) => {
        navigator.clipboard.writeText(text).then(() => handleInfo(copy));
      },
      delete: isReadonly
        ? null
        : ({ name }) => {
          if (parentId) {
            onRemove(parentId, passId);
            return;
          } else onRemove(name, passId);
          handleError('Элемент удален');
        },
      edit: isReadonly ? null : ({ name, value }) => onChange(name, value),
      submit: () => {
        onSubmit(path, passId, success);
      },
      reset: isReadonly
        ? null
        : () => {
          onReset(path);
          handleInfo(info);
        },
    };
  };

  return (
    <Card classTitle={styles.title} className={styles.card}>
      <Title
        smallTable={true}
        actions={{
          add: {
            action: () => onAdd(),
            title: 'Добавить пароль',
          },
        }}
        title={'Пароли клиента'}
      />
      {mappedPasswords?.map(([key, password], index) => {
        return (
          <MultiInputPasswords
            isInput={!password.isLkAccount}
            index={password.id}
            param={'values'}
            onAdd={onAdd}
            passwordData={password}
            label={password.name}
            onActions={(path, parentId) =>
              defaultActions(
                password.id,
                path,
                'Пароль сохранен',
                'Пароль восстановлен',
                parentId,
              )
            }
          />
        );
      })}
    </Card>
  );
};

export default ClientPasswords;
