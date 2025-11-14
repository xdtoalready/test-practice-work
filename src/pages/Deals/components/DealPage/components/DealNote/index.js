import React from 'react';
import { handleInfo } from '../../../../../../utils/snackbar';
import Card from '../../../../../../shared/Card';
import styles from '../../../../../Clients/components/ClientPage/Contacts/Contacts.module.sass';
import Title from '../../../../../../shared/Title';
import CardInput from '../../../../../../shared/Input/Card';

const DealNote = ({ data, onChange, onSubmit, onReset }) => {
  const defaultActions = (path, success, info, copy = 'Элемент скопирован') => {
    return {
      copy: (text) => {
        navigator.clipboard.writeText(text).then(() => handleInfo(copy));
      },
      edit: ({ name, value }) => onChange(name, value),
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
    <Card classTitle={styles.title} className={styles.card}>
      <Title smallTable={true} actions={{}} title={'Заметка'} />

      <CardInput
        placeholder={'Заметка...'}
        name={`note`}
        type={'textarea'}
        value={data?.note}
        actions={defaultActions(
          `note`,
          'Заметка сохранена',
          'Заметка восстановлена',
          data?.id,
        )}
      />
    </Card>
  );
};
export default DealNote;
