import { useCallback, useEffect, useRef, useState } from 'react';
import useReportsApi from '../api/reports.api';
import useStore from '../../../hooks/useStore';
import { isEqual } from 'lodash';

const useReports = (id = null) => {
  const { reportsStore } = useStore();
  const api = useReportsApi();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(id ? null : []);
  const prevDataRef = useRef(null);
  const initialLoadDone = useRef(false);

  const getActualData = useCallback(() => {
    if (id !== null) {
      const draft = reportsStore.drafts[id];
      if (draft) return draft;

      if (reportsStore.currentReport?.id === id) {
        return reportsStore.currentReport;
      }

      return reportsStore.getById(id);
    }
    return reportsStore.getReports();
  }, [id, reportsStore]);

  const fetchData = useCallback(async () => {
    if (!id || !initialLoadDone.current) {
      setIsLoading(true);
      try {
        if (id !== null) {
          await api.getReportById(id);
        } else if (!reportsStore.reports.length) {
          await api.getReports();
        }

        const result = getActualData();
        if (!isEqual(prevDataRef.current, result)) {
          prevDataRef.current = result;
          setData(result);
        }
        initialLoadDone.current = true;
      } catch (error) {
        console.error('Error fetching reports:', error);
        setData(id ? null : []);
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, api, reportsStore, getActualData]);

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
    reportsStore.reports,
    reportsStore.drafts,
    reportsStore.currentReport,
    isLoading,
    getActualData,
  ]);

  return {
    data,
    isLoading,
    store: reportsStore,
    refetch: fetchData,
  };
};

export default useReports;