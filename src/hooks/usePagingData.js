import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import useQueryParam from './useQueryParam';
import { isCurrentPageBetweenLimits } from '../utils/compare';

const usePagingData = (store, fetchData, getDataFromStore) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageFromUrl = useQueryParam('page', 1);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const metaInfo = store.getMetaInfoTable();

  useEffect(() => {
    setCurrentPage(pageFromUrl);
    fetchData(pageFromUrl);
  }, [pageFromUrl]);

  const handlePageChange = useCallback(
    (page) => {
      const searchParams = new URLSearchParams(window.location.search);;
      searchParams.set('page', page);

      const newSearch = searchParams.toString();

      navigate({
        pathname: location.pathname,
        search: newSearch ? `?${newSearch}` : `?page=${page}`,
      });
    },
    [navigate, location.pathname, currentPage, location.search],
  );

  return {
    currentPage: isCurrentPageBetweenLimits(currentPage,1,metaInfo?.last_page) ? currentPage : metaInfo?.last_page || 1,
    totalPages: metaInfo?.last_page || 1,
    totalItems: metaInfo?.total || 0,
    paginatedData: getDataFromStore(),
    itemsPerPage: metaInfo?.per_page || 15,
    handlePageChange,
  };
};

export default usePagingData;
