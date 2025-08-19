import useStore from '../../../hooks/useStore';
import {
  handleHttpError,
  handleHttpResponse,
  handleShowError,
  http,
  resetApiProvider,
} from '../../../shared/http';
import { getQueryParam } from '../../../utils/window.utils';
import {
  mapEmployeesFromApi,
  mapSettingsDataToBackend,
} from '../settings.mapper';
import { useState } from 'react';
import useUser from '../../../hooks/useUser';

const useEmployesApi = () => {
  const { employesStore } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const { user, fetchRights, refetch: fetchUser } = useUser();
  const getEmployes = (page = 1) => {
    resetApiProvider();
    setIsLoading(true);

    return http
      .get('/api/employees', { params: { page } })
      .then(handleHttpResponse)
      .then((res) => {
        const mappedEmployes = res.body.data.map((e) => mapEmployeesFromApi(e));
        employesStore.setEmployes(mappedEmployes); // Устанавливаем клиентов в store
        employesStore.setMetaInfoTable(res.body?.meta);
      })
      .then(() => setIsLoading(false))

      .catch(handleShowError);
  };

  const setEmployes = (body) => {
    return http
      .post('/api/employees', body)
      .then(handleHttpResponse)
      .then((res) => employesStore.setEmployes(res.body))
      .then(() => setIsLoading(false))

      .catch(handleHttpError);
  };

  const getEmployeTypes = () => {
    return http
      .get('/api/employees/types')
      .then(handleHttpResponse)
      .then((res) => employesStore.setEmployeTypes(res.body))
      .then(() => employesStore.getEmployeTypes())
      .then(() => setIsLoading(false))

      .catch(handleHttpError);
  };

  const postFile = (blobFile, fileName) => {
    const form = new FormData();
  };

  const createEmploye = (body) => {
    setIsLoading(true);
    const pageFromUrl = getQueryParam('page', 1);
    resetApiProvider();

    return http
      .post('/api/employees', body)
      .then(handleHttpResponse)
      .then((res) => getEmployes(pageFromUrl))
      .then(() => setIsLoading(false))

      .catch(handleShowError);
  };

  const updateEmploye = (employeId, updateData) => {
    resetApiProvider();
    setIsLoading(true);
    updateData = mapSettingsDataToBackend(
      employesStore.drafts[employeId],
      employesStore.changedProps,
    );
    return http
      .patch(`/api/employees/${employeId}`, updateData)
      .then(handleHttpResponse)
      .then(() => getEmployeById(employeId))
      .then(() => {
        if (user.id === employeId && updateData?.permissions) {
          return fetchUser();
        }
      })
      .then(() => setIsLoading(false))

      .catch(handleShowError);
  };

  const getEmployeById = (employeId) => {
    resetApiProvider();
    return Promise.all([http.get(`/api/employees/${employeId}`)])
      .then(([employeRes, stagesRes]) => {
        const employeData = employeRes.data.data; // Данные сервиса
        // const stagesData = stagesRes.data.data; // Массив этапов

        const mappedEmploye = mapEmployeesFromApi(employeData);

        // changeCurrentElementById(employesStore.employes, setEmployes, mappedEmploye);
        employesStore.setCurrentEmploye(mappedEmploye);

        return mappedEmploye;
      })
      .catch(handleHttpError);
  };

  const deleteEmployee = (id, page) => {
    resetApiProvider();
    const pageFromUrl = page ?? getQueryParam('page', 1);
    setIsLoading(true);
    return http
      .delete(`/api/employees/${id}`)
      .then(handleHttpResponse)
      .then(() => getEmployes(pageFromUrl))
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  return {
    isLoading,
    getEmployeById,
    getEmployes,
    getEmployeTypes,
    createEmploye,
    updateEmploye,
    deleteEmployee,
  };
};

export default useEmployesApi;
