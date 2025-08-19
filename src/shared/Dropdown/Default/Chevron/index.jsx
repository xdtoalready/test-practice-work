import React from 'react';
import cn from 'classnames';
import styles from '../Dropdown.module.sass';

const Chevron = ({ isOpen, direction = 'down', className }) => {
  return (
    <div
      className={cn(styles.chevron, className, {
        [styles.up]: isOpen || direction === 'down',
        [styles.left]: direction === 'left',
        [styles.right]: direction === 'right',
      })}
    />
  );
};

export default Chevron;
