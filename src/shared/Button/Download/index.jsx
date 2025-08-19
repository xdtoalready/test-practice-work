import styles from '../../../pages/Documents/components/BillsTable/components/EditModal/Modal.module.sass';
import Icon from '../../Icon';
import React from 'react';

const DownloadButton = ({ handleDownload, label }) => {
  return (
    <div className={styles.download} onClick={handleDownload}>
      <span>{label}</span>
      <Icon name={'download'} size={20} />
    </div>
  );
};

export default DownloadButton;
