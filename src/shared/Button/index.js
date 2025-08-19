import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/app.sass';
import styles from './button.module.sass';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { hoverTransition } from '../../utils/motion.variants';

const Button = ({
  name,
  after,
  before,
  onClick,
  adaptiveIcon,
  classname,
  type = 'primary',
  disabled,
  ...rest
}) => {
  return (
    <>
      {!rest.isSmallButton && (
        <div
          onClick={() => !disabled && onClick && onClick()}
          className={cn(
            styles.control,
            classname,
            {
              [styles.primary]: type === 'primary',
              [styles.secondary]: type === 'secondary',
              [styles.secondary_outline]: type === 'secondary_outline',
            },
            { [styles.isNotSmallTable]: rest?.isSmall ?? !rest.isSmallButton },
            { [styles.disabled]: disabled },
          )}
        >
          {before}
          {rest.to ? (
            <Link className={cn(styles.button, 'button')} to={rest.to}>
              <span>{name}</span>
            </Link>
          ) : (
            <div className={cn(styles.button, 'button')}>
              <span>{name}</span>
            </div>
          )}
          {after}
        </div>
      )}
      {!rest.isSmallButton && adaptiveIcon && (
        <div className={styles.adaptive}>{adaptiveIcon}</div>
      )}
      {rest.isSmallButton && (
        <div
          onClick={onClick}
          className={cn(
            styles.smallButton,
            {
              [styles.primary]: type === 'primary',
              [styles.secondary]: type === 'secondary',
              [styles.secondary_outline]: type === 'secondary_outline',
            },
            classname,
          )}
        >
          {adaptiveIcon}
        </div>
      )}
    </>
  );
};

export default Button;
