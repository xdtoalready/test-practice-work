import styles from '../../../pages/Documents/components/BillsTable/components/EditModal/Modal.module.sass';
import Icon from '../../Icon';
import React from 'react';

const DeleteButton = ({ label, handleDelete }) => {
  return (
    <div className={styles.delete} onClick={handleDelete}>
      <span>{label}</span>
      <Icon name={'close'} size={20} />
    </div>
  );
};

export default DeleteButton;
