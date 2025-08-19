import { useCallback } from 'react';
import {addDays, differenceInDays, addHours, startOfDay} from 'date-fns';
import useStore from '../../../hooks/useStore';
import useCalendarApi from '../calendar.api';

export const useBusinessDrag = () => {
  const { calendarStore } = useStore();
  const api = useCalendarApi();

  const handleDragEnd = useCallback(
    ({ businessId, sourceDate, targetDate }) => {
      if (!businessId || !sourceDate || !targetDate) return;
      ;
      const business = calendarStore.getById(businessId);
      if (!business) return;

      // Вычисляем разницу в днях
      const diffInDays = differenceInDays(startOfDay(targetDate), startOfDay(sourceDate));

      // Обновляем даты начала и конца
      const newStartDate = addDays(business.startDate, diffInDays);
      const newEndDate = addDays(business.endDate, diffInDays);

      calendarStore.changeById(businessId, 'startDate', newStartDate, true);
      calendarStore.changeById(businessId, 'endDate', newEndDate, true);
      calendarStore.changeById(
        businessId,
        'startDateMonth',
        newStartDate,
        true,
      );
      calendarStore.changeById(businessId, 'endDateMonth', newEndDate, true);

      api.updateBusiness(
        businessId,
        calendarStore.drafts[businessId],
        calendarStore.changedProps,
      );
    },
    [calendarStore, api],
  );

  const handleResize = useCallback(
    (businessId, newDuration) => {
      const business = calendarStore.getById(businessId);
      if (!business) return;

      const newEndDate = addHours(business.startDate, newDuration);

      calendarStore.changeById(businessId, 'endDate', newEndDate);

      api.updateBusiness(
        businessId,
        calendarStore.drafts[businessId],
        calendarStore.changedProps,
      );
    },
    [calendarStore, api],
  );

  return {
    handleDragEnd,
    handleResize,
  };
};
