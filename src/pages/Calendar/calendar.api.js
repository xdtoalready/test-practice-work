import { useCallback, useState } from 'react';
import { mapBusinessFromApi, mapBusinessToBackend } from './calendar.mapper';
import {
  handleHttpError,
  handleHttpResponse,
  handleShowError,
  http,
  resetApiProvider,
} from '../../shared/http';
import useStore from '../../hooks/useStore';
import {
  formatDateToBackend,
  formatDateToQuery,
} from '../../utils/formate.date';
import { format } from 'date-fns';
import { mapCommentsFromApi } from '../Clients/clients.mapper';
import { mapTaskFromApi } from '../Tasks/tasks.mapper';

const useCalendarApi = () => {
  const { calendarStore } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const getBusinesses = (startDate, endDate, filters = {}) => {
    setIsLoading(true);
    resetApiProvider();

    const searchParams = new URLSearchParams(window.location.search);
    // Создаем объект с параметрами
    const params = {
      date_from: formatDateToQuery(new Date(startDate)),
      date_to: formatDateToQuery(new Date(endDate)),
      type: searchParams.get('type'),
      employee_id: searchParams.get('employee_id'),
    };

    return http
      .get(`/api/businesses`, { params })
      .then(handleHttpResponse)
      .then((res) => {
        const mappedBusinesses = res.body.data.map((business) =>
          mapBusinessFromApi(business),
        );
        calendarStore.setBusinesses(mappedBusinesses);
        return mappedBusinesses;
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const createBusiness = (data) => {
    resetApiProvider();
    setIsLoading(true);
    return http
      .post('/api/businesses', {
        ...mapBusinessToBackend(data, Object.keys(data)),
      })
      .then(handleHttpResponse)
      .then((res) => {
        const mappedBusiness = mapBusinessFromApi(res.body.data);
        calendarStore.setBusinesses([
          ...calendarStore.getBusinesses(),
          mappedBusiness,
        ]);
      })
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  const updateBusiness = (id, drafts, changedFieldsSet) => {
    resetApiProvider();
    setIsLoading(true);

    const dataToSend = mapBusinessToBackend(
      drafts ?? calendarStore.drafts[id],
      changedFieldsSet ?? calendarStore.changedProps,
    );
    return http
      .patch(`/api/businesses/${id}`, dataToSend)
      .then(handleHttpResponse)
      .then((res) => {

        const mappedBusiness = mapBusinessFromApi(res.body.data);
        calendarStore.submitDraft(id);

        const businesses = calendarStore.getBusinesses();
        const updatedBusinesses = businesses.map((business) =>
          business.id === Number(id) ? mappedBusiness : business,
        );
        calendarStore.setBusinesses(updatedBusinesses);
      })
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  const deleteBusiness = (id) => {
    setIsLoading(true);
    return http
      .delete(`/api/businesses/${id}`)
      .then(handleHttpResponse)
      .then(() => {
        const businesses = calendarStore.getBusinesses();
        const updatedBusinesses = businesses.filter(
          (business) => business.id !== id,
        );
        calendarStore.setBusinesses(updatedBusinesses);
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const getBusinessById = (id) => {
    resetApiProvider();

    return Promise.all([http.get(`api/businesses/${id}`)])
      .then(([businessData]) => {
        const mappedBusiness = mapBusinessFromApi(businessData.data.data);
        const businesses = calendarStore.getBusinesses();
        const updatedBusinesses = businesses.map((business) =>
          business.id === id ? mappedBusiness : business,
        );
        calendarStore.setBusinesses(updatedBusinesses);
        calendarStore.setCurrentBussiness(mappedBusiness);
        return mappedBusiness;
      })
      .catch(handleShowError);
  };
  const getBusinessComments = (businessId) => {
    setIsLoading(true);
    return http
      .get(`/api/businesses/${businessId}/activities`)
      .then(handleHttpResponse)
      .then((res) => mapCommentsFromApi(res.body.data))
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const addBusinessComment = (businessId, comment) => {
    setIsLoading(true);
    return http
      .post(`/api/businesses/${businessId}/comments`, { content: comment })
      .then(handleHttpResponse)
      .then((res) => res.body.data)
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const deleteBusinessComment = (businessId, commentId) => {
    setIsLoading(true);
    return http
      .delete(`/api/businesses/${businessId}/comments/${commentId}`)
      .then(handleHttpResponse)
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const searchBusinessable = (query) => {
    resetApiProvider();
    setIsLoading(true);
    return http
      .get(`/api/search`, {
        params: { query },
      })
      .then(handleHttpResponse)
      .then((res) => {
        // Удаляем tasks из результатов
        const { tasks, services, ...businessableResults } = res.body;

        return businessableResults;
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const sendBusinessTimeTracking = (timeTracking, businessId) => {
    resetApiProvider();
    setIsLoading(true);

    return http
      .post(`/api/businesses/${businessId}/track`, {
        minutes: timeTracking.minutes,
      })
      .then(handleHttpResponse)
      .then((res) => {
        return res.body.data;
      })
      .catch(handleHttpError)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateBusinessTimeTracking = ({ id, hours, minutes }) => {
    resetApiProvider();
    setIsLoading(true);

    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);

    return http
      .patch(`/api/timetrackings/${id}`, {
        minutes: totalMinutes,
      })
      .then(handleHttpResponse)
      .then((res) => {
        return res.body.data;
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const deleteBusinessTimeTracking = async (id) => {
    resetApiProvider();
    setIsLoading(true);

    try {
      await http.delete(`/api/timetrackings/${id}`);
      return true;
    } catch (error) {
      handleHttpError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getBusinesses,
    getBusinessById,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    getBusinessComments,
    addBusinessComment,
    deleteBusinessComment,
    searchBusinessable,
    sendBusinessTimeTracking,
    updateBusinessTimeTracking,
    deleteBusinessTimeTracking,
  };
};

export default useCalendarApi;
