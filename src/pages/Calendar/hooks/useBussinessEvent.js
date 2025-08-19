import { useMemo } from 'react';
import {
  isSameDay,
  parseISO,
  differenceInMinutes,
  differenceInHours,
  format,
} from 'date-fns';

export const useBusinessEvents = (businesses, date, view) => {
  return useMemo(() => {
    switch (view) {
      case 'month': {
        return businesses.reduce((acc, business) => {
          // Преобразуем строку даты в объект Date
          const businessDate = business.startDate;
          const dateKey = format(businessDate, 'yyyy-MM-dd');

          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }

          acc[dateKey].push({
            ...business,
            startDate: businessDate,
            endDate: business.endDate,
          });
          return acc;
        }, {});
      }

      case 'week': {
        // Группируем события по дням недели
        return businesses.reduce((acc, business) => {
          const dateKey = format(business.startDate, 'yyyy-MM-dd');

          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }

          const startHour = business.startDate.getHours();
          const duration = differenceInHours(business.endDate, business.startDate);
          const isAllDay = startHour <= 8 && duration >= 4; // Если начинается до 8 утра и длится более 4 часов

          acc[dateKey].push({
            ...business,
            isAllDay,
          });
          return acc;
        }, {});
      }


      case 'day': {
        return businesses.filter((business) =>
          isSameDay(business.startDate, date),
        );
      }

      default:
        return {};
    }
  }, [businesses, date, view]);
};

