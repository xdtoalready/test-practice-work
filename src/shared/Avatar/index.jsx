import React from 'react';
import styles from './Avatar.module.sass';
import cn from 'classnames';

const Avatar = ({ imageSrc, className, size = 24 }) => {
  return (
    <div className={cn(styles.logo, className)}>
      <img style={{ width: size, height: size }} src={imageSrc} />
    </div>
  );
};

export default Avatar;
