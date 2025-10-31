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
  mapLegalEntitiesFromApi,
  mapSettingsDataToBackend,
} from '../settings.mapper';
import { useState } from 'react';

const useLegalsApi = () => {
  const { legalsStore } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const getLegals = (page = 1) => {
    setIsLoading(true);
    resetApiProvider();

    return http
      .get('/api/legal_entities', { params: { page } })
      .then(handleHttpResponse)
      .then((res) => {
        const mappedLegalEntities = res.body.data.map(mapLegalEntitiesFromApi);
        legalsStore.setLegals(mappedLegalEntities);
        legalsStore.setMetaInfoTable(res.body?.meta);
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const getLegalById = (legalId) => {
    resetApiProvider();
    setIsLoading(true);

    return http
      .get(`/api/legal_entities/${legalId}`)
      .then(handleHttpResponse)
      .then((res) => {
        const mappedLegal = mapLegalEntitiesFromApi(res.body.data);
        legalsStore.setCurrentLegal(mappedLegal);
        return mappedLegal;
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const createLegal = (body) => {
    setIsLoading(true);
    const pageFromUrl = getQueryParam('page', 1);
    resetApiProvider();

    // Если есть файлы (сканы), создаем FormData
    const formData = new FormData();
    if (body.signScan) {
      formData.append('sign_scan', body.signScan);
    }
    if (body.stampScan) {
      formData.append('stamp_scan', body.stampScan);
    }

    // Добавляем остальные поля
    Object.keys(body).forEach((key) => {
      if (key !== 'signScan' && key !== 'stampScan') {
        formData.append(key, body[key]);
      }
    });

    return http
      .post('/api/legal_entities', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(handleHttpResponse)
      .then(() => getLegals(pageFromUrl))
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  const updateLegal = (legalId, updateData) => {
    resetApiProvider();
    setIsLoading(true);

    // Преобразуем данные для бэкенда
    const backendData = mapSettingsDataToBackend(
      legalsStore.drafts[legalId],
      legalsStore.changedProps,
    );

    // Добавляем _method для Laravel, чтобы он распознал это как PATCH запрос
    // PHP не парсит multipart/form-data для PATCH запросов
    const dataWithMethod = {
      ...backendData,
      _method: 'PATCH',
    };

    // Если есть файлы, используем FormData
    // const formData = new FormData();
    // if (updateData.signScan instanceof File) {
    //     formData.append('sign_scan', updateData.signScan);
    // }
    // if (updateData.stampScan instanceof File) {
    //     formData.append('stamp_scan', updateData.stampScan);
    // }
    //
    // // Добавляем остальные измененные поля
    // Object.keys(backendData).forEach(key => {
    //     if (key !== 'sign_scan' && key !== 'stamp_scan') {
    //         formData.append(key, backendData[key]);
    //     }
    // });

    return http
      .post(`/api/legal_entities/${legalId}`, dataWithMethod, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(handleHttpResponse)
      .then(() => getLegalById(legalId))
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  const deleteLegal = (legalId) => {
    resetApiProvider();
    setIsLoading(true);
    const pageFromUrl = getQueryParam('page', 1);
    return http
      .delete(`/api/legal_entities/${legalId}`)
      .then(handleHttpResponse)
      .then(() => getLegals(pageFromUrl))
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  return {
    isLoading,
    getLegals,
    getLegalById,
    createLegal,
    updateLegal,
    deleteLegal,
  };
};

export default useLegalsApi;
