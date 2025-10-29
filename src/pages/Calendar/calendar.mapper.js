import {
  formatDateOnlyHours,
  formatDateToBackend,
} from '../../utils/formate.date';
import { mapChangedFieldsForBackend } from '../../utils/store.utils';
import { loadAvatar } from '../../utils/create.utils';
import { mapEmployeesFromApi } from '../Settings/settings.mapper';
import { mapCommentsFromApi } from '../Clients/clients.mapper';
import { format } from 'date-fns';
import { taskableTypes } from '../Tasks/tasks.types';
import { bussinesableType } from './calendar.types';
import { mapParticipants } from '../Services/services.mapper';
import { mapTimeTrackingsFromApi } from '../TimeTracking/timeTracking.mapper';

export const mapBusinessFromApi = (apiBusiness, apiComments = []) => {

  const startDate = new Date(apiBusiness?.start);
  const endDate = new Date(apiBusiness?.end);
  const businessRelatedType = apiBusiness?.related_entity?.type;
  const businessRelatedId = apiBusiness?.related_entity?.id;
  return {
    id: apiBusiness?.id,
    name: apiBusiness?.name,
    description: apiBusiness?.description,
    type: apiBusiness?.type,
    finished: apiBusiness?.finished,
    relatedEntity: apiBusiness.related_entity?.id
      ? {
          id: apiBusiness.related_entity?.id,
          name: apiBusiness.related_entity?.name,
          type: apiBusiness.related_entity.type,
          link: apiBusiness.related_entity.link,
        }
      : null,
    client:
      businessRelatedType === taskableTypes.client
        ? {
            link: apiBusiness?.related_entity?.link || '',
            id: businessRelatedId,
            title: apiBusiness?.related_entity?.name || 'Клиент не задан',
          }
        : null,
    deal:
      businessRelatedType === taskableTypes.deal
        ? {
            id: businessRelatedId,
            title: apiBusiness?.related_entity?.name || 'Сделка не задана',
          }
        : null,
    startDate: new Date(apiBusiness?.start),
    endDate: new Date(apiBusiness?.end),
    startTime: format(startDate, 'HH:mm'),
    endTime: format(endDate, 'HH:mm'),
    creator: mapEmployeesFromApi(apiBusiness.creator),
    performer: mapEmployeesFromApi(apiBusiness.performer),
    participants: apiBusiness?.participants.map(mapEmployeesFromApi),
    comments: mapCommentsFromApi(apiComments),
    timeTrackings: mapTimeTrackingsFromApi(apiBusiness?.time_tracking || []),
  };
};

export const mapBusinessToBackend = (drafts, changedFieldsSet) => {
  // Фильтруем timeTrackings из changedFieldsSet - они не должны отправляться в PATCH
  // changedFieldsSet это Set, поэтому нужно конвертировать в массив, отфильтровать и создать новый Set
  const filteredChangedFieldsSet = new Set(
    Array.from(changedFieldsSet).filter(key => !key.startsWith('timeTrackings'))
  );

  const castValue = (key, value, oldKey) => {
    switch (key) {
      case 'participants_ids':
        return value?.map((el) => el?.id ?? null) ?? [];
      case 'businessable_type':
        return bussinesableType[value?.type] || null;
      case 'businessable_id':
        return value?.id ? Number(value.id) : null;
      case 'date_from':
      case 'date_to':
        return formatDateToBackend(value).replace('T', ' ');
      case 'employee_id':
      case 'performer_id':
        return Number(value?.id);
      case 'start':
        if (oldKey === 'startTime') {
          // Если изменено startTime, нужно обновить часы в startDate
          const startDate = new Date(drafts.startDate);
          const [hours, minutes] = value.split(':').map(Number);
          startDate.setHours(hours, minutes, 0, 0);
          return formatDateToBackend(startDate).replace('T', ' ');
        }
        return formatDateToBackend(value).replace('T', ' ');
      case 'end':
        if (oldKey === 'endTime') {
          // Если изменено endTime, нужно обновить часы в endDate
          const endDate = new Date(drafts.endDate);
          const [hours, minutes] = value.split(':').map(Number);
          endDate.setHours(hours, minutes, 0, 0);
          return formatDateToBackend(endDate).replace('T', ' ');
        }
        return formatDateToBackend(value).replace('T', ' ');
      case 'finished':
        return value ? 1 : 0;
      default:
        return value;
    }
  };

  const mapKeyToBackend = (key, draft) => {
    const keyMapping = {
      startDate: 'start',
      finished: 'finished',
      endDate: 'end',
      performer: 'performer_id',
      startDateMonth: 'start',
      endDateMonth: 'end',
      endTime: 'end',
      startTime: 'start',
      ...(draft[key] && {
        relatedEntity: ['businessable_type', 'businessable_id'],
      }),
      participants: 'participants_ids',
    };

    return keyMapping[key] || key;
  };

  return mapChangedFieldsForBackend(
    drafts,
    filteredChangedFieldsSet,
    mapKeyToBackend,
    castValue,
  );
};
