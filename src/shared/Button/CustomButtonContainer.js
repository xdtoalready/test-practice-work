import React from 'react';
import styles from '../../pages/Documents/components/BillsTable/components/EditModal/Modal.module.sass';

const CustomButtonContainer = ({ children }) => {
  return <div className={styles.addButtons}>{children}</div>;
};

export default CustomButtonContainer;
