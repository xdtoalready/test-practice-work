import React from 'react';
import Icon from '../../shared/Icon';
import styles from '../../pages/Services/components/ServicePage/components/Hours/Hours.module.sass';
import cn from 'classnames';

const Index = ({ label, time, type, cls }) => {
  return (
    <div className={cn(styles.hoursComponent, cls)}>
      <Icon size={20} name={'clock'} />
      <p className={styles.hoursView_text}>
        <span>
          {time ?? '-'} {type}{' '}
        </span>
        {label}
      </p>
    </div>
  );
};

export default Index;
