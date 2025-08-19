import React from 'react';
import styles from './Pagination.module.sass';
import Chevron from '../Dropdown/Default/Chevron';
import cn from 'classnames';

const PaginationButton = ({ direction, label, onClick, disabled, cls }) => {
  return (
    <button
      className={cn(styles.paginationButton, cls)}
      onClick={onClick}
      disabled={disabled}
    >
      {direction === 'left' && (
        <Chevron className={styles.pagination} direction="left" />
      )}
      <span className={styles.label}>{label}</span>
      {direction === 'right' && (
        <Chevron className={styles.pagination} direction="right" />
      )}
    </button>
  );
};

export const PreviousButton = ({
  onClick,
  disabled,
  label = 'Предыдущая',
  cls,
}) => (
  <PaginationButton
    direction="left"
    label={label}
    onClick={onClick}
    disabled={disabled}
    cls={cls}
  />
);

export const NextButton = ({ onClick, disabled, label = 'Следующая', cls }) => (
  <PaginationButton
    direction="right"
    label={label}
    onClick={onClick}
    disabled={disabled}
    cls={cls}
  />
);
