import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import useDealsApi from '../deals.api';
import useStore from "../../../hooks/useStore";
import {get, isEqual} from "lodash";

const useDeals = (id = null) => {
    const { dealsStore } = useStore();
    const api = useDealsApi();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(id ? null : []);
    const prevDataRef = useRef(null);

    const getActualData = useCallback(() => {
        if (id !== null) {
            // Проверяем сначала черновик
            const draft = dealsStore.drafts[id];
            if (draft) return draft;

            // Затем проверяем currentDeal
            if (dealsStore.currentDeal?.id === id) {
                return dealsStore.currentDeal;
            }

            // Затем ищем в общем списке
            return dealsStore.getById(id);
        }
        return dealsStore.getDeals();
    }, [id, dealsStore]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            let result;
            if (id !== null) {
                // При запросе по ID всегда делаем запрос к API
                result = await api.getDealById(id);
            } else {
                if (!dealsStore.deals.length) {
                    await api.getDeals();
                }
                result = getActualData();
            }

            if (!isEqual(prevDataRef.current, result)) {
                prevDataRef.current = result;
                setData(result);
            }
        } catch (error) {
            console.error('Error fetching deals:', error);
            setData(id ? null : []);
        } finally {
            setIsLoading(false);
        }
    }, [id, api, dealsStore, getActualData]);

    // Эффект для начальной загрузки данных
    useEffect(() => {
        fetchData();
    }, [id]);

    // Эффект для отслеживания изменений в сторе
    useEffect(() => {
        if (!isLoading) {
            const newData = getActualData();
            if (!isEqual(prevDataRef.current, newData)) {
                prevDataRef.current = newData;
                setData(newData);
            }
        }
    }, [
        id,
        dealsStore.deals,
        dealsStore.drafts,
        dealsStore.currentDeal,
        isLoading,
        getActualData
    ]);

    return {
        data,
        isLoading,
        store: dealsStore,
        refetch: fetchData
    };
};

export default useDeals;