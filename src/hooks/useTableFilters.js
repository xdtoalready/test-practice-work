import { useState, useMemo } from 'react';

const useTableFilter = (data, defaultFilters = {}) => {
    const [filters, setFilters] = useState(defaultFilters);
    const filteredData = useMemo(() => {
        return data.filter(item => {
            for (let key in filters) {
                const filterValue = filters[key];
                const filterKey = filterValue?.filterKey || key;
                const itemValue = filterValue?.filterKey ? item[key][filterKey] : item[filterKey];
                if(filterValue==='Все') continue
                if ((filterValue?.id !== 'all' ) && ((filterValue?.filterKey && itemValue !== filterValue[filterKey]) ||  (!filterValue?.filterKey && itemValue !== filterValue))) {
                    return false;
                }
            }
            return true;
        });
    }, [data, filters]);

    const setFilterValue = (key, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [key]: value
        }));
    };

    return {
        filteredData,
        setFilterValue,
        filters
    };
};

export default useTableFilter;
