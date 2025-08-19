import React from 'react';
import styles from '../Title.module.sass';
import cn from 'classnames';
import Icon from '../../Icon';
import Button from '../../Button';
import Filters from '../../Filter';
import { action } from 'mobx';
import FilterManager from '../../FilterManager';

const TitleButtons = ({
  doSort,
  isSortDecrease,
  titleButton,
  isSmallButton,
  actions,
}) => {
  return (
    <div className={styles.container}>
      {actions.edit && (
        <div className={cn(styles.icon)} onClick={() => actions.edit.action()}>
          <Icon fill={'#6F767E'} name={'edit'} size={24} />
        </div>
      )}
      {actions.filter && (
        <div>
          <FilterManager
            filterConfig={actions.filter.config}
            onFilterChange={actions.filter.onChange}
            classNameBody={actions.filter.classNameBody}
            className={actions.filter.className}
            classNameTitle={actions.filter.classNameTitle}
            title={actions.filter.title}
            hasFirstCall={actions.filter?.hasFirstCall}
          >
            {actions.filter?.children ?? <></>}
          </FilterManager>
        </div>
      )}
      {actions.sorting && (
        <div
          onClick={doSort}
          className={cn(styles.icon, styles.sortIcon, {
            [styles.sortIcon_active]: !isSortDecrease,
          })}
        >
          <Icon viewBox={24} name={'sort'} size={'24'} />
        </div>
      )}
      {actions.settings && (
        <div className={cn(styles.icon, styles.settings)}>
          <Icon name={'setting'} size={'24'} />
        </div>
      )}
      {actions.add && (
        <Button
          onClick={() => actions.add.action()}
          classname={actions.add.cls ?? ''}
          type={actions.add.type ?? 'primary'}
          isSmallButton={actions.add.isSmall ?? isSmallButton}
          adaptiveIcon={<Icon name={'plus'} size={8} />}
          name={titleButton}
        />
      )}
    </div>
  );
};

export default TitleButtons;
