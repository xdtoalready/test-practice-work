import React from 'react';
import cn from 'classnames';
import styles from './Switch.module.sass';

const Switch = ({ className, value, onChange, label, name }) => {
  return (
    <>
      <div className={cn(styles.label)}>{label}</div>
      <label className={cn(styles.switch, className)}>
        <input
          name={name}
          className={styles.input}
          type="checkbox"
          checked={value}
          onChange={(e) => {
            onChange(e.target.name, e.currentTarget.checked);
          }}
        />
        <span className={styles.inner}>
          <span className={styles.box}></span>
        </span>
      </label>
    </>
  );
};

export default Switch;
