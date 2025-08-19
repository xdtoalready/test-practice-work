import React, { useEffect, useState } from 'react';
import styles from './Filters.module.sass';
import Icon from '../../../shared/Icon';
import cn from 'classnames';

const Index = ({
  commentsLength,
  filesLength,
  filterFiles,
  filterComments,
  filterAll,
  openTimeTracking,
  timeTrackingsLength,
}) => {
  const [activeButton, setActiveButton] = useState('all');
  const handleChangeActiveButton = (value) => {
    setActiveButton(value);
  };
  useEffect(() => {
    filterAll();
  }, []);
  return (
    <div className={styles.component}>
      <div
        onClick={() => {
          filterAll();
          handleChangeActiveButton('all');
        }}
        className={cn(styles.tab, { [styles.active]: activeButton === 'all' })}
      >
        <Icon size={24} name={'list'} />
        <span className={styles.label}>События</span>
      </div>
      <div
        onClick={() => {
          handleChangeActiveButton('comments');
          filterFiles();
        }}
        className={cn(styles.tab, {
          [styles.active]: activeButton === 'comments',
        })}
      >
        <Icon size={24} name={'message'} />
        <span className={styles.label}>Комментарии </span>
        <span className={styles.count}>{commentsLength}</span>
      </div>
      <div
        onClick={() => {
          handleChangeActiveButton('files');
          filterComments();
        }}
        className={cn(styles.tab, {
          [styles.active]: activeButton === 'files',
        })}
      >
        <Icon
          fillRule={'evenodd'}
          viewBox={'0 0 24 24'}
          size={24}
          name={'file-outline'}
        />
        <span className={cn(styles.label, styles.files)}>Файлы</span>
        <span className={styles.count}>{filesLength}</span>
      </div>
      {timeTrackingsLength == null ? (
        <React.Fragment />
      ) : (
        <div
          onClick={() => {
            handleChangeActiveButton('time-tracking');
            openTimeTracking();
          }}
          className={cn(styles.tab, {
            [styles.active]: activeButton === 'time-tracking',
          })}
        >
          <Icon viewBox={'0 0 18 18'} size={24} name={'dollar'} />
          <span className={styles.label}>Тайм-трекинг </span>
          <span className={styles.count}>{timeTrackingsLength}</span>
        </div>
      )}
    </div>
  );
};

export default Index;
