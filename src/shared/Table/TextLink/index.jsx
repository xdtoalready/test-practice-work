import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import styles from './TextLink.module.sass';

const Index = ({ children, className, to = null, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(styles.container, className, { [styles.link]: !to })}
    >
      {to ? <Link to={to}>{children}</Link> : children}
    </div>
  );
};

export default Index;
