import { useState } from 'react';
import useStore from '../../hooks/useStore';
import {
  handleHttpError,
  handleHttpResponse,
  http,
  resetApiProvider,
} from '../../shared/http';
import { getQueryParam, sanitizeUrlFilters } from '../../utils/window.utils';
import { mapServiceFromApi } from '../Services/services.mapper';
import { mapTimeTrackingsFromApi } from './timeTracking.mapper';
import { handleError } from '../../utils/snackbar';
import { sanitizeDateAndPeriodFilters } from '../../utils/filter.utils';

const useTimeTrackingApi = () => {
  const { timeTrackingStore } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const getTimeTrackings = (page = 1) => {
    resetApiProvider();
    setIsLoading(true);
    const sanitizedFilters = sanitizeUrlFilters({
      performer_id: getQueryParam('performer_id'),
      date_range: getQueryParam('date_range'),
      period: getQueryParam('period'),
      page: getQueryParam('page') ?? 1,
    });
    const params = { page };
    const [paramsData, sanitizeFiltersData] = sanitizeDateAndPeriodFilters(
      params,
      sanitizedFilters,
    );
    return http
      .get('/api/timetrackings', {
        params: { ...paramsData, ...sanitizeFiltersData },
      })
      .then(handleHttpResponse)
      .then((res) => {
        const mappedTimeTrackings = mapTimeTrackingsFromApi(res.body.data);
        timeTrackingStore.setTimeTrackings(mappedTimeTrackings); // Устанавливаем клиентов в store
        timeTrackingStore.setMetaInfoTable(res.body?.meta);
        timeTrackingStore.setStats(res.body?.stats);
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };
  const sendTimeTracking = (timeTracking, taskId) => {
    resetApiProvider();
    setIsLoading(true);

    return http
      .post(`/api/tasks/${taskId}/track`, {
        task_id: Number(taskId),
        minutes: timeTracking.minutes,
      })
      .then(handleHttpResponse)
      .then((res) => {
        return mapTimeTrackingsFromApi([res.body.data]);
      })
      .catch(handleHttpError)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateTimeTracking = ({ id, hours, minutes }) => {
    resetApiProvider();
    setIsLoading(true);

    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);

    return http
      .patch(`/api/timetrackings/${id}`, {
        minutes: totalMinutes,
      })
      .then(handleHttpResponse)
      .then((res) => {
        const mappedTimeTracking = mapTimeTrackingsFromApi([res.body.data]);
        timeTrackingStore.updateTimeTrackInCurrentTask(id, mappedTimeTracking);
        return mappedTimeTracking;
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const deleteTimeTracking = async (id) => {
    resetApiProvider();
    setIsLoading(true);

    try {
      await http.delete(`/api/timetrackings/${id}`);
      return true;
    } catch (error) {
      handleError(error?.message, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendTimeTracking,
    getTimeTrackings,
    updateTimeTracking,
    deleteTimeTracking,
    isLoading,
  };
};
export default useTimeTrackingApi;
