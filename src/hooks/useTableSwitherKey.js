import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useTableSwitherKey = (key,defaultValue='') => {
  const location = useLocation()
  console.log(location.search)
  const currentSwitcher = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(key) || defaultValue;
  }, [location.search]);
  debugger
  return currentSwitcher
};

export default useTableSwitherKey;