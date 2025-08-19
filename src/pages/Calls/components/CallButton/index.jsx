// src/Calls/components/CallButton/index.jsx
import React from 'react';
import styles from './CallButton.module.sass';
import Icon from '../../../../shared/Icon';

const CallButton = ({ onClick, onClose, isOpen }) => {
  return (
    <div className={styles.callButtonContainer}>
      <button
        className={styles.callButton}
        onClick={isOpen ? onClose : onClick}
        aria-label="Открыть модалку звонков"
      >
        <Icon name={isOpen ? 'close' : 'phone'} size={24} fill="#FFFFFF" />
      </button>
    </div>
  );
};

export default CallButton;
