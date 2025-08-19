import React from 'react';
import styles from './PhoneContact.module.sass';
import Radio from '../../../../shared/Radio';

const PhoneContact = ({ phoneData, selectedPhone, onPhoneSelected }) => {
  if (!phoneData || !phoneData.tel || Object.keys(phoneData.tel).length === 0) {
    return null;
  }

  return (
    <div className={styles.phoneContactWrapper}>
      <h3 className={styles.phoneContactTitle}>Телефон</h3>
      <div className={styles.phoneContactList}>
        {Object.entries(phoneData.tel).map(([key, phone]) => (
          <div key={key} className={styles.phoneContactItem}>
            <Radio
              className={styles.phoneRadio}
              content={
                <div className={styles.phoneInfo}>
                  <span className={styles.phoneNumber}>{phone}</span>
                </div>
              }
              name="selectedPhone"
              value={selectedPhone === phone}
              onChange={() => onPhoneSelected(phone)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhoneContact;
