import React from 'react';
import styles from '../TextInput.module.sass';
import Icon from '../../Icon';

const Copy = ({ inputRef, actions, label, setClose, props }) => {
  return (
    <div
      onClick={() => {
        // console.log(inputRef.current,'curr')

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
