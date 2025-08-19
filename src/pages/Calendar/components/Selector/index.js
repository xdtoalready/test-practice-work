import React from 'react';
import styles from '../../Calendar.module.sass';
// import arrowLeft from '@public/icons/arrows/arrow_left.svg';

import {
  format,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  subMonths,
  subWeeks,
  subDays,
  addMonths,
  addWeeks,
  addDays
} from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { formatDateWithoutHours } from '../../../../utils/formate.date';
import {
  NextButton,
  PreviousButton,
} from '../../../../shared/PaginationButton';

const Index = ({ handleUpdate, currentDate, type }) => {
  const getWeekRange = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });

    if (isSameMonth(start, end)) {
      return `${format(start, 'd', { locale: ru })}-${format(end, 'd MMMM', { locale: ru })}`;
    } else {
      return `${format(start, 'd MMMM', { locale: ru })}-${format(end, 'd MMMM', { locale: ru })}`;
    }
  };
  const renderSelectorLabel = () => {
    switch (type) {
      case 'month':
        return format(currentDate, 'LLLL yyyy', { locale: ru });

      case 'week':
        return getWeekRange(currentDate);
      case 'day':
        return formatDateWithoutHours(currentDate);
      default:
        return '';
    }
  };

  const handleSelectorPrevOrNext = (direction) => {
    let prevOrNext;
    if (type === 'month') {
      prevOrNext = direction === 'prev' ? subMonths(currentDate,1) : addMonths(currentDate,1);
    } else if (type === 'week') {
      prevOrNext = direction==='prev' ? subWeeks(currentDate,1) : addWeeks(currentDate,1);
    } else if (type === 'day') {
      prevOrNext = direction==='prev' ?  subDays(currentDate,1) : addDays(currentDate,1);
    }
    handleUpdate(prevOrNext)
  }

  return (
    <div className={styles.monthSelector}>
      <span className={styles.month}>{renderSelectorLabel()}</span>
      <PreviousButton
        onClick={() => handleSelectorPrevOrNext('prev')}
        label={''}
        cls={styles.pagination}
      />
      <NextButton
        onClick={() => handleSelectorPrevOrNext('next')}
        label={''}
        cls={styles.pagination}
      />
    </div>
  );
};

export default Index;
