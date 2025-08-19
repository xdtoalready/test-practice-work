import { useState, useEffect, useCallback } from 'react';

const useRefetchData = (requestFn, dependencies = []) => {
    const [isLoading, setIsLoading] = useState(true);
    const [requestId, setRequestId] = useState(0);

    const refetch = useCallback(() => {
        setRequestId(prev => prev + 1);
    }, []);

    useEffect(() => {
        let isCancelled = false;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                await requestFn();
            } catch (error) {
                console.error(error);
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isCancelled = true;
        };
    }, [...dependencies, requestId]);

    return { isLoading, refetch };
};

export default useRefetchData;