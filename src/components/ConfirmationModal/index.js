import React, { useRef, useState } from 'react';
import styles from './Modal.module.sass';
import Icon from '../../shared/Icon';
import Button from '../../shared/Button';
import Modal from '../../shared/Modal';
import useOutsideClick from '../../hooks/useOutsideClick';
import { createPortal } from 'react-dom';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, label }) => {
  const confirmRef = useRef();
  useOutsideClick(confirmRef, onClose);
  if (!isOpen) return null;

  return (
    <Modal
      id={'confirmModal'}
      modalRef={confirmRef}
      size="sm"
      handleClose={onClose}
      customButtons={
        <div className={styles.confirmationButtons}>
          <Button
            type="danger"
            name="Да"
            onClick={(e) => {
              e?.preventDefault();
              e?.stopPropagation();
              onConfirm();
            }}
            classname={styles.confirmButton}
          />
          <Button
            type="secondary"
            name="Нет"
            onClick={(e) => {
              e?.preventDefault();

              e?.stopPropagation();
              onClose();
            }}
            classname={styles.cancelButton}
          />
        </div>
      }
    >
      <div className={styles.confirmationContent}>
        <h3>{label}</h3>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
