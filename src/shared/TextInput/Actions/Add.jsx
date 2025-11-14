import React from 'react';
import Icon from '../../Icon';
import styles from '../TextInput.module.sass';

const Add = ({ actions, label, setClose }) => {
  return (
    <div
      onClick={() => {
        setClose && setClose();
        actions?.add();
      }} className={styles.add}>
      <Icon fill={'#6F767E'} size={12} name={'plus'} />
      <p>{label}</p>
    </div>
  );
};

export default Add;