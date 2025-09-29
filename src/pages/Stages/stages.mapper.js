import { loadAvatar } from '../../utils/create.utils';
import { stageStatusTypes, taskStatusTypes } from './stages.types';
import { statusTypes } from '../Services/services.types';
import { mapChangedFieldsForBackend } from '../../utils/store.utils';
import { format } from 'date-fns';
import { taskableTypes } from '../Tasks/tasks.types';
import { formatDateToBackend } from '../../utils/formate.date';
import {mapTimeTrackingsFromApi} from "../TimeTracking/timeTracking.mapper";
import {mapTaskFromApi} from "../Tasks/tasks.mapper";
import { bussinesableType } from '../Calendar/calendar.types';

export const mapStageFromApi = (stageData, tasksData) => {
  return {
    id: stageData?.id,
    number: stageData?.number,
    title: stageData?.name,
    bills: stageData?.bills ?? null,
    startTime: stageData?.start ? new Date(stageData?.start) : null,
    deadline: stageData?.deadline ? new Date(stageData?.deadline) : null,
    stagePlannedTime:
      stageData?.planned_time !== null ? stageData?.planned_time : null,
    timeOverPlan:
      stageData?.time_over_planned !== null
        ? stageData?.time_over_planned
        : null,
    deadlineTime: stageData?.planned_time
      ? `${parseFloat(stageData?.planned_time?.toFixed(1))} ч`
      : null, // Время дедлайна по умолчанию
    actualTime: stageData?.actual_time
      ? `${parseFloat(stageData?.actual_time?.toFixed(1))} ч`
      : null, // Время дедлайна по умолчанию
    contactPerson: stageData?.contactPerson || 'Александр Шилов',
    extraCosts: stageData?.extraCosts || '7500',
    actSum: stageData?.actSum || stageData?.act_sum,
    budgetTimeValue: stageData?.budgetTimeValue || 20,
    budgetTimeType: stageData?.budgetTimeType || 'minutes',
    status:
      stageData?.active === 1
        ? stageStatusTypes.inProgress
        : stageStatusTypes.finished,
    taskDescription: stageData?.technical_specification || " ",
    sumByHand: true,
    service: {
      id: stageData?.service?.id,
      title: stageData?.service?.name,
    },
    client: {
      id: stageData?.company?.id,
      title: stageData?.company?.name,
    },
    tasks: mapTasksFromApi(tasksData),
  };
};

const mapTasksFromApi = (tasksData) => {
  return tasksData.reduce((acc, task, index) => {
    const mappedTask = mapTaskFromApi(task,task?.comments??null);
    acc[mappedTask.id] = {
      ...mappedTask,
      order: index
    };
    return acc;
  }, {});
};
// const mapTaskFromApi = (task) => {
//   const taskableType = task.related_entity?.type;
//   const taskableId = task.related_entity?.id;
//   return {
//     id: task.id,
//     title: task.name,
//     taskStatus: mapTaskStatus(task.status),
//     service: {
//       id: task.service?.id || 0,
//       title: task.service?.title || 'Название услуги 1',
//     },
//     stage:
//       taskableType === taskableTypes.stage
//         ? {
//             id: taskableId,
//             title: task.related_entity?.name || 'Этап не задан',
//           }
//         : null,
//     deal:
//       taskableType === taskableTypes.deal
//         ? {
//             id: taskableId,
//             title: task.related_entity?.name || 'Сделка не задана',
//           }
//         : null,
//     template: {
//       id: task.template?.id || 0,
//       title: task.template?.title || 'Название шаблона 1',
//     },
//     description: task?.description || ' ',
//     report: task?.report || ' ',
//     showInLK: task.show_at_client_cabinet === 1,
//     showInReport: task.show_at_report === 1,
//     comments: task.comments ? mapComments(task.comments) : {},
//     taskLinked: task?.linked_task,
//     type: task?.type,
//     auditors: task.auditors ? task.auditors.map(mapManager) : [],
//     executors: task.performer ? [task.performer].map(mapManager) : [],
//     timeTrackings: mapTimeTrackingsFromApi(task?.time_trackings || []),
//     responsibles: task.responsible ? mapManager(task.responsible) : [],
//     deadline: task.deadline ? new Date(task.deadline) : null,
//     deadlineTime: task.planned_time ? `${task.planned_time} ч` : 'Не указано',
//     actualTime: task.actual_time ? `${task.actual_time} ч` : 'Не указано',
//     isNewForUser: task.isNewForUser || false,
//   };
// };

