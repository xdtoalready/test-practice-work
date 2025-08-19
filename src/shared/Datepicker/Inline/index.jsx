import React, { useState, useEffect, useRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ru } from 'date-fns/locale/ru';
import { format } from 'date-fns';
import styles from './calendar.module.sass';
import useOutsideClick from '../../../hooks/useOutsideClick';

registerLocale('ru', ru);

const InlineCalendar = ({
  initialStartDate,
  initialEndDate,
  onDateChange,
  onClose,
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const ref = useRef();

  useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      onDateChange(start, end);
    }
  };

  useOutsideClick(ref, () => onDateChange(initialStartDate, initialEndDate));

  return (
    <div ref={ref} className={styles.calendar_wrapper}>
      <DatePicker
        selected={startDate}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        dateFormat="dd.MM.yyyy"
        locale="ru"
      >
        <div className={styles.reset_container}>
          <button
            className={styles.reset_button}
            onClick={() => onDateChange(null, null)}
          >
            Сбросить
          </button>
        </div>
      </DatePicker>
    </div>
  );
};

export default InlineCalendar;
