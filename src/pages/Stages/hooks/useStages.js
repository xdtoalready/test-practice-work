import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useStore from '../../../hooks/useStore';
import useStagesApi from '../stages.api';
import { useLocation } from 'react-router-dom';

const useStages = (id) => {
  const { stagesStore } = useStore();
  const api = useStagesApi();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get('page')) || 1; // Если нет параметра, то первая страница

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (id !== null) {
        // Логика для загрузки конкретной услуги по ID
        await api.getStageById(Number(id));
      } else if (!stagesStore.stages.length) {
        // Логика для загрузки всех услуг при пустом сторе
        await api.getTaskStages(id, currentPage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [id, stagesStore, api, currentPage]);

  // Используем useMemo для вызова fetchData
  useMemo(() => {
    fetchData();
  }, [id, stagesStore]);

  // Возвращаем данные в зависимости от наличия ID
  const result = useMemo(() => {
    // if(id && !stagesStore.currentStage) return null
    if (id !== null) {
      return stagesStore.getById(Number(id));
    } else {
      return stagesStore;
    }
  }, [id, stagesStore.currentStage, stagesStore.drafts, stagesStore.stages]);

  return { data: result, isLoading, store: stagesStore, fetchData };
};

export default useStages;
