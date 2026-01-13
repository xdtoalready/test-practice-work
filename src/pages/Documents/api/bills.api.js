// billsApi.js

import useStore from '../../../hooks/useStore';
import {
  getPageTypeFromUrl,
  getQueryParam,
  sanitizeUrlFilters,
} from '../../../utils/window.utils';
import { mapBillDataToBackend, mapBillFromApi } from '../mappers/bills.mapper';
import {
  handleHttpError,
  handleHttpResponse,
  handleShowError,
  http,
  resetApiProvider,
} from '../../../shared/http';
import { useState } from 'react';
import { API_URL } from '../../../shared/constants';
import { sanitizeObjectForBackend } from '../../../utils/create.utils';
import { startOfDay, sub } from 'date-fns';
import useQueryParam from '../../../hooks/useQueryParam';
import { formatDateForUrl } from '../components/BillsTable';
import useStageApi from '../../Stages/stages.api';
import useServiceApi from '../../Services/services.api';
import { useParams } from 'react-router';
import { periodEnum } from '../filters/bills.filter.conf';
import { formatDateToQuery } from '../../../utils/formate.date';
import { sanitizeDateAndPeriodFilters } from '../../../utils/filter.utils';

const useBillsApi = () => {
  const { billsStore } = useStore();
  const serviceApi = useServiceApi();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const getBills = (page = 1,type='bill') => {
    resetApiProvider();
    setIsLoading(true);
    page = getQueryParam('page', 1);
    let sanitizedFilters = sanitizeUrlFilters({
      status: getQueryParam('status'),
      service_type: getQueryParam('service_type'),
      date_range: getQueryParam('date_range'),
      period: getQueryParam('period'),
      document_type:type,
      company_id: getQueryParam('company_id'),
      legal_entity_id: getQueryParam('legal_entity_id'),
    });

    let params = { page };

    const [paramsData, sanitizeFiltersData] = sanitizeDateAndPeriodFilters(
      params,
      sanitizedFilters,
    );

    return http
      .get('api/documents', {
        params: {
          ...paramsData,
          ...sanitizeFiltersData, // Добавляем параметры фильтрации
        },
      })
      .then(handleHttpResponse)
      .then((res) => {
        const mappedBills = res.body.data.map((bill) => mapBillFromApi(bill));
        billsStore.setBills(mappedBills);
        billsStore.setMetaInfoTable(res.body?.meta);
        billsStore.setStats(res.body.stats);
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const createBill = (body, stageId) => {
    const today = startOfDay(new Date());
    const monthAgo = sub(today, { months: 1 });
    const todayFormatted = formatDateForUrl(today);

    const monthAgoFormatted = formatDateForUrl(monthAgo);

    const from = getQueryParam('from', monthAgoFormatted);
    const to = getQueryParam('to', todayFormatted);
    const pageFromUrl = getQueryParam('page', 1);
    resetApiProvider();
    setIsLoading(true);
    const createData = mapBillDataToBackend(body, Object.keys(body));
    const finalData = sanitizeObjectForBackend(createData, [
      'legal_entity_id',
      'creation_date',
      'number',
      'payment_date',
      'payment_reason',
      'stage_id',
      'bill_items',
    ]);
    return http
      .post('/api/bills', finalData)
      .then(handleHttpResponse)
      .then(() => stageId === null && getBills(pageFromUrl, from, to))
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  };

  const updateBill = (billId, updateData, stageMode = false) => {
    const today = startOfDay(new Date());
    const page = getQueryParam('page', 1);
    const monthAgo = sub(today, { months: 1 });
    const todayFormatted = formatDateForUrl(today);

    const monthAgoFormatted = formatDateForUrl(monthAgo);

    const from = getQueryParam('from', monthAgoFormatted);
    const to = getQueryParam('to', todayFormatted);
    resetApiProvider();
    setIsLoading(true);

    const allowedFields = [
      'legal_entity_id',
      'creation_date',
      'number',
      'payment_date',
      'payment_reason',
      'stage_id',
      'status',
      'bill_items',
      'act_signed',
      'signed_date',
    ];

    // Проверяем, является ли это обновлением только act_signed
    // (для обновления статуса акта из Services)
    const isActSignedUpdate =
      updateData &&
      typeof updateData === 'object' &&
      !Array.isArray(updateData) &&
      Object.keys(updateData).length <= 2 && // максимум 2 поля: act_signed и signed_date
      updateData.hasOwnProperty('act_signed');

    let dataToUpdate;
    if (isActSignedUpdate) {
      // Прямая передача для act_signed
      console.log('📤 Act signed update:', updateData);
      dataToUpdate = updateData;
    } else {
      // Обычное обновление - берем из store
      console.log('📤 Regular bill update from store');
      dataToUpdate = mapBillDataToBackend(
        billsStore.drafts[billId],
        billsStore.changedProps,
      );
    }

    if (dataToUpdate.bill_items) {
      const allowedItemFields = [
        'name',
        'price',
        'quantity',
        'measurement_unit',
      ];
      dataToUpdate.bill_items = dataToUpdate.bill_items.map((item) => {
        const sanitizedItem = sanitizeObjectForBackend(item, allowedItemFields);

        if (sanitizedItem.hasOwnProperty('measurementUnit')) {
          delete sanitizedItem.measurementUnit;
        }

        return sanitizedItem;
      });
    }

    const sanitizedData = sanitizeObjectForBackend(dataToUpdate, allowedFields);

    console.log('🔄 API Request Details:');
    console.log('  Endpoint:', `/api/bills/${billId}`);
    console.log('  Method:', 'PATCH');
    console.log('  Bill ID:', billId);
    console.log('  Data before sanitize:', dataToUpdate);
    console.log('  Data after sanitize:', sanitizedData);
    console.log('  Full URL:', `${window.location.origin}/api/bills/${billId}`);

    return http
      .patch(`/api/bills/${billId}`, sanitizedData)
      .then((response) => {
        console.log('✅ API Response:', response);
        return handleHttpResponse(response);
      })
      .then(() => {
        if (!stageMode) return getBills(page, from, to);
        return serviceApi.getServiceById(id, true);
      })
      .catch((error) => {
        console.error('❌ API Error:', error);
        throw error;
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const getBillById = (billId) => {
    const page = getQueryParam('page', 1);
    resetApiProvider();
    setIsLoading(true);

    return http
      .get(`/api/bills/${billId}`)
      .then(handleHttpResponse)
      .then((res) => {
        const mappedBill = mapBillFromApi(res.body.data);
        billsStore.setCurrentBill(mappedBill);
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  };

  const deleteBill = async (billId, currentPage) => {
    resetApiProvider();
    setIsLoading(true);

    try {
      await http.delete(`/api/bills/${billId}`);
      const pageFromUrl = currentPage ?? getQueryParam('page', 1);
      await getBills(pageFromUrl);
      return true;
    } catch (error) {
      handleHttpError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBill = (url) => {
    window.open(url, '_blank');
  };

  return {
    getBills,
    createBill,
    updateBill,
    getBillById,
    deleteBill,
    downloadBill,
    isLoading,
  };
};

export default useBillsApi;
