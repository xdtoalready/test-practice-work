import React, { useState } from 'react';
import styles from './styles.module.sass';
import { NavLink, useLocation } from 'react-router-dom';
import Button from '../../../../../../../shared/Button';
import { format, sub, startOfDay } from 'date-fns';
import { useNavigate } from 'react-router';
import Icon from '../../../../../../../shared/Icon';
import InlineCalendar from '../../../../../../../shared/Datepicker/Inline';
import cn from 'classnames';
import { formatDateForUrl } from '../../../index';

const BillsFilters = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [showCalendar, setShowCalendar] = useState(false);

  const today = startOfDay(new Date());
  const weekAgo = sub(today, { weeks: 1 });
  const monthAgo = sub(today, { months: 1 });

  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');

  const startDate = fromParam ? new Date(fromParam) : today;
  const endDate = toParam ? new Date(toParam) : today;

  const formatDisplayDate = (date) => {
    return format(date, 'dd.MM.yyyy');
  };

  const isActiveLink = (fromDate, toDate) => {
    const currentFrom = fromParam || formatDateForUrl(monthAgo);
    const currentTo = toParam || formatDateForUrl(today);
    return currentFrom === fromDate && currentTo === toDate;
  };

  const handleDateChange = (start, end) => {
    if (start && end) {
      navigate(`?from=${formatDateForUrl(start)}&to=${formatDateForUrl(end)}`);
      setShowCalendar(false);
    } else {
      navigate(
        `?from=${formatDateForUrl(today)}&to=${formatDateForUrl(today)}`,
      );
    }
  };

  const todayFormatted = formatDateForUrl(today);
  const weekAgoFormatted = formatDateForUrl(weekAgo);
  const monthAgoFormatted = formatDateForUrl(monthAgo);

  return (
    <div className={styles.filters}>
      <NavLink
        to={`?from=${todayFormatted}&to=${todayFormatted}`}
        className={({ isActive }) =>
          cn(styles.link, {
            [styles.active]: isActiveLink(todayFormatted, todayFormatted),
          })
        }
      >
        <Button classname={styles.button} type="secondary" name="За день" />
      </NavLink>
      <NavLink
        to={`?from=${weekAgoFormatted}&to=${todayFormatted}`}
        className={({ isActive }) =>
          cn(styles.link, {
            [styles.active]: isActiveLink(weekAgoFormatted, todayFormatted),
          })
        }
      >
        <Button classname={styles.button} type="secondary" name="За неделю" />
      </NavLink>
      <NavLink
        to={`?from=${monthAgoFormatted}&to=${todayFormatted}`}
        className={({ isActive }) =>
          cn(styles.link, {
            [styles.active]: isActiveLink(monthAgoFormatted, todayFormatted),
          })
        }
      >
        <Button classname={styles.button} type="secondary" name="За месяц" />
      </NavLink>

      <div
        className={cn(styles.date_selector, {
          [styles.active]: showCalendar,
        })}
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <Icon name="calendar" className={styles.calendar_icon} />
        <span className={styles.date_range}>
          {`${formatDisplayDate(startDate)} — ${formatDisplayDate(endDate)}`}
        </span>
      </div>

      {showCalendar && (
        <div className={styles.calendar_popup}>
          <InlineCalendar
            initialStartDate={startDate}
            initialEndDate={endDate}
            onDateChange={handleDateChange}
            onClose={() => setShowCalendar(false)}
          />
        </div>
      )}
    </div>
  );
};

export default BillsFilters;
