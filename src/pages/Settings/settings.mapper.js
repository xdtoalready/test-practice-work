import { loadAvatar } from '../../utils/create.utils';
import { statusTypes } from '../Services/services.types';
import { mapChangedFieldsForBackend } from '../../utils/store.utils';
import { employersTypeEnum } from './settings.types';
import { formatDateToBackend } from '../../utils/formate.date';

export const mapEmployeesFromApi = (employee) => {
  if (!employee) return null
  return {
    id: employee.id,
    // employee:mapEmployee(employee),
    name: employee.name,
    surname: employee.surname ?? employee.last_name,
    middleName: employee?.middle_name,
    lastName: employee?.last_name,
    avatar: employee?.avatar ? loadAvatar(employee?.avatar) : loadAvatar(), // Обработка аватара через loadAvatar
    birthday: employee?.birthday ? new Date(employee?.birthday) : null, // Преобразование дня рождения в Date
    position: employee?.position ? mapPosition(employee?.position) : null, // Маппинг позиции
    email: employee?.email,
    phone: employee?.phone || null,
    role: employee?.position?.name,
    gender: employee?.gender,
    status: employersTypeEnum.works,
    permissions: employee?.permissions || [],
    hourlyRate: employee?.hourly_rate ?? null,
  };
};

const mapPosition = (position) => {
  return {
    id: position.id,
    title: position.name,
  };
};

export const mapLegalEntitiesFromApi = (legalEntity) => {
  return {
    id: legalEntity.id,
    companyName: legalEntity?.company_name,
    email: legalEntity?.email,
    inn: legalEntity?.inn,
    kpp: legalEntity?.kpp,
    ogrn: legalEntity?.ogrn,
    createdAt: legalEntity?.created_at || new Date(),
    checkingAccount: legalEntity?.checking_account,
    correspondentAccount: legalEntity?.correspondent_account,
    bankBic: legalEntity?.bank_bic,
    bankName: legalEntity?.bank_name,
    legalAddress: legalEntity?.legal_address,
    realAddress: legalEntity?.real_address,
    postAddress: legalEntity?.post_address,
    certificateOfRegistration: legalEntity?.certificate_of_registration,
    directorName: legalEntity?.director_name,
    isMainLegalEntity: Boolean(legalEntity?.is_main_legal_entity), // Преобразование флага в boolean
    signScan: legalEntity?.sign_scan
      ? createBlob(legalEntity?.sign_scan)
      : null, // Создание блоба для скана подписи
    stampScan: legalEntity?.stamp_scan
      ? createBlob(legalEntity?.stamp_scan)
      : null, // Создание блоба для печати
  };
};

// Пример функции createBlob для обработки изображений
const createBlob = (fileUrl) => {
  return `${process.env.REACT_APP_API_URL}${fileUrl}`; // Пример того, как может быть обработан путь к файлу
};

export const mapSettingsDataToBackend = (drafts, changedFieldsSet, propId) => {
  const castValue = (key, value) => {
    switch (key) {
      case 'position_id':
        return value.id;
      case 'birthday':
        return formatDateToBackend(value);
      case 'is_main_legal_entity':
        return value ? 1 : 0;
      case 'signScan':
      case 'stampScan':
        return value?.file || value; // Предполагаем, что может прийти объект с file или сразу файл
      case 'createdAt':
        return formatDateToBackend(value);

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
      hourlyRate: 'hourly_rate',
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
