import {
  handleHttpError,
  handleHttpResponse,
  handleShowError,
  http,
  mockHttp,
  resetApiProvider,
} from '../../shared/http';
import { statusTypes } from './clients.types';
import mocks from './clients.mocks';
import useStore from '../../hooks/useStore';
import { useEffect, useRef, useState } from 'react';
import {
  mapClientDataToBackend,
  mapClientFromApi,
  mapCommentDataToBackend,
} from './clients.mapper';
import useQueryParam from '../../hooks/useQueryParam';
import { getQueryParam, sanitizeUrlFilters } from '../../utils/window.utils';
import { enqueueSnackbar } from 'notistack';
import { handleSubmit } from '../../utils/snackbar';
import useCalendarApi from '../Calendar/calendar.api';
import {
  mapBusinessFromApi,
  mapBusinessToBackend,
} from '../Calendar/calendar.mapper';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';

let blob = new Blob([], { type: 'application/pdf' });
let fakeFile = blob;

resetApiProvider();

// mockHttp.onGet('/api/companies').reply(200, mocks.createClients());
// mockHttp.onPost('/api/companies').reply(200, mocks.createClients());
// mockHttp.onGet(/\/api\/companies\/\d+/).reply((config) => {
//   const id = parseInt(config.url.split('/').pop());
//
//   const clients = mocks.createClients();
//   const client = clients.find((c) => c.id === id);
//
//   if (client) {
//     return [200, client];
//   } else {
//     console.log(`Client with id ${id} not found`);
//     return [404, { message: 'Client not found' }];
//   }
// });
mockHttp.onGet(`/download/file`).reply((config) => {
  return [200, fakeFile];
});

