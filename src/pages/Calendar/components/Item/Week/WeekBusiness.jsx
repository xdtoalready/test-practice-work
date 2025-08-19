import React, { forwardRef, useRef } from 'react';
import styles from './Item.module.sass';
import { format } from 'date-fns';
import withBusinessItem from '../Base/Item.hoc';
import cn from 'classnames';
import calendarStyles from '../../../Calendar.module.sass';
import CalendarItemLabel from '../../../../../components/Calendar/ItemLabel/CalendarItemLabel';

const BaseWeekItem = forwardRef(
  (
    {
      allItems,
      business,
      isDragging,
      businessTypeStyles,
      style = {},
      onModalOpen,
      onHoverStart,
      onHoverEnd,
      dayIndex,
      shouldShiftRight,
      ...rest
    },
    ref,
  ) => {
    const itemRef = useRef(null);

    // Функция для открытия модального окна
    const handleOpenModal = (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!isDragging) {
        onModalOpen(business);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          styles.weekItemSimple,
          calendarStyles.businessItem,
          calendarStyles[businessTypeStyles[business.type]],
          {
            [styles.isFinished]: business?.finished,
            [styles.dragging]: isDragging,
          },
        )}
        style={{
          ...style,
          opacity: isDragging ? 0.5 : 1,
          pointerEvents: isDragging ? 'none' : 'auto',
        }}
        onClick={(e) => handleOpenModal(e)}
        // onMouseEnter={() => onHoverStart && onHoverStart(dayIndex)}
        // onMouseLeave={() => onHoverEnd && onHoverEnd()}
      >
        <div ref={itemRef} className={styles.content}>
          <CalendarItemLabel
            isFinished={business?.finished}
            name={business.name}
            endDate={business.endDate}
            startDate={business.startDate}
            showTime={true}
          />
        </div>
      </div>
    );
  },
);

const WeekBusinessItem = withBusinessItem(BaseWeekItem, 'week-business');
export default WeekBusinessItem;