const mapParticipant = (participant) => {
  return {
    id: participant.id,
    fio: participant.fio || 'Неизвестный',
    role: participant.role || 'Неизвестная роль',
    image: participant.avatar ? loadAvatar(participant.avatar) : null,
  };
};

const mapComments = (comments) => {
  return Object.keys(comments).reduce((acc, key) => {
    const comment = comments[key];
    acc[key] = {
      id: comment.id,
      date: comment.date ? new Date(comment.date) : null,
      sender: mapParticipant(comment.sender),
      value: comment.value || { text: 'Текст комментария отсутствует' },
    };
    return acc;
  }, {});
};

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

const mapTaskStatus = (status) => {
  switch (status) {
    case 'created':
      return taskStatusTypes.created;
    case 'finished':
      return taskStatusTypes.finished;
    default:
      return taskStatusTypes[status];
  }
};

export const mapStageDataToBackend = (drafts, changedFieldsSet, propId) => {
  const castValue = (key, value) => {
    debugger
    switch (key) {
      case 'active':
        return stageStatusTypes.inProgress === value;
      case 'start':
        return formatDateToBackend(value);
      case 'deadline':
        return formatDateToBackend(value);
      case 'actual_time':
      case 'planned_time':
      case 'time_over_planned':
        return parseFloat(value);
      case 'show_at_client_cabinet':
        return Boolean(value); // Преобразуем в булевое значение
      case 'show_at_report':
        return Boolean(value);
      case 'responsible_id':
        return value.id;
      case 'performer_id':
        return value.map((el) => el.id)[0];
      case 'auditors_ids':
          return  value.map((el) => el.id); // Преобразуем идентификаторы в строки
      case 'taskable_type':
        return drafts.taskable_type || taskableTypes[value?.type] || null;
      case 'taskable_id':
        if (drafts.deal){
          return drafts.related_entity?.id ?? null
        }else if (drafts.stage){
          return drafts.related_entity?.id ?? null
        }else
          return value?.id ? Number(value.id) : null;
      default:
        return value; // По умолчанию оставить как есть
    }
  };

  const mapKeyToBackend = (key, draft) => {
    debugger
    const keyMapping = {
      status: 'active',
      title: 'name',
      startTime: 'start',
      actSum: 'act_sum',
      taskDescription: 'technical_specification',
      actualTime: 'actual_time',
      type: 'type',
      deadline: 'deadline',
      responsibles: 'responsible_id',
      auditors: 'auditors_ids',
      deadlineTime: 'planned_time',
      executors: 'performer_id',
      taskLinked: 'linked_task',
      showInLk: 'show_at_client_cabinet',
      showInReport: 'show_at_report',
      description: 'description',
      report: 'report',
      stagePlannedTime: 'planned_time',
      timeOverPlan: 'time_over_planned',
      taskStatus: 'status',
      ...(draft.hasOwnProperty(key) && {
        related_entity: ['taskable_type', 'taskable_id'],
      }),
      [`tasks.${propId}.title`]: 'name',
      [`tasks.${propId}.type`]: 'type',
      [`tasks.${propId}.deadline`]: 'deadline',
      [`tasks.${propId}.responsibles`]: 'responsible_id',
      [`tasks.${propId}.auditors`]: 'auditors_ids',
      [`tasks.${propId}.deadlineTime`]: 'planned_time', // Привязка времени к 'deadline'
      [`tasks.${propId}.executors`]: 'performer_id',
      [`tasks.${propId}.showInLk`]: 'show_at_client_cabinet',
      [`tasks.${propId}.showInReport`]: 'show_at_report',
      [`tasks.${propId}.description`]: 'description',
      [`tasks.${propId}.report`]: 'report',
      [`tasks.${propId}.taskLinked`]: 'linked_task',
      [`tasks.${propId}.taskStatus`]: 'status',
        [`tasks.${propId}.related_entity`]: ['taskable_type', 'taskable_id'],
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
