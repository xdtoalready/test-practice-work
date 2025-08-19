import { useCallback, useEffect, useRef, useState } from 'react';
import useBillsApi from '../api/bills.api';
import useStore from '../../../hooks/useStore';
import { isEqual } from 'lodash';

const useBills = (id = null) => {
  const { billsStore } = useStore();
  const api = useBillsApi();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(id ? null : []);
  const prevDataRef = useRef(null);
  const initialLoadDone = useRef(false);

  const getActualData = useCallback(() => {
    if (id !== null) {
      const draft = billsStore.drafts[id];
      if (draft) return draft;

      if (billsStore.currentBill?.id === id) {
        return billsStore.currentBill;
      }

      return billsStore.getById(id);
    }
    return billsStore.getBills();
  }, [id, billsStore]);

  const fetchData = useCallback(async () => {
    if (!id || !initialLoadDone.current) {
      setIsLoading(true);
      try {
        if (id !== null) {
          await api.getBillById(id);
        } else if (!billsStore.bills.length) {
          await api.getBills();
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
  }, [id, api, billsStore, getActualData]);

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
    billsStore.bills,
    billsStore.drafts,
    billsStore.currentBill,
    isLoading,
    getActualData,
  ]);

  return {
    data,
    isLoading,
    store: billsStore,
    refetch: fetchData,
  };
};

export default useBills;
