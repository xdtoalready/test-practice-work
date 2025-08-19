import { useCallback, useEffect, useRef, useState } from 'react';
import useStore from '../../../hooks/useStore';
import { isEqual } from 'lodash';
import useActsApi from '../acts.api';

const useActs = (id = null) => {
  const { actsStore } = useStore();
  const api = useActsApi();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(id ? null : []);
  const prevDataRef = useRef(null);
  const initialLoadDone = useRef(false);

  const getActualData = useCallback(() => {
    if (id !== null) {
      const draft = actsStore.drafts[id];
      if (draft) return draft;

      if (actsStore.currentBill?.id === id) {
        return actsStore.currentBill;
      }

      return actsStore.getById(id);
    }
    return actsStore.getBills();
  }, [id, actsStore]);

  const fetchData = useCallback(async () => {
    if (!id || !initialLoadDone.current) {
      setIsLoading(true);
      try {
        if (id !== null) {
          await api.getActById(id);
        } else if (!actsStore.bills.length) {
          await api.getActs();
        }

        const result = getActualData();
        if (!isEqual(prevDataRef.current, result)) {
          prevDataRef.current = result;
          setData(result);
        }
        initialLoadDone.current = true;
      } catch (error) {
        console.error('Error fetching bills:', error);
        setData(id ? null : []);
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, api, actsStore, getActualData]);

  useEffect(() => {
    fetchData();
    return () => {
      initialLoadDone.current = false;
    };
  }, [id]);

  useEffect(() => {
    if (initialLoadDone.current && !isLoading) {
      const newData = getActualData();
      if (!isEqual(prevDataRef.current, newData)) {
        prevDataRef.current = newData;
        setData(newData);
      }
    }
  }, [
    id,
    actsStore.acts,
    actsStore.drafts,
    actsStore.currentAct,
    isLoading,
    getActualData,
  ]);

  return {
    data,
    isLoading,
    store: actsStore,
    refetch: fetchData,
  };
};

export default useActs;
