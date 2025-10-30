import { mapEmployeesFromApi } from '../Settings/settings.mapper';
import {
  convertUTCToLocal,
  formatDateToBackend,
} from '../../utils/formate.date';
import { mapChangedFieldsForBackend } from '../../utils/store.utils';

export const mapTimeTrackingsFromApi = (apiResponse) => {
  if (!apiResponse) return {};

  return apiResponse.reduce((acc, entry, index) => {
    acc[entry.id] = {
      id: entry.id,
      order: index,
      date: convertUTCToLocal(entry.created_at),
      link: entry.link,
      link_title: entry.link_title,
      timeSpent: {
        minutes: entry.minutes - Math.floor(entry.minutes / 60) * 60,
        hours: Math.floor(entry.minutes / 60),
        allTimeInMinutes: entry.minutes,
      },
      taskId: entry.task_id,
      cost: entry.cost,
      employee: mapEmployeesFromApi(entry.employee),
    };
    return acc;
  }, {});
};

export const mapTimeTrackingDataToBackend = (
  drafts,
  changedFieldsSet,
  propId,
) => {
  const castValue = (key, value) => {
    switch (key) {
      default:
        return value; // По умолчанию оставить как есть
    }
  };

  const mapKeyToBackend = (key, draft) => {
    const keyMapping = {
      middleName: 'middle_name',
      lastName: 'last_name',
      position: 'position_id',
      companyName: 'company_name',
      checkingAccount: 'checking_account',
      correspondentAccount: 'correspondent_account',
      bankBic: 'bank_bic',
      bankName: 'bank_name',
      legalAddress: 'legal_address',
      realAddress: 'real_address',
      postAddress: 'post_address',
      certificateOfRegistration: 'certificate_of_registration',
      directorName: 'director_name',
      isMainLegalEntity: 'is_main_legal_entity',
      signScan: 'sign_scan',
      stampScan: 'stamp_scan',
      createdAt: 'created_at',
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
