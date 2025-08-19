import React, { useMemo, useState, useCallback } from 'react';
import useStore from '../../../hooks/useStore';
import useLegalsApi from '../api/legals.api';
import { useLocation } from 'react-router-dom';

const useLegals = (id = null) => {
    const { legalsStore } = useStore();
    const api = useLegalsApi();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const currentPage = parseInt(query.get('page')) || 1; // Если нет параметра, то первая страница

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            if (id !== null) {
                // if (!legalsStore.legals.length) {
                //   await api.getLegalById(id);
                // } else {
                //   const clientFromStore = legalsStore.getById(id);
                //   if (clientFromStore) {
                //     legalsStore.setCurrentLegal(clientFromStore);
                //   } else {
                //     await api.getLegalById(id);
                //   }
                await api.getLegalById(id);
            } else if (!legalsStore.legals.length) {
                await api.getLegals(currentPage);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [id, legalsStore, api]);

    useMemo(() => {
        fetchData();
    }, [id, legalsStore]);

    const result = useMemo(() => {
        if (id !== null) {
            return legalsStore.getById(id);
        } else {
            return legalsStore;
        }
    }, [
        id,
        legalsStore.currentLegal,
        legalsStore.legals,
        legalsStore.drafts,
    ]);

    return { data: result, isLoading, store: legalsStore, fetchData };
};

export default useLegals;
