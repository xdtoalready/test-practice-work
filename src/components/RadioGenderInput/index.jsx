import React from 'react';
import styles from './styles.module.sass';
import Radio from '../../shared/Radio';
import { genderType } from '../../pages/Settings/settings.types';

const Index = ({
  value,
  onChange,
  isEditMode = false,
  label = 'Пол',
  className,
  disabled = false,
}) => {
  const handleGenderChange = (gender) => {
    onChange(isEditMode ? 'gender' : 'gender', gender);
  };

  return (
    <div className={`${styles.radio_container} ${className}`}>
      <label>{label}</label>
      <div className={styles.radio_buttons}>
        <Radio
          content="Муж"
          onChange={() => handleGenderChange(genderType.male)}
          name="gender"
          value={value === genderType.male || value === null}
          disabled={disabled}
        />
        <Radio
          content="Жен"
          onChange={() => handleGenderChange(genderType.female)}
          name="gender"
          value={value === genderType.female}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default Index;
