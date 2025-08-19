import {useMemo, useState} from 'react';
import { dealStatusTypes, dealStatusTypesRu, colorStatusDealTypes } from '../deals.types';
import useStore from "../../../hooks/useStore";
import useDeals from "./useDeals";

const useDealsByStatus = () => {
    // const { data: deals, isLoading } = useDeals(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dealsStore } = useStore();
    const deals = dealsStore.deals;
    const statusedDeals = useMemo(() => {
        setIsLoading(true)
        return Object.values(dealStatusTypes).map((status) => {
            const dealsInStatus = deals.filter((deal) => deal.status === status);
            const sumPrice = Math.ceil(
                dealsInStatus.reduce((sum, deal) => sum + (deal.price || 0), 0)
            );

            return {
                type: status,
                typeRu: dealStatusTypesRu[status],
                values: dealsInStatus,
                color: { color: colorStatusDealTypes[status].class },
                sumPrice
            };
        });
    }, [deals]);

    return { data: statusedDeals, isLoading, store: dealsStore };
};

export default useDealsByStatus;