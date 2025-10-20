import { statusTypes } from './clients.types'; // Предположим, что у вас есть statusTypes
import { loadAvatar } from '../../utils/create.utils';
import {
  getValueByPath,
  mapChangedFieldsForBackend,
  mapFio,
  MapFio,
} from '../../utils/store.utils';
import { handleError } from '../../utils/snackbar';
import { mapDealFromApi } from '../Deals/deals.mapper';
import { convertUTCToLocal } from '../../utils/formate.date';
import { mapEmployeesFromApi } from '../Settings/settings.mapper';
import {
  mapBusinessFromApi,
  mapBusinessToBackend,
} from '../Calendar/calendar.mapper';
import { format } from 'date-fns';
import { mapCallsResponse } from '../Calls/calls.mapper';
import {LK_URL} from "../../shared/constants";

export const mapClientFromApi = (
  apiClient,
  apiPasswords = [],
  apiContactPersons = [],
  apiComments = [],
  apiServices = null,
  apiDeals = [],
  apiBusiness = [],
  apiCalls = [],
) => {
  return {
    account: apiClient?.account,
    id: apiClient?.id,
    description: apiClient?.description ?? ' ',
    title: apiClient?.name,
    status: mapStatus(apiClient?.status),
    manager: {
      id: apiClient?.manager.id,
      name: apiClient?.manager?.name,
      surname: apiClient?.manager?.last_name,
      middleName: apiClient?.manager?.middle_name,
      avatar: apiClient?.manager?.avatar
        ? loadAvatar(apiClient?.manager?.avatar)
        : null,
      position: apiClient?.manager?.position?.name,
      email: apiClient?.manager?.email,
      phone: apiClient?.manager?.phone,
    },
    services: mapServices(apiClient?.services, apiServices),
    deals: apiDeals.map((el) => mapDealFromApi(el)),
    comments: mapCommentsFromApi(apiComments),
    businesses: mapBusinesses(apiBusiness),
    calls: mapCallsResponse(apiCalls),
    contactPersons: mapContactPersons(apiContactPersons),
    contactData: {
      address: {
        0: apiClient?.address,
      },
      tel: {
        0: apiClient?.phone,
      },
      // comment: {
      //   0: apiClient?.comment,
      // },
      email: {
        0: apiClient?.email,
      },
      site: {
        0: apiClient?.site,
      },
      requisites: { 0: mapLegals(apiClient?.legals) },
    },
    sites:mapSites(apiClient?.sites),
    passwords: mapPasswords(apiPasswords, apiClient),
    ymetricsToken: apiClient?.ymetrics_token,
    topvisorToken: apiClient?.topvisor_token,
  };
};

export const mapSites = (sites) => {
  if (!sites) return {};
  return sites.reduce((acc, site) => {
    acc[site.id] = {
      id: site.id,
      url: site.url,
      topvisor_token: site?.topvisor_token,
      ymetrics_token: site?.ymetrics_token
    };
    return acc;
  }, {});
};

export const mapPasswords = (apiPasswords, apiClient) => {
  const passwords = apiPasswords?.reduce((acc, password, index) => {
    acc[password.id] = {
      id: password.id,
      name: password.service_name,
      values: {
        login: password.login,
        password: password.password,
      },
    };
    return acc;
  }, {});

  if (apiClient?.account?.password) {
    const encodedEmail = (apiClient.email);
    const encodedPassword = (apiClient.account.password);
    passwords['lk_account'] = {
      id: 'lk_account',
      name:  <a href={`${LK_URL}/?e=${encodedEmail}&p=${encodedPassword}`} target={'_blank'} rel="noopener" className={'passwords link'}>
        <span>Личный кабинет</span>
      </a>,
      values: {
        login: apiClient.email,
        password: apiClient.account.password,
      },
      isLkAccount: true, // Флаг, что это пароль от ЛК
      readonly: true, // Пароль от ЛК нельзя редактировать
    };
  }
  return passwords;
};

export const mapBusinesses = (apiBusinesses) => {
  return apiBusinesses?.reduce((acc, business) => {
    const startDate = new Date(business?.start);
    const endDate = new Date(business?.end);
    acc[business.id] = {
      id: business.id,
      name: business?.name,
      description: business.description,
      relatedEntity: {
        id: business.related_entity.id,
        name: business.related_entity?.name,
        type: business.related_entity.type,
        link: business.related_entity.link,
      },
      actualTime: business.actual_time,
      type: business.type,
      finished: business.finished,
      startDate: startDate,
      endDate: endDate,
      startTime: format(startDate, 'HH:mm'),
      endTime: format(endDate, 'HH:mm'),
      creator: mapEmployeesFromApi(business.creator),
      performer: mapEmployeesFromApi(business.performer),
      participants: business?.participants.map(mapEmployeesFromApi),
      createdAt: new Date(business.created_at),
      updatedAt: new Date(business.updated_at),
      cost: business.cost,
    };
    return acc;
  }, {});
};

