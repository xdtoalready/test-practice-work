import { mapChangedFieldsForBackend } from '../../utils/store.utils';
import { serviceStatuses } from './components/ServicePage/components/Statuses';
import { loadAvatar } from '../../utils/create.utils';
import { statusActTypes, statusTypes } from './services.types';
import { formatDateToBackend } from '../../utils/formate.date';
import { mapPasswords } from '../Clients/clients.mapper';
import { actStatusTypes } from '../Acts/acts.types';

// Маппинг данных сервиса с бэкенда
export const mapServiceFromApi = (
  apiService,
  stagesData,
  apiPasswords = null,
) => {
  return {
    id: apiService?.id,
    title: apiService?.name, // Название услуги
    deadline: apiService?.deadline ? new Date(apiService?.deadline) : null,
    contractNumber: apiService?.contract_number, // Номер договора
    client: apiService?.company
      ? {
          id: apiService?.company.id,
          title: apiService?.company.name,
        }
      : null,
    type: apiService?.type,
    creator: mapManager(apiService?.creator),
    manager: mapManager(apiService?.manager),
    command: mapParticipants(apiService?.participants),
    status: mapServiceStatus(apiService?.active), // Статус (активна ли услуга)
    stages: mapStages(stagesData || apiService?.stages), // Этапы
    tasks: mapTasks(stagesData?.tasks || apiService?.tasks), // Задачи
    passwords: apiPasswords ? mapPasswords(apiPasswords) : {},
    site: apiService.site ?? null
  };
};

// Маппинг менеджера (ответственного)
const mapManager = (manager) => {
  if (!manager) return null;
  return {
    id: manager.id,
    name: manager.name,
    surname: manager.last_name,
    middleName: manager.middle_name,
    avatar: manager.avatar ? loadAvatar(manager.avatar) : null,
    role: manager.position?.name,
    email: manager.email,
    phone: manager.phone || null,
  };
};

// Маппинг команды участников
export const mapParticipants = (participants) => {
  return participants.map((participant) => ({
    id: participant.id,
    name: participant.name,
    surname: participant.last_name,
    middleName: participant.middle_name,
    avatar: participant.avatar ? loadAvatar(participant.avatar) : null,
    role: participant.position?.name,
    email: participant.email,
    phone: participant.phone || null,
  }));
};

// Маппинг этапов
// Маппинг этапов
const mapStages = (stages) => {
  // Если это массив этапов (пришел из /api/services/{service_id}/stages)
  if (Array.isArray(stages)) {
    return stages.map((stage) => ({
      id: stage.id,
      title: stage.name,
      number: '1234',
      time: {
        planned: {
          planned: stage.planned_time ?? '-',
          type: stage.planned_time ? 'часов' : '',
        },
        extra: {
          actual: stage.actual_time,
          type: stage.actual_time ? 'часов' : '',
          // cost: 7500,
        },
      },
      act: {
        stampedAct: stage?.stamped_act,
        unstampedAct: stage?.unstamped_act,
        // scanStatus: statusActTypes.notAssignedScan,
        // originalStatus: statusActTypes.notAssignedOriginal,
        // withSign: {
        //   id: 0,
        //   file: 'Act with sign',
        //   extension: '.pdf',
        // },
        // withoutSign: {
        //   id: 1,
        //   file: 'Act without sign',
        //   extension: '.pdf',
        // },
      },
      taskCount: stage?.task_count,
      bills: stage?.bills ? mapBill(stage?.bills ?? []) : null,
      acts: stage?.acts ? mapAct(stage?.acts ?? []) : null,
      payedDate: new Date(2024, 12, 12),
      startDate: new Date(stage.start),
      endDate: stage.deadline ? new Date(stage.deadline) : null,
      description: stage?.technical_specification ?? ' ',
      cost: stage.act_sum, // Стоимость этапа
      active: stage.active === 1 ? serviceStatuses.tasks.inProgress : '',
      report: stage.report ? {
        id: stage.report.id,
        path: stage.report.path
      } : null,
    }));
  }
  // Если это объект этапов (пришел из getServices)
  if (!stages || !stages.last) return null;

  return {
    total: stages.total,
    last: {
      id: stages.last.id,
      title: stages.last.name,
      startDate: new Date(stages.last.start),
      endDate: new Date(stages.last.deadline),
      description: stages?.last?.technical_specification ?? ' ',
      cost: stages.last.actSum, // Стоимость услуги на данном этапе
      active: stages.last.active === 1, // Признак активности
    },
  };
};

