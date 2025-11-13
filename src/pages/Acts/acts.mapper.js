import { formatDateToBackend } from '../../utils/formate.date';
import { mapChangedFieldsForBackend } from '../../utils/store.utils';
import { actStatusTypes, actStatusTypesRu } from './acts.types';

export const mapActFromApi = (apiAct) => {
  return {
    id: apiAct?.id,
    number: apiAct?.number,
    date: new Date(apiAct?.date),
    creationDate: new Date(apiAct?.creation_date),
    stage: apiAct?.stage,
    company: apiAct?.company ?? null,
    service: apiAct?.service ?? null,
    items: apiAct?.items?.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      measurementUnit: item.measurement_unit,
    })) ?? [],
    sum: apiAct?.sum,
    status: apiAct?.signed === 0 ? actStatusTypes.unstamped : actStatusTypes.stamped,
  };
};

export const mapActDataToBackend = (drafts, changedFieldsSet) => {
  const castValue = (key, value) => {
    switch (key) {
      case 'company_id':
        return Number(value.id);
      case 'stage_id':
        return Number(value.id);
      case 'date':
        return formatDateToBackend(value);
      case 'signed':
        return actStatusTypes.stamped === value ? 1 : 0;
      case 'act_items':
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
      date: 'date',
      stage: 'stage_id',
      status: 'signed',
      items: 'act_items',
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