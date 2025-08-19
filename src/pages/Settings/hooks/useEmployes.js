import React, { useMemo, useState, useCallback } from 'react';
import useStore from '../../../hooks/useStore';
import { useLocation } from 'react-router-dom';
import useEmployesApi from "../api/employes.api";

const useEmployes = (id = null) => {
    const { employesStore } = useStore();
    const api = useEmployesApi();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const currentPage = parseInt(query.get('page')) || 1; // Если нет параметра, то первая страница

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            if (id !== null) {
                // if (!employesStore.employes.length) {
                //   await api.getEmployeById(id);
                // } else {
                //   const employeFromStore = employesStore.getById(id);
                //   if (employeFromStore) {
                //     employesStore.setCurrentEmploye(employeFromStore);
                //   } else {
                //     await api.getEmployeById(id);
                //   }
                await api.getEmployeById(id);
            } else if (!employesStore.employes.length) {
                await api.getEmployes(currentPage);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [id, employesStore, api]);

    useMemo(() => {
        fetchData();
    }, [id, employesStore]);

    const result = useMemo(() => {
        if (id !== null) {
            return employesStore.getById(id);
        } else {
            return employesStore;
        }
    }, [
        id,
        employesStore.currentEmploye,
        employesStore.employes,
        employesStore.drafts,
    ]);

    return { data: result, isLoading, store: employesStore, fetchData };
};

export default useEmployes;
