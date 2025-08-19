import React from 'react';
import cn from 'classnames';
import styles from './Chip.module.sass';

const Chip = ({
                children,
                active,
                onClick,
                className,
                disabled = false
              }) => {
  return (
    <button
      className={cn(
        styles.chip,
        className,
        { [styles.active]: active },
        { [styles.disabled]: disabled }
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Chip;