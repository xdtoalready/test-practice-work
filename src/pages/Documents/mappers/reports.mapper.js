// reportsMapper.js - на основе bills.mapper.js

import { formatDateToBackend } from '../../../utils/formate.date';
import { mapChangedFieldsForBackend } from '../../../utils/store.utils';

export const mapReportFromApi = (apiReport) => {
  return {
    id: apiReport?.id,
    number: apiReport?.number,
    creationDate: new Date(apiReport?.creation_date),
    period: apiReport?.period, // например "Декабрь 2024"
    company: apiReport?.company ?? null,
    service: apiReport?.service ?? null,
    stage: apiReport?.stage,
    
    items: apiReport?.items?.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      measurementUnit: item.measurement_unit,
    })) || [],
    
    sum: apiReport?.sum,
    status: apiReport?.status,
    serviceType: apiReport?.service_type,
    downloadUrl: apiReport?.download_url,
    
    // Дополнительные поля которые могут прийти
    month: apiReport?.month,
    year: apiReport?.year,
  };
};

export const mapReportDataToBackend = (drafts, changedFieldsSet) => {
  const castValue = (key, value) => {
    switch (key) {
      case 'company_id':
        return value ? Number(value.id) : null;
      case 'stage_id':
        return Number(value.id);
      case 'creation_date':
        return formatDateToBackend(value);
      case 'report_items':
        return value.map((el) => ({
          name: el.name,
          price: el.price,
          quantity: el.quantity,
          measurement_unit: el.measurementUnit,
        }));
      default:
        return value;
    }
  };

  const mapKeyToBackend = (key, draft) => {
    const keyMapping = {
      company: 'company_id',
      creationDate: 'creation_date',
      stage: 'stage_id',
      items: 'report_items',
    };

    return keyMapping[key] || key;
  };

  return mapChangedFieldsForBackend(
    drafts,
    changedFieldsSet,
    mapKeyToBackend,
    castValue,
  );
};