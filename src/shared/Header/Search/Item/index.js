import React from 'react';
import cn from 'classnames';
import styles from './Item.module.sass';
import Icon from '../../../Icon';

const Item = ({ className, item, onClick }) => {
  return (
    <div className={cn(styles.item, className)} onClick={onClick}>
      {/*<div className={styles.preview}>*/}
      {/*  <img srcSet={`${item.image2x} 2x`} src={item.image} alt="Product" />*/}
      {/*</div>*/}
      <div className={styles.details}>
        <div className={styles.title}>{item.title}</div>
        <div className={styles.content}>{item.content}</div>
      </div>
      <button className={styles.close}>
        <Icon name="close" size="24" />
      </button>
    </div>
  );
};

const getIconByType = (type) => {
  switch (type) {
    case 'deals':
      return 'document';
    case 'tasks':
      return 'task';
    case 'companies':
      return 'building';
    case 'services':
      return 'service';
    default:
      return 'file';
  }
};

export default Item;