const mapAct = (acts) => {
  return acts.map((act) => ({
    id: act?.id,
    number: act?.number,
    sum: act?.sum,
    // creationDate: new Date(act?.creation_date ?? act?.date),
    // paymentDate: new Date(act?.payment_date),
    // paymentReason: act?.payment_reason,
    // stage: act?.stage,
    // company: act?.company ?? null,
    //
    // service: act?.service ?? null,
    //
    // legalEntity: act?.legal_entity
    //   ? {
    //     id: act?.legal_entity.id,
    //     name: act?.legal_entity.name,
    //   }
    //   : null,
    items: act?.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      measurementUnit: item.measurement_unit,
    })),
    // sum: act?.sum,
    status: act?.signed ? actStatusTypes.stamped : actStatusTypes.unstamped,
    // stampedBill: act?.stamped_bill,
    // unstampedBill: act?.unstamped_bill,
    stampedAct: act?.stamped_act,
    unstampedAct: act?.unstamped_act,
  }));
};

const mapBill = (bills) => {
  return bills.map((bill) => ({
    id: bill?.id,
    number: bill?.number,
    creationDate: new Date(bill?.creation_date),
    paymentDate: new Date(bill?.payment_date),
    paymentReason: bill?.payment_reason,
    stage: bill?.stage,
    company: bill?.company ?? null,

    service: bill?.service ?? null,

    legalEntity: bill?.legal_entity
      ? {
          id: bill?.legal_entity.id,
          name: bill?.legal_entity.name,
        }
      : null,
    items: bill?.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      measurementUnit: item.measurement_unit,
    })),
    sum: bill?.sum,
    status: bill?.status,
    stampedBill: bill?.stamped_bill,
    unstampedBill: bill?.unstamped_bill,
    stampedAct: bill?.stamped_act,
    unstampedAct: bill?.unstamped_act,
  }));
};

// Маппинг задач
const mapTasks = (tasks) => {
  if (!tasks || !tasks.last) return null;

  return {
    total: tasks.total,
    last: {
      id: tasks.last.id,
      name: tasks.last.name,
      description: tasks?.last?.description ?? ' ',
      type: tasks.last.type,
      status: tasks.last.status,
      startDate: new Date(tasks.last.startDate || tasks.last.deadline),
      endDate: new Date(tasks.last.deadline),
      plannedTime: tasks.last.planned_time || null,
      actualTime: tasks.last.actual_time || null,
      responsible: mapManager(tasks.last.responsible),
      performer: mapManager(tasks.last.performer),
      auditors: mapParticipants(tasks.last.auditors),
      showAtClientCabinet: tasks.last.show_at_client_cabinet === 1,
    },
  };
};

// Маппинг статуса услуги
const mapServiceStatus = (active) => {
  return active ? statusTypes.inProgress : statusTypes.finished;
};

// Маппинг типа услуги
const mapServiceType = (type) => {
  const types = {
    seo: 'SEO продвижение',
    development: 'Разработка',
    consulting: 'Консалтинг',
  };
  return types[type] || 'Неизвестный тип';
};

// Маппинг данных для отправки на бэкенд
export const mapServiceDataToBackend = (drafts, changedFieldsSet, propId) => {
  const castValue = (key, value) => {
    switch (key) {
      case 'responsible_id':
        return value?.id ? Number(value.id) : null;
      case 'manager_id':
        return value?.id ? Number(value.id) : null;
      case 'creator_id':
        return value?.id ? Number(value.id) : null;
      case 'site_id':
        return value?.id ? Number(value.id) : null;
      case 'participants_ids':
        return value?.map((el) => el?.id ?? null) ?? [];
      case 'active':
        return statusTypes.inProgress === value;
      case 'deadline':
        return formatDateToBackend(value);
      case 'company_id':
        return value?.id ? Number(value.id) : null;

      default:
        return value; // По умолчанию оставить как есть
    }
  };

  const mapKeyToBackend = (key, draft) => {
    const keyMapping = {
      manager: 'manager_id',
      client: 'company_id',
      // 'client': 'company_id',
      deadline: 'deadline',
      status: 'active',
      command: 'participants_ids',
      title: 'name',
      contractNumber: 'contract_number',
      'type.title': 'type',
      creator: 'creator_id',
      site: 'site_id',
      // Добавляем дополнительные ключи по мере необходимости
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
