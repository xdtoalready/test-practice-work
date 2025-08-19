import React, { useMemo, useState } from 'react';
import MultiInputLabeled from '../../../../../../shared/Input/MultiLabeled/MultiLabeledInputs';
import CardInput from '../../../../../../shared/Input/Card';
import styles from '../Passwords.module.sass';

const credentialsLabels = {
  login: 'Логин',
  password: 'Пароль',
};

const createEmptyCredentials = () => ({
  login: '',
  password: '',
});

const MultiInputPasswords = ({
  onAdd,
  passwordData,
  label,
  onActions,
  param,
  index,
  isInput = true,
}) => {
  const length = useMemo(
    () => Object.keys(passwordData?.values ?? {}).length,
    [passwordData],
  );

  return (
    <MultiInputLabeled
      actions={{
        ...onActions(`passwords.${index}.name`, `passwords.${index}`),
        copy: null,
      }}
      isInput={isInput}
      name={`passwords.${index}.name`}
      label={label}
      onAdd={() => {
        onAdd(
          `passwords.${index}.${param}.${length}`,
          createEmptyCredentials(),
        );
      }}
    >
      {Object.entries(passwordData[param] ?? {}).map(([key, value], i) => {
        const actions = onActions(`passwords.${index}.${param}.${key}`);

        return (
          <CardInput
            placeholder={`${credentialsLabels[key]}...`}
            multiple={true}
            label={credentialsLabels[key]}
            name={`passwords.${index}.${param}.${key}`}
            labeled={true}
            type={key === 'password' ? 'password' : 'text'}
            value={value}
            actions={{ ...actions, see: key === 'password', delete: null }}
          />
        );
      })}
    </MultiInputLabeled>
  );
};

export default MultiInputPasswords;
