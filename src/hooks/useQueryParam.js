import { useLocation } from 'react-router';

const useQueryParam = (param, defaultValue = null) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const value = query.get(param);

  return value !== null ? value : defaultValue;
};

export default useQueryParam;
