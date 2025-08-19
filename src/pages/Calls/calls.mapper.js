import { callStatusTypes, colorStatusTypes, durationEnum } from './calls.types';
import { convertUTCToLocal } from '../../utils/formate.date';
import {mapEmployeesFromApi} from "../Settings/settings.mapper";
import {mapClientFromApi, mapContactPersons, mapContactPersonSolo} from "../Clients/clients.mapper";

export const mapCallsResponse = (data) => {
  if (!data || !Array.isArray(data)) return [];

  return data.map((item) => ({
    id: item.id,
    phone: item.phone,
    createdAt: new Date(item.created_at),
    mangoId: item.mango_id,
    type: item.type,
    success: item.success ? callStatusTypes.COMPLETED : callStatusTypes.MISSED,
    duration: item.duration,
    phoneClient: item.phone_client,
    record: item?.record,
    contactName: item?.company?.name ?? null,
    manager:item?.manager ? mapEmployeesFromApi(item?.manager) : null,
    // contactPerson
    //   client:mapContactPersons(item?.client),
      client: item?.client ? mapContactPersonSolo(item?.client) : null,
    company: item?.company
      ? {
          id: item?.company?.id,
          name: item?.company?.name,
        }
      : null,
    deal: item?.deal
      ? {
          id: item?.deal?.id,
          name: item?.deal?.name,
        }
      : null,
    // status: item.status || 'completed',
    // statusDisplay: colorStatusTypes[item.status]?.status || 'Неизвестно',
    // direction: item.direction || 'incoming',
    // contact_name: item.contact_name || '',
    // company: item.company || '',
    // manager: item.manager || {},
    // recordingUrl: item.recording_url || null,
  }));
};

export const mapCallForSaving = (call) => {
  return {
    phone: call.phone,
    // status: call.status,
    // direction: call.direction,
    // contact_name: call.contact_name,
    // company: call.company,
  };
};
