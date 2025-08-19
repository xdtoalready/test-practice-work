import useStore from '../hooks/useStore';
import {
  handleHttpError,
  handleHttpResponse,
  http,
  resetApiProvider,
} from '../shared/http';
import { mapEmployeesFromApi } from '../pages/Settings/settings.mapper';
import { useEffect, useState } from 'react';
import useClientsApi from '../pages/Clients/clients.api';
import useDealsApi from '../pages/Deals/deals.api';
import useTasksApi from '../pages/Tasks/tasks.api';
import { mapCommentsFromApi } from '../pages/Clients/clients.mapper';

const useAppApi = () => {
  const { appStore } = useStore();
  const { getClientById } = useClientsApi();
  const { getDealById } = useDealsApi();
  const { getTaskById } = useTasksApi();
  const [isLoading, setIsLoading] = useState(false);
  const [entityForLoad, setEntityForLoad] = useState(null);

  useEffect(() => {
    if (!isLoading) setEntityForLoad(null);
  }, [isLoading]);

  const sendComment = (entityType, entityId, { text, files }) => {
    resetApiProvider();
    const formData = new FormData();
    formData.append('text', text);

    // Добавляем файлы в FormData
    files.forEach((file) => {
      formData.append('files[]', file.blob.blob); // Добавляем сам файл
    });
    setIsLoading(true);
    setEntityForLoad('comment');
    return http
      .post(`/api/${entityType}/${entityId}/comment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(handleHttpResponse)
      .then((res) => {
        return mapCommentsFromApi([res.body])[res.body.data.id];
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const getEmployees = (query) => {
    resetApiProvider();

    return http
      .get(`/api/selector/employees`, {
        params: { query },
      })
      .then(handleHttpResponse)
      .then((res) => {
        appStore.setEmployees(res.body.data); // Сохраняем сотрудников в стор
        return res.body.data;
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  // Функция для получения компаний
  const getCompanies = (query) => {
    resetApiProvider();

    return http
      .get(`/api/selector/companies`, {
        params: { query },
      })
      .then(handleHttpResponse)
      .then((res) => {
        appStore.setCompanies(res.body.data); // Сохраняем компании в стор
        return res.body.data;
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  // Функция для получения клиентов
  const getClients = (query) => {
    resetApiProvider();

    return http
      .get(`/api/selector/clients`, {
        params: { query },
      })
      .then(handleHttpResponse)
      .then((res) => {
        appStore.setClients(res.data); // Сохраняем клиентов в стор
        return res.data;
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  // Функция для получения должностей сотрудников
  const getEmployeePositions = () => {
    resetApiProvider();
    return http
      .get(`/api/selector/employee_position`)
      .then(handleHttpResponse)
      .then((res) => {
        appStore.setEmployeePositions(res.body.data); // Сохраняем должности сотрудников в стор
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  // Функция для получения задач
  const getTasks = (query) => {
    resetApiProvider();

    return http
      .get(`/api/selector/tasks`, {
        params: { query },
      })
      .then(handleHttpResponse)
      .then((res) => {
        appStore.setTasks(res.data); // Сохраняем задачи в стор
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  // Функция для получения услуг
  const getServices = (query) => {
    resetApiProvider();
    return http
      .get(`/api/selector/services`, {
        params: { query },
      })
      .then(handleHttpResponse)
      .then((res) => {
        appStore.setServices(res.data); // Сохраняем услуги в стор
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const getServicesByCompany = (companyId) => {
    resetApiProvider();
    return http
      .get(`/api/companies/${companyId}/services`, {})
      .then(handleHttpResponse)
      .then((res) => {
        appStore.setServicesByCompany(
          res.body.data.map((el) => ({ id: el.id, name: el.name })),
        ); // Сохраняем услуги в стор
        return res.body.data; // Сохраняем услуги в стор
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const getStagesByService = (serviceId) => {
    resetApiProvider();
    return http
      .get(`/api/services/${serviceId}/stages`, {})
      .then(handleHttpResponse)
      .then((res) => {
        appStore.setStagesByService(
          res.body.data.map((el) => ({ id: el.id, name: el.name })),
        );
        return res.body.data; // Сохраняем услуги в стор
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const getLegalEntities = (query) => {
    resetApiProvider();
    return http
      .get(`/api/selector/legal_entities`, {
        params: { query },
      })
      .then(handleHttpResponse)
      .then((res) => {
        appStore.setLegalEntities(
          res.body.data.map((el) => ({ id: el.id, name: el.name })),
        );
        return res.body.data; // Сохраняем услуги в стор
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };
  const search = (query) => {
    resetApiProvider();
    setIsLoading(true);
    return http
      .get(`/api/search`, {
        params: { query },
      })
      .then(handleHttpResponse)
      .then((res) => {
        appStore.setSearchResults(res.body); // Сохраняем результаты поиска в стор
        return res.body.data;
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const getUserProfile = () => {
    resetApiProvider();
    setIsLoading(true);
    setEntityForLoad('user');
    return http
      .get('/api/me')
      .then(handleHttpResponse)
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const deleteComments = (commentId, onDelete) => {
    resetApiProvider();
    setIsLoading(true);
    setEntityForLoad('user');

    return http
      .delete(`/api/comments/${commentId}`)
      .then(() => onDelete(commentId))
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const getUserRights = () => {
    resetApiProvider();
    setIsLoading(true);
    return http
      .get('/api/my_permissions')
      .then(handleHttpResponse)
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const toggleCommentVisibility = async (commentId) => {
    resetApiProvider();
    setIsLoading(true);
    return await http
      .get(`api/comments/${commentId}/toggle_visibility`)
      .then(handleHttpResponse)
      .then((res) => {
        return mapCommentsFromApi([res.body])[res.body.data.id];
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  return {
    getEmployees,
    deleteComments,
    getCompanies,
    getClients,
    getUserProfile,
    getEmployeePositions,
    getTasks,
    getServices,
    getUserRights,
    getServicesByCompany,
    getStagesByService,
    getLegalEntities,
    search,
    sendComment,
    toggleCommentVisibility,
    isLoading,
    entityForLoad,
  };
};

export default useAppApi;
