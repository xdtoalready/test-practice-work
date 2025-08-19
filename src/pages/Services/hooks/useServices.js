import React, { useMemo, useState, useCallback } from 'react';
import useStore from '../../../hooks/useStore';
import useServiceApi from '../services.api';
import { useLocation } from 'react-router-dom';

const useServices = (id = null, fromServicePage = false) => {
  const { servicesStore } = useStore();
  const api = useServiceApi();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get('page')) || 1; // Если нет параметра, то первая страница

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (id !== null) {
        // Логика для загрузки конкретной услуги по ID

        await api.getServiceById(id, fromServicePage);
      } else if (!servicesStore.services.length) {
        // Логика для загрузки всех услуг при пустом сторе
        await api.getServices(currentPage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [id, servicesStore, api, currentPage]);

  // Используем useMemo для вызова fetchData
  useMemo(() => {

    fetchData();
  }, [id, servicesStore, servicesStore.changedProps]);

  const result = useMemo(() => {

    if (id && !servicesStore.currentService) return null;
    if (id !== null) {
      return servicesStore.getById(id);
    } else {
      return servicesStore;
    }
  }, [
    // id,
    servicesStore.currentService,
    servicesStore.drafts,
    servicesStore.services,
  ]);

  return { data: result, isLoading, store: servicesStore, fetchData };
};

export default useServices;
