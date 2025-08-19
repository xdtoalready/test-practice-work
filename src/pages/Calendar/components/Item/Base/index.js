import React, {forwardRef} from 'react';
import { format, startOfDay } from 'date-fns';
import { useDrag } from 'react-dnd';
import { businessTypeStyles } from '../../../calendar.types';
import styles from './Item.module.sass';
import CalendarItemLabel from "../../../../../components/Calendar/ItemLabel/CalendarItemLabel";

const BaseBusinessItem = forwardRef(({
                               business,
                               isDragging,
                               showTime,
                               businessTypeStyles,
                               className = ''
                             }, ref) => {

  return (
    <div
      ref={ref}
      className={`${styles.businessItem} ${business?.finished && styles.isFinished} ${styles[businessTypeStyles[business.type]]} ${
        isDragging ? styles.dragging : ''
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >

        <CalendarItemLabel isFinished={business?.finished} name={business.name} endDate={business.endDate} startDate={business.startDate} showTime={showTime} />
    </div>
  );
});

export default BaseBusinessItem;
