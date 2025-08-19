import {
  http,
  handleHttpResponse,
  handleHttpError,
  handleShowError,
  resetApiProvider,
} from '../../shared/http';
import useStore from '../../hooks/useStore';
import { useState } from 'react';
import { sanitizeUrlFilters } from '../../utils/window.utils';
import { sanitizeDateAndPeriodFilters } from '../../utils/filter.utils';
import { mapCallsResponse } from './calls.mapper';
import { mapBillFromApi } from '../Documents/mappers/bills.mapper';
import {periodEnum} from "./calls.types";

export const callsApi = {
  getCalls: async (filters = {}) => {
    resetApiProvider();

    try {
      const response = await http.get('/api/calls', { params: filters });
      return handleHttpResponse(mapCallsResponse(response?.body?.data));
    } catch (error) {
      return handleHttpError(error);
    }
  },

  getCompanyCalls: async (companyId) => {
    resetApiProvider();

    try {
      const response = await http.get(`/api/companies/${companyId}/calls`);


      return handleHttpResponse(mapCallsResponse(response?.data?.data));
    } catch (error) {
      return handleShowError(error);
    }
  },

  getDealCalls: async (dealId) => {
    resetApiProvider();

    try {
      const response = await http.get(`/api/deals/${dealId}/calls`);
      return handleHttpResponse(mapCallsResponse(response?.data?.data));
    } catch (error) {
      return handleHttpError(error);
    }
  },

  makeCall: async (data) => {
    resetApiProvider();

    try {
      const response = await http.post('/api/calls/initiate_call', data);

      const resp = handleHttpResponse(response);
      if (resp.status === 'success') {
        return resp
      }
    } catch (error) {
      return handleHttpError(error);
    }
  },
  getHistoryCalls: async () =>{
    resetApiProvider();
    try {
      const response = await http.get(`/api/calls/mine`);
      const result = handleHttpResponse(response);
      return mapCallsResponse(result?.body?.data);
    } catch (error) {
      return handleHttpError(error);
    } finally {
    }
  }

};



// Hook for component use
const useCallsApi = () => {
  const { callsStore } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const getCalls = (page = 1, filters = null) => {
    resetApiProvider();
    setIsLoading(true);


    // Get filters from URL or use provided filters
    const urlParams = new URLSearchParams(window.location.search);
    let sanitizedFilters = sanitizeUrlFilters(
      {
        type: urlParams.get('type'),
        duration: urlParams.get('duration'),
        date_range: urlParams.get('date_range'),
        period: urlParams.get('period'),
        phone: urlParams.get('phone'),
        manager_id: urlParams.get('manager_id'),
      },
    );

    let params = { page };

    const [paramsData, sanitizeFiltersData] = sanitizeDateAndPeriodFilters(
      params,
      sanitizedFilters,
        periodEnum.day
    );

    // if (!sanitizedFilters.period){
    //   delete params.period
    // }

    return http
      .get('/api/calls', {
        params: {
          ...paramsData,
          ...sanitizeFiltersData,
        },
      })
      .then(handleHttpResponse)
      .then((res) => {


        const mappedCalls = mapCallsResponse(res?.body?.data);
        callsStore.setCalls(mappedCalls);
        callsStore.setMetaInfoTable(res.body?.meta);
        callsStore.setStats(
          res.body?.stats ?? {
            total: res.body?.count,
            incoming: res.body?.incoming,
            outgoing: res.body?.outgoing,
            duration: res.body?.duration,
          },
        );
        return res;
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const getCompanyCalls = async (companyId) => {
    resetApiProvider();
    setIsLoading(true);


    callsStore.setContext('company', companyId);

    try {
      const response = await http.get(`/api/companies/${companyId}/calls`);
      const result = handleHttpResponse(response);
      return mapCallsResponse(result?.body?.data);
    } catch (error) {
      return handleShowError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDealCalls = async (dealId) => {
    resetApiProvider();
    setIsLoading(true);
    callsStore.setContext('deal', dealId);

    try {
      const response = await http.get(`/api/deals/${dealId}/calls`);
      const result = handleHttpResponse(response);
      return mapCallsResponse(result?.body?.data);
    } catch (error) {
      return handleHttpError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const makeCall = async (data) => {
    resetApiProvider();
    setIsLoading(true);

    try {
      const response = await http.post('/api/calls/initiate_call', data);
      const resp = handleHttpResponse(response);
      if (resp.status === 'success') {
        return 'success';
      }
    } catch (error) {
      return handleHttpError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHistoryCalls = async () =>{
    resetApiProvider();
    setIsLoading(true);
    try {
      const response = await http.get(`/api/calls/mine`);
      const result = handleHttpResponse(response);
      return mapCallsResponse(result?.body?.data);
    } catch (error) {
      return handleHttpError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    getCalls,
    getCompanyCalls,
    getDealCalls,
    makeCall,
    getHistoryCalls,
    isLoading,
  };
};

export default useCallsApi;
