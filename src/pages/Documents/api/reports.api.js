import useStore from '../../../hooks/useStore';
import {
  getQueryParam,
  sanitizeUrlFilters,
} from '../../../utils/window.utils';
import { mapReportDataToBackend, mapReportFromApi } from '../mappers/reports.mapper';
import {
  handleHttpError,
  handleHttpResponse,
  handleShowError,
  http,
  resetApiProvider,
} from '../../../shared/http';
import { useState } from 'react';
import { sanitizeObjectForBackend } from '../../../utils/create.utils';

const useReportsApi = () => {
  const { reportsStore } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const getReports = (page = 1,type='report') => {
    resetApiProvider();
    setIsLoading(true);
    page = getQueryParam('page', 1);
    
    let sanitizedFilters = sanitizeUrlFilters({
      status: getQueryParam('status'),
      service_type: getQueryParam('service_type'),
      company_id: getQueryParam('company_id'),
      month: getQueryParam('month'),
      year: getQueryParam('year'),
      document_type:type,
    });

    let params = { page };

    return http
      .get('/api/documents', {
        params: {
          ...params,
          ...sanitizedFilters,
        },
      })
      .then(handleHttpResponse)
      .then((res) => {
        const mappedReports = res.body.data.map((report) => mapReportFromApi(report));
        reportsStore.setReports(mappedReports);
        reportsStore.setMetaInfoTable(res.body?.meta);
        reportsStore.setStats(res.body.stats);
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const createReport = (body) => {
    const pageFromUrl = getQueryParam('page', 1);
    resetApiProvider();
    setIsLoading(true);
    
    const createData = mapReportDataToBackend(body, Object.keys(body));
    const finalData = sanitizeObjectForBackend(createData, [
      'number',
      'creation_date',
      'stage_id',
      'company_id',
      'report_items',
    ]);
    
    return http
      .post('/api/reports', finalData)
      .then(handleHttpResponse)
      .then(() => getReports(pageFromUrl))
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  const updateReport = (reportId, updateData) => {
    const page = getQueryParam('page', 1);
    resetApiProvider();
    setIsLoading(true);

    const allowedFields = [
      'number',
      'creation_date',
      'stage_id',
      'company_id',
      'status',
      'report_items',
    ];

    let dataToUpdate = mapReportDataToBackend(
      reportsStore.drafts[reportId],
      reportsStore.changedProps,
    );

    if (dataToUpdate.report_items) {
      const allowedItemFields = [
        'name',
        'price',
        'quantity',
        'measurement_unit',
      ];
      dataToUpdate.report_items = dataToUpdate.report_items.map((item) => {
        const sanitizedItem = sanitizeObjectForBackend(item, allowedItemFields);
        
        if (sanitizedItem.hasOwnProperty('measurementUnit')) {
          delete sanitizedItem.measurementUnit;
        }
        
        return sanitizedItem;
      });
    }

    const sanitizedData = sanitizeObjectForBackend(dataToUpdate, allowedFields);

    return http
      .patch(`/api/reports/${reportId}`, sanitizedData)
      .then(handleHttpResponse)
      .then(() => getReports(page))
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const getReportById = (reportId) => {
    resetApiProvider();
    setIsLoading(true);

    return http
      .get(`/api/reports/${reportId}`)
      .then(handleHttpResponse)
      .then((res) => {
        const mappedReport = mapReportFromApi(res.body.data);
        reportsStore.setCurrentReport(mappedReport);
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const deleteReport = async (reportId, currentPage) => {
    resetApiProvider();
    setIsLoading(true);

    try {
      await http.delete(`/api/reports/${reportId}`);
      const pageFromUrl = currentPage ?? getQueryParam('page', 1);
      await getReports(pageFromUrl);
      return true;
    } catch (error) {
      handleHttpError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = (url) => {
    window.open(url, '_blank');
  };

  return {
    getReports,
    createReport,
    updateReport,
    getReportById,
    deleteReport,
    downloadReport,
    isLoading,
  };
};

export default useReportsApi;