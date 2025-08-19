import React, { useRef, useState } from 'react';
import cn from 'classnames';
import styles from './Filters.module.sass';
import Icon from '../Icon';
import useOutsideClick from '../../hooks/useOutsideClick';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const Filters = ({
  className,
  classNameTitle,
  classNameBody,
  children,
  title,
}) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => setVisible(false));

  return (
    <div
      ref={ref}
      className={cn(styles.filters, className, { [styles.active]: visible })}
    >
      <div className={cn('', styles.head)} onClick={() => setVisible(true)}>
        <Icon name="filter" size="24" />
      </div>
      {/*<SimpleBar autoHide={false}>*/}
      <div className={cn(styles.body, classNameBody)}>
        <div className={styles.top}>
          {title && (
            <div className={cn('title-red', styles.title, classNameTitle)}>
              {title}
            </div>
          )}
          <button className={styles.close} onClick={() => setVisible(false)}>
            <Icon name="close" size="20" />
          </button>
        </div>
        {children}
      </div>
      {/*</SimpleBar>*/}
      <div className={styles.overlay} onClick={() => setVisible(false)}></div>
    </div>
  );
};

export default Filters;