export const mapContactPersonSolo = (client) => {
  return {
    id: client.id,
    role: client.role,
    last_name: client?.last_name ?? '',
    name: client?.name ?? '',
    middle_name: client?.middle_name ?? '',
    fio: `${client?.last_name ?? ''} ${client?.name ?? ''} ${client?.middle_name ? client.middle_name : ''}`,
    tel: client.phone ? client.phone : null,
    comment: client.phone_comment ? client.phone_comment : null,
    site: client.site ? client.site : null,
    email: client.email ? client.email : null,
    messengers: {
      telegram: {
        link: `https://t.me/${client?.telegram}`,
        value: client?.telegram,
      },
      whatsapp: {
        link: `https://wa.me/${client?.whatsapp}`.replace('+', ''),
        value: client?.whatsapp,
      },
      //
      //     ? {telegram: `https://t.me/${client.telegram}`}
      //     : null,
      // client.whatsapp && client.phone
      //     ? {whatsapp: `https://api.whatsapp.com/send?phone=${client.phone}`}
      //     : null,
    },
  };
};

export const mapContactPersons = (apiContactPersons) => {
  return apiContactPersons?.reduce((acc, client) => {
    acc[client.id] = mapContactPersonSolo(client);

    return acc;
  }, {});
};

const mapLegals = (legals) => {
  return {
    INN: legals.inn,
    KPP: legals.kpp,
    OGRN: legals.ogrn,
    RS: legals.checking_account,
    CORR_RS: legals.correspondent_account,
    LEGAL_ADDRESS: legals.legal_address,
    REAL_ADDRESS: legals.real_address,
    BIK: legals.bank_bic,
    BankName: legals.bank_name,
    LEGAL_NAME: legals.legal_name,
  };
};

const mapServices = (backendServices, apiServices) => {
  if (apiServices === null) {
    const { last } = backendServices;
    return {
      total: backendServices.total,
      value: last
        ? {
            id: last.id,
            description: last?.name, // Используем поле name для description

            manager: {
              name: last?.manager?.name,
              surname: last?.manager?.last_name,
              role: last?.manager?.position?.name,
              image: loadAvatar(last?.manager?.avatar),
            },
            deadline: last?.deadline ? new Date(last.deadline) : null,
          }
        : null,
    };
  }
  if (!apiServices?.length) {
    return null;
  }
  return apiServices.map((service) => ({
    id: service.id,
    description: service.name,

    manager: {
      name: service?.manager?.name,
      surname: service?.manager?.last_name,
      role: service?.manager?.position?.name,
      image: loadAvatar(service?.manager?.avatar),
    },
    deadline: service?.deadline ? new Date(service.deadline) : null,
  }));
};

// Маппинг статуса компании из API
const mapStatus = (status) => {
  switch (status) {
    case 'not_working':
      return statusTypes.notInProgress;
    case 'working':
      return statusTypes.inProgress;
    case 'partner':
      return statusTypes.partner;
    case 'competitor':
      return statusTypes.competitor;
    default:
      return statusTypes.unknown;
  }
};
export const mapCommentsFromApi = (apiComments) => {
  return apiComments?.reduce((acc, comment) => {
    if (comment?.type === 'Call') {
      acc[comment.data.id] = {
        type: comment?.type,
        id: comment.data.id,
        date: convertUTCToLocal(comment.created_at),
        manager: {
          ...(comment?.data?.manager || comment?.initiator
            ? mapEmployeesFromApi(comment?.data?.manager ?? comment?.initiator)
            : {}),
          image:
            comment.data?.manager?.avatar || comment?.initiator?.avatar
              ? loadAvatar(
                  comment.data?.manager?.avatar ?? comment?.initiator.avatar,
                )
              : loadAvatar(),
        },
        isVisibleInLK: comment.data.show_at_client_cabinet,
        record: comment.data.record,
        callType: comment.data.type,
      };
    } else {
      acc[comment.data.id] = {
        type: comment?.type,
        id: comment.data.id,
        date: convertUTCToLocal(comment.created_at),
        sender: {
          id: comment.data?.commentator?.id ?? comment?.initiator?.id,
          image:
            comment.data?.commentator?.avatar ?? comment?.initiator?.avatar
              ? loadAvatar(
                  comment.data?.commentator?.avatar ??
                    comment?.initiator?.avatar,
                )
              : loadAvatar(),
          name: `${comment.data?.commentator?.name ?? comment?.initiator?.name}`,
          lastName: `${comment.data?.commentator?.last_name ?? comment?.initiator?.last_name ?? ''}`,
        },
        isVisibleInLK: comment.data.show_at_client_cabinet,
        value: {
          text: comment.data.text,
          files: comment?.data?.files?.map((file) => ({
            id: file?.id,
            name: file?.original_name,
            extension: `.${file?.original_name.split('.').pop()}`,
            url: file?.url,
          })),
        },
      };
    }

    return acc;
  }, {});
};

