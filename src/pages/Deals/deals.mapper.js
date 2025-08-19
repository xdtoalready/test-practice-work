import { mapChangedFieldsForBackend } from '../../utils/store.utils';
import { loadAvatar } from '../../utils/create.utils';
import { mapTaskFromApi } from '../Tasks/tasks.mapper';
import { createMockTasks } from './deals.mock';
import {mapBusinesses, mapCommentsFromApi, mapContactPersons} from '../Clients/clients.mapper';
import {mapBusinessToBackend} from "../Calendar/calendar.mapper";
import {mapCallsResponse} from "../Calls/calls.mapper";

export const mapDealFromApi = (apiDeal, tasksDeal, comments = [],contacts=[],businesses=[],calls=[]) => {
  return {
    id: apiDeal?.id,
    createdAt: new Date(apiDeal?.created_at),
    name: apiDeal?.name,
    description: Boolean(apiDeal?.description) ? apiDeal?.description : ' ',
    note: apiDeal?.note ?? '',
    source: apiDeal?.source,
    serviceType: apiDeal?.service_type,
      contactPersons: mapContactPersons(contacts),
    price: apiDeal?.price,
    status: apiDeal?.status,
      businesses: mapBusinesses(businesses),
      calls:mapCallsResponse(calls),
    creator: apiDeal?.creator
      ? {
          id: apiDeal?.creator.id,
          name: apiDeal?.creator.name,
          middleName: apiDeal?.creator.middle_name,
          lastName: apiDeal?.creator.last_name,
          image: loadAvatar(apiDeal?.creator.avatar),
          role: apiDeal?.creator.position.name,
        }
      : null,
    responsible: apiDeal?.responsible
      ? {
          id: apiDeal?.responsible.id,
          name: apiDeal?.responsible.name,
          middleName: apiDeal?.responsible.middle_name,
          lastName: apiDeal?.responsible.last_name,
          image: loadAvatar(apiDeal?.responsible.avatar),
          role: apiDeal?.responsible.position.name,
        }
      : null,
      auditor: apiDeal?.auditor
          ? Array.isArray(apiDeal.auditor)
              ? apiDeal.auditor.map(auditor => ({
                  id: auditor.id,
                  name: auditor.name,
                  middleName: auditor.middle_name,
                  lastName: auditor.last_name,
                  image: loadAvatar(auditor.avatar),
                  role: auditor.position.name,
              }))
              : [{
                  id: apiDeal?.auditor.id,
                  name: apiDeal?.auditor.name,
                  middleName: apiDeal?.auditor.middle_name,
                  lastName: apiDeal?.auditor.last_name,
                  image: loadAvatar(apiDeal?.auditor.avatar),
                  role: apiDeal?.auditor.position.name,
              },
              ]
          : [],
    manager: apiDeal?.manager
      ? {
          id: apiDeal?.manager.id,
          name: apiDeal?.manager.name,
          middleName: apiDeal?.manager.middle_name,
          lastName: apiDeal?.manager.last_name,
          image: loadAvatar(apiDeal?.manager.avatar),
          role: apiDeal?.manager.position.name,
        }
      : null,
    company: apiDeal?.company
      ? {
          image: loadAvatar(),
          id: apiDeal?.company.id,
          name: apiDeal?.company.name,
        }
      : null,
    tasks: tasksDeal ? mapTasksFromApi(tasksDeal) : [],
    comments: mapCommentsFromApi(comments),
  };
};

const mapTasksFromApi = (tasksData) => {
  return tasksData?.reduce((acc, task,index) => {
    const mappedTask = mapTaskFromApi(task);
      acc[mappedTask.id] = {
          ...mappedTask,
          order: index
      };
    return acc;
  }, {});
};

const mapBusinessesToBackend = (business, changedFieldsSet) => {

    const businessId = business?.id;

    const filteredChangedFields = new Set(
        [...changedFieldsSet]
            .filter(field => field.startsWith(`businesses.${businessId}.`)) // Оставляем только относящиеся к текущему бизнесу
            .map(field => field.replace(`businesses.${businessId}.`, '')) // Убираем префикс
    );
    if (filteredChangedFields.size === 0) return {};

    return mapBusinessToBackend(business, filteredChangedFields);
};

export const mapDealDataToBackend = (drafts, changedFieldsSet) => {
  const castValue = (key, value) => {
    switch (key) {
      case 'responsible_id':
      case 'manager_id':
      case 'company_id':
        return value ? Number(value.id) : null;
      case 'price':
        return Number(value);
      case 'auditor_id':
          return value.map((el) => el.id);
      default:
        return value;
    }
  };

  const mapKeyToBackend = (key) => {
    const keyMapping = {
      responsible: 'responsible_id',
      auditor: 'auditor_id',
      manager: 'manager_id',
      company: 'company_id',
      serviceType: 'service_type',
    };

    return keyMapping[key] || key;
  };

  return {...mapChangedFieldsForBackend(
    drafts,
    changedFieldsSet,
    mapKeyToBackend,
    castValue,
  ),
      ...mapBusinessesToBackend(drafts?.businesses, changedFieldsSet),

  };
};
