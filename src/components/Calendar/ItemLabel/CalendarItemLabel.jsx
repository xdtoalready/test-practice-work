import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from '../../../pages/Calendar/components/Item/Base/Item.module.sass';
import { format } from 'date-fns';
import cn from 'classnames';

const CalendarItemLabel = ({
  name,
  startDate,
  endDate,
  showTime,
  isFinished,
  showTooltip = false,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      if (ref.current && ref.current.parentNode) {
        const parent = ref.current.parentNode;

        if (parent.clientWidth < 120) {
          // ref.current.classList.add(styles.smallTime);
          if (parent.clientHeight < 40) {
            ref.current.classList.add(styles.disableTime);
          } else {
            ref.current.classList.remove(styles.disableTime);
          }
        } else {
          // ref.current.classList.remove(styles.smallTime);
          ref.current.classList.remove(styles.disableTime);
        }
      }
    }, 100);
  }, [ref?.current?.clientHeight, ref?.current?.clientWidth, ref.current]);

  return (
    <div
      ref={ref}
      className={cn(styles.title, { [styles.finished]: isFinished })}
    >
      <span>{name}</span>
      {showTime && (
        <div className={styles.time}>
          {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
        </div>
      )}
    </div>
  );
};

export default CalendarItemLabel;
