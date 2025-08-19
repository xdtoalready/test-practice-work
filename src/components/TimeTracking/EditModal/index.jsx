import React, { useRef } from 'react';
import FormValidatedModal from '../../../shared/Modal/FormModal';
import TextInput from '../../../shared/TextInput';
import styles from './EditModal.module.sass';
import Modal from '../../../shared/Modal';
import useOutsideClick from '../../../hooks/useOutsideClick';
import InnerModal from '../../../shared/Modal/InnerModal';
import { observer } from 'mobx-react';

const EditTimeTrackModal = observer(
  ({ isOpen, onClose, timeTracking, onSubmit, onChange }) => {
    const initialHours = timeTracking?.timeSpent?.hours || '';
    const initialMinutes = timeTracking?.timeSpent?.minutes || '';
    const hoursRef = useRef(initialHours);
    const minutesRef = useRef(initialMinutes);

    const handleSubmit = () => {
      // const totalMinutes = (parseInt(initialHours) || 0) * 60 + (parseInt(initialMinutes) || 0);
      onSubmit(hoursRef.current, minutesRef.current);
      onClose();
    };

    const isFormValid = initialMinutes || initialHours;

    const validateAndUpdateHours = ({ target }) => {
      ;
      const value = target.value;
      if (value === '' || /^\d*$/.test(value)) {
        target.value = value;
        hoursRef.current = value;
      } else {
        target.value = hoursRef?.current;
        return;
      }
      onChange(target.value, minutesRef?.current ?? 0);
    };

    const validateAndUpdateMinutes = ({ target }) => {
      const value = target.value;
      if (value === '' || (/^\d*$/.test(value) && parseInt(value) <= 59)) {
        target.value = value;
        minutesRef.current = value;
      } else {
        target.value = minutesRef?.current;
        return;
      }
      onChange(hoursRef?.current ?? 0, target.value);
    };

    return (
      <InnerModal
        withPortal={false}
        id={'TimeTrackingModal'}
        handleClose={onClose}
        handleSubmit={handleSubmit}
        size="sm"
        closeButton={'Закрыть'}
        isOpen={isOpen}
        cls={styles.cls}
        disabled={!isFormValid}
      >
        <div className={styles.container}>
          <div className={styles.title}>Редактирование времени</div>
          <div className={styles.inputs}>
            <TextInput
              // ref={hoursRef}
              type={'hours'}
              name="hours"
              defaultValue={initialHours}
              onChange={validateAndUpdateHours}
              label="Часы"
              edited={true}
              className={styles.input}
            />
            <TextInput
              // ref={minutesRef}
              type={'minutes'}
              name="minutes"
              defaultValue={initialMinutes}
              onChange={validateAndUpdateMinutes}
              label="Минуты"
              edited={true}
              className={styles.input}
            />
          </div>
        </div>
      </InnerModal>
    );
  },
);

export default EditTimeTrackModal;
