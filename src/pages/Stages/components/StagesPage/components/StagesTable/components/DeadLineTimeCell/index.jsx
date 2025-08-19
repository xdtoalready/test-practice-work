// Import necessary libraries
import React from 'react';
import styles from './Time.module.sass';
import { compareTime } from '../../../../../../../../utils/compare';

const DeadLineTimeCell = ({ actualTime, deadLine }) => {
  const formatTime = (time) => {
    if (
      time === null ||
      (time && Number.isNaN(time.toString().split(' ')[0])) ||
      time === 'Не указано'
    )
      return 'Не указано';
    const currTimeEl = time.toString().split(' ')[1] ?? 'ч';
    return parseFloat(time.toString().replace(',', '.')) + ' ' + currTimeEl;
  };

  const formattedActualTime = formatTime(actualTime);
  const formattedDeadLine = formatTime(deadLine);

  const isOverdue = compareTime(actualTime, deadLine);
  const cellColor = isOverdue ? styles.redDark : styles.green;

  return (
    <div className={`${styles.deadlineTimeCell} ${cellColor}`}>
      {formattedDeadLine} / {formattedActualTime}
    </div>
  );
};

export default DeadLineTimeCell;
