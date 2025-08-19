import useAppApi from '../api';
import useStore from './useStore';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';

export const useSelectorEmployees = (query = '') => {
  const { getEmployees } = useAppApi();
  const { employees } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEmployees(query).finally(() => setLoading(false));
  }, [query, getEmployees]);

  return { employees, loading };
};

export const useSelectorCompanies = (query = '') => {
  const { getCompanies } = useAppApi();
  const { appStore } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCompanies(query).finally(() => setLoading(false));
  }, [query, getCompanies]);

  return { data: appStore.companies, loading };
};

export const useSelectorClients = (query = '') => {
  const { getClients } = useAppApi();
  const { clients } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getClients(query).finally(() => setLoading(false));
  }, [query, getClients]);

  return { clients, loading };
};

export const useSelectorEmployeePositions = () => {
  const { getEmployeePositions } = useAppApi();
  const { appStore } = useStore();
  useEffect(() => {
    if (!appStore.employeePositions.length) getEmployeePositions();
  }, []);
  return appStore.employeePositions;
};

export const useSelectorTasks = (query = '') => {
  const { getTasks } = useAppApi();
  const { tasks } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTasks(query).finally(() => setLoading(false));
  }, [query, getTasks]);

  return { tasks, loading };
};

export const useSelectorServices = (query = '') => {
  const { getServices } = useAppApi();
  const { services } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getServices(query).finally(() => setLoading(false));
  }, [query, getServices]);

  return { services, loading };
};
