import React from 'react';
import styles from '../TextInput.module.sass';
import Icon from '../../Icon';

const Copy = ({ inputRef, actions, label, setClose }) => {
  return (
    <div
      onClick={() => {
        setClose && setClose();
        actions.copy(inputRef.current.value);
      }}
      className={styles.copy_actions}
    >
      <Icon name={'copy'} size="20" /> <p>{label}</p>
    </div>
  );
};

export default Copy;