const getRelatedEntity = (id) => {
  return {
    relatedEntity: {
      id,
      type: 'company',
    },
  };
};
const useClientsApi = () => {
  const { clientsStore } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const businessApi = useCalendarApi();
  const navigate = useNavigate();
  const location = useLocation();

  const getClients = (page = 1, filters = {}) => {

    resetApiProvider();
    setIsLoading(true);
    let sanitizedFilters = sanitizeUrlFilters({
      status: getQueryParam('status'),
      manager_id: getQueryParam('manager_id'),
    });

    return http
      .get('/api/companies', { params: { page: page, ...sanitizedFilters } })
      .then(handleHttpResponse)
      .then((res) => {
        const mappedClients = res.body.data.map((e) => mapClientFromApi(e));
        clientsStore.setClients(mappedClients); // Устанавливаем клиентов в store
        clientsStore.setMetaInfoTable(res.body?.meta);
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const createAccount = (companyId) => {
    resetApiProvider();
    setIsLoading(true);
    return http
      .get(`/api/companies/${companyId}/create_account`)
      .then(handleHttpResponse)
      .then(() => getClientById(companyId)) // После успешного создания запрашиваем обновленные данные
      .then(() => handleSubmit('Личный кабинет успешно создан'))
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  const createCompany = (body) => {
    resetApiProvider();
    setIsLoading(true);

    const pageFromUrl = getQueryParam('page', 1);
    const updateData = mapClientDataToBackend(body, Object.keys(body));
    return http
      .post('/api/companies', updateData)
      .then(handleHttpResponse)
      .then(() => getClients(pageFromUrl))
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  const getFlatClientById = (id) => {
    resetApiProvider();
    return http
      .get(`/api/companies/${id}`)
      .then((res) => {
        return handleHttpResponse(mapClientFromApi(res.data.data));
      })
      .catch(handleShowError);
  };

  const getClientById = (id, needToReload = true) => {
    resetApiProvider();
    needToReload && setIsLoading(true);
    return (
      Promise.all([
        http.get(`/api/companies/${id}`),
        http.get(`/api/companies/${id}/passwords`).catch(handleHttpError),
        http.get(`/api/companies/${id}/clients`).catch(handleHttpError),
        http.get(`/api/companies/${id}/activities`).catch(handleHttpError),
        http.get(`/api/companies/${id}/services`).catch(handleHttpError),
        http.get(`/api/companies/${id}/deals`).catch(handleHttpError),
        http.get(`/api/companies/${id}/businesses`).catch(handleHttpError),
        http.get(`/api/companies/${id}/calls`).catch(handleHttpError),
      ])
        // .then(handleHttpResponse)
        .then(
          ([
            clientRes,
            passwordsRes,
            contactRes,
            commentsRes,
            servicesRes,
            dealsRes,
            businessRes,
            callsRes,
          ]) => {

            const clientData = clientRes?.data?.data;
            const passwordsData = passwordsRes?.data?.data;
            const contactPersonsData = contactRes?.data?.data;
            const commentsData = commentsRes?.data?.data;
            const servicesData = servicesRes?.data?.data;
            const dealsData = dealsRes?.data?.data;
            const businessesData = businessRes?.data?.data;
            const callsData = callsRes?.data?.data;
            // const passwordsData = [];
            // const contactPersonsData = [];
            // const commentsData = [];
            // const servicesData = [];
            // const dealsData = [];
            // const businessesData = [];
            // const callsData = [];
            const mappedClient = mapClientFromApi(
              clientData,
              passwordsData,
              contactPersonsData,
              commentsData,
              servicesData,
              dealsData,
              businessesData,
              callsData,
            );

            clientsStore.setCurrentClient(mappedClient); // Устанавливаем смапленного клиента в store

            return mappedClient; // Возвращаем смапленного клиента
          },
        )
        .catch(handleHttpError)
        .finally(() => setIsLoading(false))
    );
  };

  // Обновление данных компании
  const updateCompany = (id, updateData, submitText) => {
    resetApiProvider();
    setIsLoading(true);
    updateData = mapClientDataToBackend(
      clientsStore.drafts[id],
      clientsStore.changedProps,
    );
    return http
      .patch(`/api/companies/${id}`, updateData)
      .then(handleHttpResponse)
      .then(() => getClientById(id))
      .then(() => handleSubmit(submitText ?? 'Сохранение успешно'))
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  const createComment = (companyId, updateData, submitText) => {
    resetApiProvider();
    setIsLoading(true);

    const formData = mapCommentDataToBackend(
      clientsStore.drafts[companyId],
      clientsStore.changedProps,
    );

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    return http
      .post(`/api/companies/${companyId}/comment`, formData, config)
      .then(handleHttpResponse)
      .then(() => getClientById(companyId))
      .then(() => handleSubmit(submitText ?? 'Комментарий сохранен'))
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  const updatePasswords = (id, passId, updateData, submitText) => {
    resetApiProvider();
    setIsLoading(true);
    updateData = mapClientDataToBackend(
      clientsStore.drafts[id],
      clientsStore.changedProps,
      passId,
    );
    return http
      .patch(`/api/passwords/${passId}`, updateData)
      .then(handleHttpResponse)
      .then(() => getClientById(id))
      .then(() => handleSubmit(submitText ?? 'Сохранение успешно'))
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  // Удаление компании
  const deleteCompany = (id, page) => {
    const pageFromUrl = page ?? getQueryParam('page', 1);
    resetApiProvider();
    setIsLoading(true);
    return http
      .delete(`/api/companies/${id}`)
      .then(handleHttpResponse)
      .then(() => getClients(pageFromUrl))
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  // Создание клиента в компании
  const createClient = (companyId, clientData) => {
    resetApiProvider();
    setIsLoading(true);
    const updateData = mapClientDataToBackend(
      clientData,
      Object.keys(clientData),
    );
    return http
      .post(`/api/companies/${companyId}/clients`, updateData)
      .then(handleHttpResponse)
      .then(() => getClientById(companyId))
      .then(() => handleSubmit('Данные клиента сохранены'))

      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };
  const createPassword = (companyId, clientData) => {
    resetApiProvider();
    setIsLoading(true);

    return http
      .post(`/api/companies/${companyId}/passwords`, clientData)
      .then(handleHttpResponse)
      .then(() => getClientById(companyId))
      .then(() => handleSubmit('Пароль сохранен'))
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const createSite = (companyId, clientData) => {
    resetApiProvider();
    setIsLoading(true);

    return http
      .post(`/api/companies/${companyId}/site`, clientData)
      .then(handleHttpResponse)
      .then(() => getClientById(companyId))
      .then(() => handleSubmit('Сайт сохранен'))
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const updateSite = (id, siteId, updateData, submitText) => {
    resetApiProvider();
    setIsLoading(true);
    updateData = mapClientDataToBackend(
      clientsStore.drafts[id],
      clientsStore.changedProps,
      siteId,
    );
    return http
      .patch(`/api/companies/${id}/site/${siteId}`, updateData)
      .then(handleHttpResponse)
      .then(() => getClientById(id))
      .then(() => handleSubmit(submitText ?? 'Сохранение успешно'))
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };


  const deleteSite = (clientId, siteId) => {
    resetApiProvider();
    setIsLoading(true);
    return http
      .delete(`/api/companies/${clientId}/site/${siteId}`)
      .then(handleHttpResponse)
      .then(() => handleSubmit('Сайт удален'))

      .then(() => getClientById(clientId))
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };







  const deletePassword = (clientId, passId) => {
    resetApiProvider();
    setIsLoading(true);
    return http
      .delete(`/api/passwords/${passId}`)
      .then(handleHttpResponse)
      .then(() => handleSubmit('Пароль удален'))

      .then(() => getClientById(clientId))
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  // Обновление клиента компании
  const updateClient = (store, entityId, clientId, submitText) => {
    resetApiProvider();
    const isClient = window.location.href.includes('clients');
    const updateData = mapClientDataToBackend(
      store.drafts[entityId],
      store.changedProps,
      clientId,
    );

    setIsLoading(true);
    return http
      .patch(`/api/clients/${clientId}`, updateData)
      .then(handleHttpResponse)
      .then(() => isClient && getClientById(entityId, true))
      .then(() => handleSubmit(submitText ?? 'Данные клиента сохранены'))

      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  const deleteClient = (clientId, companyId) => {
    resetApiProvider();
    setIsLoading(true);
    return http
      .delete(`/api/clients/${clientId}`)
      .then(handleHttpResponse)
      .then(() => getClientById(companyId))
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const updateBusiness = (businessId, drafts, changedFieldsSet, clientId) => {
    setIsLoading(true);

    const dataToSend = mapClientDataToBackend(
      { businesses: { ...drafts, ...getRelatedEntity(clientId) } },
      changedFieldsSet,
      businessId,
    );

    return http
      .patch(`/api/businesses/${businessId}`, dataToSend)
      .then(handleHttpResponse)
      .then((res) => {
        const mappedBusiness = mapBusinessFromApi(res.body.data);
        const currClient = clientsStore.getById(clientId);
        const updatedBusinesses = {
          ...currClient.businesses,
          [businessId]: mappedBusiness,
        };
        clientsStore.setCurrentClient({
          ...currClient,
          businesses: updatedBusinesses,
        });
      })
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  const createBusiness = (data, clientId) => {
    resetApiProvider();
    setIsLoading(true);

    return http
      .post(`/api/companies/${clientId}/business`, {
        ...mapBusinessToBackend(
          { ...data, ...getRelatedEntity(clientId) },
          Object.keys(data),
        ),
      })
      .then(handleHttpResponse)
      .then((res) => {
        const mappedBusiness = mapBusinessFromApi(res.body.data);
        const currDeal = clientsStore.getById(clientId);
        const updatedBusinesses = {
          ...currDeal.businesses,
          [mappedBusiness.id]: mappedBusiness,
        };
        clientsStore.setCurrentClient({
          ...currDeal,
          businesses: updatedBusinesses,
        });
      })
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  return {
    getClients,
    createPassword,
    getClientById,
    createCompany,
    updateCompany,
    deleteCompany,
    createClient,
    updateClient,
    updatePasswords,
    deleteClient,
    deletePassword,
    createComment,
    updateBusiness,
    createAccount,
    createBusiness,
    getFlatClientById,
    createSite,
    updateSite,
    deleteSite,
    isLoading,
  };
};

export default useClientsApi;
