import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const UseParamSearch = (...params) => {
  const location = useLocation();

  return useMemo(() => {
    const searchParams = new URLSearchParams(location.search);

    if (params.length === 1) {
      // Если передан один параметр, возвращаем его значение
      return searchParams.get(params[0]);
    } else {
      // Если передано несколько параметров, возвращаем объект
      return params.reduce((acc, param) => {
        acc[param] = searchParams.get(param);
        return acc;
      }, {});
    }
  }, [location.search, ...params]);
};

export default UseParamSearch;
