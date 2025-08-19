import {
  handleHttpError,
  handleHttpResponse,
  handleShowError,
  http,
  mockHttp,
  resetApiProvider,
} from '../../shared/http';
import mocks from './services.mocks';
import useStore from '../../hooks/useStore';
import { useEffect, useRef, useState } from 'react';
import {
  mapClientDataToBackend,
  mapClientFromApi, mapSites,
} from '../Clients/clients.mapper';
import { mapServiceDataToBackend, mapServiceFromApi } from './services.mapper';
import { getQueryParam, sanitizeUrlFilters } from '../../utils/window.utils';
import { changeCurrentElementById } from '../../utils/store.utils';
import useClientsApi from '../Clients/clients.api';
import { sanitizeObjectForBackend } from '../../utils/create.utils';

let blob = new Blob([], { type: 'application/pdf' });
let fakeFile = blob;

mockHttp.onGet('/services').reply(200, mocks.createServices());
mockHttp.onPost('/services').reply(200, mocks.createServices());
mockHttp.onGet('/services/types').reply(200, mocks.createServiceTypes());
mockHttp.onGet(`/download/file`).reply((config) => {
  return [200, fakeFile];
});

const useServiceApi = () => {
  const { servicesStore } = useStore();
  const { getClientById } = useClientsApi();
  const [isLoading, setIsLoading] = useState(false);
  const getServices = (page = 1, filters = {}) => {
    const pageFromUrl = getQueryParam('page', 1);
    resetApiProvider();
    setIsLoading(true);
    let sanitizedFilters = sanitizeUrlFilters({
      status: getQueryParam('status'),
      manager_id: getQueryParam('manager_id'),
    });

    return http
      .get('/api/services', {
        params: { page: pageFromUrl, ...sanitizedFilters },
      })
      .then(handleHttpResponse)
      .then((res) => {
        const mappedServices = res.body.data.map((e) => mapServiceFromApi(e));
        servicesStore.setServices(mappedServices); // Устанавливаем клиентов в store
        servicesStore.setMetaInfoTable(res.body?.meta);
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const setServices = (body) => {
    resetApiProvider();
    setIsLoading(true);

    return http
      .post('/api/services', body)
      .then(handleHttpResponse)
      .then((res) => servicesStore.setServices(res.body))
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const getServiceTypes = () => {
    resetApiProvider();
    setIsLoading(true);
    return http
      .get('/api/services/types')
      .then(handleHttpResponse)
      .then((res) => servicesStore.setServiceTypes(res.body))
      .then(() => servicesStore.getServiceTypes())
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const postFile = (blobFile, fileName) => {
    const form = new FormData();
  };

  const getCurrentPage = () => {
    const path = window.location.pathname;
    if (path.includes('/clients/')) {
      return 'client';
    } else if (path.includes('/services')) {
      return 'services';
    }
    return null;
  };

  const createService = (body) => {
    setIsLoading(true);
    const pageFromUrl = getQueryParam('page', 1);
    const currentPage = getCurrentPage();
    const clientId = body?.client?.id;
    const updateData = mapServiceDataToBackend(body, Object.keys(body));
    resetApiProvider();
    return http
      .post(`/api/companies/${clientId}/services`, updateData)
      .then(handleHttpResponse)
      .then((res) => {
        // В зависимости от страницы вызываем разные методы обновления данных
        if (currentPage === 'client') {
          return getClientById(clientId);
        } else if (currentPage === 'services') {
          return getServices(pageFromUrl);
        }
        return res;
      })
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  const updateService = (serviceId, updateData) => {
    resetApiProvider();
    setIsLoading(true);
    updateData = mapServiceDataToBackend(
      servicesStore.drafts[serviceId],
      servicesStore.changedProps,
    );

    const resultData = sanitizeObjectForBackend(updateData, [
      'name',
      'type',
      'manager_id',
      'creator_id',
      'active',
      'deadline',
      'participants_ids',
      'company_id',
      'site_id',
      'contract_number',
    ]);
    return http
      .patch(`/api/services/${serviceId}`, resultData)
      .then(handleHttpResponse)
      .then(() => getServiceById(serviceId))
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  const getCompanySites = async (companyId) => {
    resetApiProvider();
    setIsLoading(true);
    const response = await http.get(`/api/companies/${companyId}`);
    const companyData = response.data.data;
    return mapSites(companyData?.sites || []);
  }

  const getServiceById = (serviceId, fromServicePage = false) => {
    setIsLoading(true);
    resetApiProvider();

    // Сначала получаем основные данные сервиса и этапы
    return Promise.all([
      http.get(`/api/services/${serviceId}`),
      http.get(`/api/services/${serviceId}/stages`),
    ])
      .then(([serviceRes, stagesRes]) => {
        const serviceData = serviceRes.data.data;
        const stagesData = stagesRes.data.data;

        // Если мы на странице сервиса и есть id клиента, получаем пароли
        if (fromServicePage && serviceData?.company.id !== null) {
          resetApiProvider();
          return http
            .get(`/api/companies/${serviceData.company.id}/passwords`)
            .then((passwordsRes) => {
              const passwordsData = passwordsRes.data.data;
              // Маппим сервис с паролями
              const mappedService = mapServiceFromApi(
                serviceData,
                stagesData,
                passwordsData,
              );
              servicesStore.setCurrentService(mappedService);
              return mappedService;
            })
            .catch(handleShowError);
        }

        const mappedService = mapServiceFromApi(serviceData, stagesData);
        servicesStore.setCurrentService(mappedService);
        return mappedService;
      })
      .catch((e) => {
        servicesStore.clearCurrentService();
        return handleShowError(e);
      })
      .finally(() => setIsLoading(false));
  };

  const deleteService = (id, page) => {
    resetApiProvider();
    const pageFromUrl = page ?? getQueryParam('page', 1);
    setIsLoading(true);
    return http
      .delete(`/api/services/${id}`)
      .then(handleHttpResponse)
      .then(() => servicesStore.setCurrentService(null))
      .then(() => getServices(pageFromUrl))
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  return {
    setServices,
    getServiceById,
    updateService,
    getServices,
    getServiceTypes,
    createService,
    deleteService,
    getCompanySites,
    isLoading,
  };
};

export default useServiceApi;
