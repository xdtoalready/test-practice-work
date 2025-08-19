import {
  handleHttpError,
  handleHttpResponse,
  handleShowError,
  http,
  mockHttp,
  resetApiProvider,
} from '../../shared/http';
import mocks from './stages.mocks';
import useStore from '../../hooks/useStore';
import { useEffect, useRef, useState } from 'react';
import { getQueryParam } from '../../utils/window.utils';
import {
  mapServiceDataToBackend,
  mapServiceFromApi,
} from '../Services/services.mapper';
import { mapStageDataToBackend, mapStageFromApi } from './stages.mapper';
import useServiceApi from '../Services/services.api';
import servicesApi from '../Services/services.api';
import { stageStatusTypes } from './stages.types';
import { format } from 'date-fns';
import { useParams } from 'react-router';
import { formatDateToBackend } from '../../utils/formate.date';

let blob = new Blob([], { type: 'application/pdf' });
let fakeFile = blob;

mockHttp.onGet('/stages').reply(200, mocks.createStages());
mockHttp.onPost('/stages').reply(200, mocks.createStages());
mockHttp.onGet('/stages/templates').reply(200, mocks.createTemplateTypes());
// mockHttp.onGet('/stages/types').reply(200, mocks.createStageTypes())
mockHttp.onGet(/\/stages\/\d+/).reply((config) => {
  // Разделяем URL по "/"
  const urlParts = config.url.split('/');
  // Получаем ID stage из конца URL
  const stageId = parseInt(urlParts[urlParts.length - 1]);

  // Создаем моки
  const stages = mocks.createStages();
  // Ищем stage по ID
  const stage = stages.find((c) => c.id === stageId);

  if (stage) {
    return [200, stage];
  } else {
    console.log(`Stage with id ${stageId} not found`);
    return [404, { message: 'Stage not found' }];
  }
});
mockHttp.onGet(`/download/file`).reply((config) => {
  return [200, fakeFile];
});

const useStageApi = () => {
  const { stagesStore } = useStore();
  const serviceApi = useServiceApi();
  const [isLoading, setIsLoading] = useState(false);
  const { id: serviceId } = useParams();

  const getTaskStages = (stageId, page = null) => {

    const pageFromUrl = page ?? getQueryParam('page', 1);
    setIsLoading(true);
    resetApiProvider();
    return Promise.all([
      http.get(`/api/stages/${stageId}`),
      http.get(`/api/stages/${stageId}/tasks`, {
        params: { page: pageFromUrl },
      }),
    ])
      .then(([stageResponse, tasksResponse]) => {

        const stageData = stageResponse.data.data;
        const tasksData = tasksResponse.data.data;
        const mappedStage = mapStageFromApi(stageData, tasksData); // Маппинг данных
        stagesStore.setStages([mappedStage]); // Сохраняем в store
        stagesStore.setCurrentStage(mappedStage);

        stagesStore.setMetaInfoTable(tasksResponse.data?.meta); // Метаданные задач

        return mappedStage;
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const getStageById = (id, page) => {

    const pageFromUrl = page ?? getQueryParam('page', 1);
    resetApiProvider();
    return Promise.all([
      http.get(`/api/stages/${id}`, { params: { page: pageFromUrl } }),
      http.get(`/api/stages/${id}/tasks`, { params: { page: pageFromUrl } }),
    ])
      .then(([stageResponse, tasksResponse]) => {
        const stageData = stageResponse.data.data;
        const tasksData = tasksResponse.data.data;

        const mappedStage = mapStageFromApi(stageData, tasksData); // Маппинг данных
        stagesStore.setCurrentStage(mappedStage);
        stagesStore.setStages([mappedStage]); // Сохраняем в store
        stagesStore.setMetaInfoTable(tasksResponse.data?.meta); // Метаданные задач

        return mappedStage;
      })
      .catch(handleHttpError);
  };

  const setStages = (body) => {
    resetApiProvider();
    return http
      .post('/stages', body)
      .then(handleHttpResponse)
      .then((res) => stagesStore.setStages(res.body))
      .catch(handleHttpError);
  };

  const getTemplateTypes = () => {
    return http
      .get('/stages/templates')
      .then(handleHttpResponse)
      .then((res) => stagesStore.setStageTemplates(res.body))
      .then(() => stagesStore.getStageTemplates())
      .catch(handleHttpError);
  };
  const getStageTypes = () => {
    return http
      .get('/stages/types')
      .then(handleHttpResponse)
      .then((res) => stagesStore.setStageTypes(res.body))
      .then(() => stagesStore.getStageTypes())
      .catch(handleHttpError);
  };

  const updateStage = (stageId, taskId, updateData) => {
    resetApiProvider();

    updateData = mapStageDataToBackend(
      stagesStore.drafts[stageId],
      stagesStore.changedProps,
      taskId,
    );
    return http
      .patch(`/api/stages/${stageId}`, updateData)
      .then(handleHttpResponse)
      .then(() =>
        Promise.all([
          getStageById(stageId),
          serviceApi.getServiceById(serviceId),
        ]),
      )
      .catch(handleShowError);
  };

  const createStage = (serviceId, data) => {
    // data = {
    //   ...data,
    //   name: data.title,
    //   active: data.status === stageStatusTypes.inProgress,
    //   start: formatDateToBackend(data.startTime),
    //   deadline: formatDateToBackend(data.deadline),
    //   act_sum: data.actSum,
    //   technical_specification: data.taskDescription,
    // };
    data = mapStageDataToBackend(data, Object.keys(data));
    resetApiProvider();
    return http
      .post(`api/services/${serviceId}/stages`, data)
      .then(handleHttpResponse)
      .then(() => serviceApi.getServiceById(serviceId))
      .catch(handleShowError);
  };

  const postFile = (blobFile, fileName) => {
    const form = new FormData();
  };

  const deleteStage = (id) => {
    resetApiProvider();
    setIsLoading(true);
    return http
      .delete(`/api/stages/${id}`)
      .then(handleHttpResponse)
      .then(() => stagesStore.setCurrentStage(null))
      .then(() => servicesApi.getServiceById(id))
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  return {
    createStage,
    updateStage,
    setStages,
    getTaskStages,
    getStageTypes,
    getStageById,
    getTemplateTypes,
    deleteStage,
    isLoading,
  };
};

export default useStageApi;
