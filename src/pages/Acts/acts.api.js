import useStore from '../../hooks/useStore';
import { getQueryParam, sanitizeUrlFilters } from '../../utils/window.utils';
import { mapActDataToBackend, mapActFromApi } from './acts.mapper';
import { handleHttpError, handleHttpResponse, handleShowError, http, resetApiProvider } from '../../shared/http';
import { useState } from 'react';
import useServiceApi from '../Services/services.api';
import { useParams } from 'react-router';
import { sanitizeDateAndPeriodFilters } from '../../utils/filter.utils';
import { mapBillFromApi } from '../Documents/mappers/bills.mapper';
import { sanitizeObjectForBackend } from '../../utils/create.utils';

const useActsApi = () => {
  const { actsStore } = useStore();
  const serviceApi = useServiceApi();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const getActs = (page = 1,type='act') => {
    resetApiProvider();
    setIsLoading(true);
    page = getQueryParam('page', 1);
    let sanitizedFilters = sanitizeUrlFilters({
      status: getQueryParam('status'),
      service_type: getQueryParam('service_type'),
      date_range: getQueryParam('date_range'),
      period: getQueryParam('period'),
      document_type:type,
      company_id: getQueryParam('company_id'),
    });

    let params = { page };

    const [paramsData, sanitizeFiltersData] = sanitizeDateAndPeriodFilters(
      params,
      sanitizedFilters,
    );

    return http
      .get('api/documents', {
        params: {
          ...paramsData,
          ...sanitizeFiltersData, // Добавляем параметры фильтрации
        },
      })
      .then(handleHttpResponse)
      .then((res) => {
        const mappedBills = res.body.data.map((bill) => mapActFromApi(bill));
        actsStore.setActs(mappedBills);
        actsStore.setMetaInfoTable(res.body?.meta);
        actsStore.setStats(res.body.stats);
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const createAct = (body, stageId) => {
    resetApiProvider();
    setIsLoading(true);
    debugger
    const createData = mapActDataToBackend(body, Object.keys(body));
    const finalData = createData

    return http
      .post('/api/acts', finalData)
      .then(handleHttpResponse)
      .then(() => stageId === null && getActs())
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  const updateAct = (actId, updateData, stageMode = false) => {
    resetApiProvider();
    setIsLoading(true);

    const dataToUpdate = mapActDataToBackend(
      actsStore.drafts[actId],
      actsStore.changedProps,
    );
    const sanitizedData = sanitizeObjectForBackend(dataToUpdate, [
      'legal_entity_id',
      'creation_date',
      'number',
      'payment_date',
      'payment_reason',
      'stage_id',
      'signed',
      'act_items',
    ]);


    return http
      .patch(`/api/acts/${actId}`, sanitizedData)
      .then(handleHttpResponse)
      .then(() => {
        if (!stageMode) return getActs();
        return serviceApi.getServiceById(id, true);
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const getActById = (actId) => {
    resetApiProvider();
    setIsLoading(true);

    return http
      .get(`/api/acts/${actId}`)
      .then(handleHttpResponse)
      .then((res) => {
        const mappedAct = mapActFromApi(res.body.data);
        actsStore.setCurrentAct(mappedAct);
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const deleteAct = async (actId) => {
    resetApiProvider();
    setIsLoading(true);

    try {
      await http.delete(`/api/acts/${actId}`);
      await getActs();
      return true;
    } catch (error) {
      handleHttpError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAct = (url) => {
    window.open(url, '_blank');
  };

  return {
    getActs,
    createAct,
    updateAct,
    getActById,
    deleteAct,
    downloadAct,
    isLoading,
  };
};

export default useActsApi;