export const mapCommentDataToBackend = (drafts, changedFieldsSet) => {
  const formData = new FormData();

  const mapCommentKeyToBackend = (key) => {
    const commentKeyMapping = {
      text: 'text',
      files: 'files',
    };

    return commentKeyMapping[key] || key;
  };

  // Map changed fields for text
  const changedData = mapChangedFieldsForBackend(
    drafts,
    changedFieldsSet,
    mapCommentKeyToBackend,
    (key, value) => value, // No special casting needed for comments
  );

  // Add text to FormData
  if (changedData.text) {
    formData.append('text', changedData.text);
  }

  // Add files to FormData if present
  if (changedData.files) {
    changedData.files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
  }

  return formData;
};

export const mapClientDataToBackend = (drafts, changedFieldsSet, propId) => {
  // Обработка ФИО

  const fioParams = mapFio(drafts, changedFieldsSet, propId);
  const getCorrectStatus = (status) => {
    const snakeStatuses = {
      working: 'inProgress',
      not_working: 'notInProgress',
      partner: 'partner',
      competitor: 'competitor',
    };
    if (Object.values(statusTypes).includes(status)) {
      return (
        Object.entries(snakeStatuses).find(
          ([snake, camel]) => camel === status,
        )?.[0] || 'unknown'
      );
    }

    return snakeStatuses[status] || statusTypes.unknown;
  };
  const castValue = (key, value) => {
    switch (key) {
      case 'manager_id':
        return Number(value.id);
      case 'status':
        return getCorrectStatus(value);
      default:
        return value; // По умолчанию оставить как есть
    }
  };

  const mapBusinessesToBackend = (business, changedFieldsSet) => {
    if (!business) return [];
    const businessId = business.id;

    // Фильтруем и модифицируем `changedFieldsSet`, оставляя только относящиеся к этому бизнесу поля
    const filteredChangedFields = new Set(
      [...changedFieldsSet]
        .filter((field) => field.startsWith(`businesses.${businessId}.`)) // Оставляем только относящиеся к текущему бизнесу
        .map((field) => field.replace(`businesses.${businessId}.`, '')), // Убираем префикс
    );

    // Если нет изменённых полей, возвращаем пустой объект
    if (filteredChangedFields.size === 0) return {};

    // Маппим бизнес с учетом отфильтрованных полей
    return mapBusinessToBackend(business, filteredChangedFields);
  };

  const mapKeyToBackend = (key, draft) => {
    const keyMapping = {
      [`passwords.${propId}.name`]: 'service_name',
      [`passwords.${propId}.values.login`]: 'login',
      [`passwords.${propId}.values.password`]: 'password',
      [`contactPersons.${propId}.role`]: 'role',
      [`contactPersons.${propId}.email`]: 'email',
      [`contactPersons.${propId}.tel`]: 'phone',
      [`contactPersons.${propId}.comment`]: 'phone_comment',
      [`contactPersons.${propId}.name`]: 'name',
      [`contactPersons.${propId}.last_name`]: 'last_name',
      [`contactPersons.${propId}.middle_name`]: 'middle_name',
      [`contactPersons.${propId}.site`]: 'site',
      [`contactPersons.${propId}.messengers.telegram.value`]: 'telegram',
      [`contactPersons.${propId}.messengers.whatsapp.value`]: 'whatsapp',
      [`contactPersons.${propId}.messengers.viber.value`]: 'viber',
      [`contactPersons.${propId}.messengers.viber.value`]: 'viber',
      [`sites.${propId}.url`]: 'url',
      [`sites.${propId}.topvisor_token`]: 'topvisor_token',
      [`sites.${propId}.ymetrics_token`]: 'ymetrics_token',
      // [`contactPersons.${propId}.email`]: 'email',
      // 'contactData.requisites.0.BankName': 'bank_name',
      'contactData.requisites.0.INN': 'inn',
      // 'contactData.requisites.0.KPP': 'kpp',
      // 'contactData.requisites.0.OGRN': 'ogrn',
      'contactData.requisites.0.RS': 'checking_account',
      // 'contactData.requisites.0.CORR_RS': 'correspondent_account',
      'contactData.requisites.0.BIK': 'bank_bic',
      // 'contactData.requisites.0.LEGAL_ADDRESS': 'legal_address',
      'contactData.requisites.0.REAL_ADDRESS': 'real_address',

      'contactData.tel.0': 'phone',
      'contactData.address.0': 'address',
      'contactData.description.0': 'description',
      'contactData.site.0': 'site',
      'contactData.email.0': 'email',
      manager: 'manager_id',
      title: 'name',
      inn: 'inn',
      kpp: 'kpp',
      ogrn: 'ogrn',
      ymetricsToken: 'ymetrics_token',
      topvisorToken: 'topvisor_token',
      // Добавляем другие ключи по мере необходимости
    };

    return keyMapping[key] || key;
  };

  return {
    ...mapChangedFieldsForBackend(
      drafts,
      changedFieldsSet,
      mapKeyToBackend,
      castValue,
    ),
    ...fioParams,
    ...mapBusinessesToBackend(drafts?.businesses, changedFieldsSet),
  };
};
