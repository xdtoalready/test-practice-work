// FiltersContext.js
import { createContext, useContext, useState, useRef } from 'react';

const FiltersContext = createContext(null);

export const FiltersProvider = ({ children }) => {
    const [filtersState, setFiltersState] = useState({});
    const initialRequestMade = useRef(false);
    const [filtersValues, setFiltersValues] = useState({});

    const setFilters = (newFilters) => {
        if (!initialRequestMade.current) {
            initialRequestMade.current = true;
            setFiltersState(newFilters);
            return true;
        }
        setFiltersState(newFilters);
        return false;
    };

    const setFilterValue = (filterName, value) => {
        setFiltersValues(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const getFilterValue = (filterName) => {
        return filtersValues[filterName];
    };

    return (
        <FiltersContext.Provider value={{
            filtersState,
            setFilters,
            setFilterValue,
            getFilterValue
        }}>
            {children}
        </FiltersContext.Provider>
    );
};

export const useFilters = () => {
    const context = useContext(FiltersContext);
    if (!context) {
        throw new Error('useFilters must be used within FiltersProvider');
    }
    return context;
};