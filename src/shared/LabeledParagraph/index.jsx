import React from 'react';
import styles from './Paragraph.module.sass';
import TextLink from '../Table/TextLink';
import cn from 'classnames';
const Index = ({ label, text, to, ...rest }) => {
  return (
    <div className={styles.container}>
      {label && (
        <div className={cn(styles.label, rest.labelClass)}>{label}</div>
      )}
      {text && to ? (
        <TextLink to={to} className={styles.text}>
          {text}
        </TextLink>
      ) : (
        <div className={cn(styles.text, rest.textClass)}>{text}</div>
      )}
    </div>
  );
};

export default Index;
