import React, { useMemo, useState, useCallback } from 'react';
import useStore from '../../../hooks/useStore';
import useClientsApi from '../clients.api';
import { useLocation } from 'react-router-dom';

const useClients = (id = null) => {
  const { clientsStore } = useStore();
  const api = useClientsApi();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get('page')) || 1; // Если нет параметра, то первая страница

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (id !== null) {
        // if (!clientsStore.clients.length) {
        //   await api.getClientById(id);
        // } else {
        //   const clientFromStore = clientsStore.getById(id);
        //   if (clientFromStore) {
        //     clientsStore.setCurrentClient(clientFromStore);
        //   } else {
        //     await api.getClientById(id);
        //   }
        await api.getClientById(id);
      } else if (!clientsStore.clients.length) {
        await api.getClients(currentPage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [id, clientsStore, api]);

  useMemo(() => {
    fetchData();
  }, [id, clientsStore]);

  const result = useMemo(() => {
    if (id !== null) {
      return clientsStore.getById(id);
    } else {
      return clientsStore;
    }
  }, [
    id,
    clientsStore.currentClient,
    clientsStore.clients,
    clientsStore.drafts,
  ]);

  return { data: result, isLoading, store: clientsStore, fetchData };
};

export default useClients;
