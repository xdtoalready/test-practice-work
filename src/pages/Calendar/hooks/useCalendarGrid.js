import { useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isWeekend,
} from 'date-fns';

export const useCalendarGrid = (date) => {
  return useMemo(() => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Неделя начинается с понедельника
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // Разбиваем дни на недели
    const weeks = [];
    let currentWeek = [];

    days.forEach((day) => {
      currentWeek.push({
        date: day,
        isCurrentMonth: isSameMonth(day, date),
        isWeekend: isWeekend(day),
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return weeks;
  }, [date]);
};
