import { taskStatusTypes } from '../Stages/stages.types';
import { loadAvatar } from '../../utils/create.utils';
import { taskableTypes } from './tasks.types';
import { mapCommentsFromApi } from '../Clients/clients.mapper';
import { mapTimeTrackingsFromApi } from '../TimeTracking/timeTracking.mapper';
import { mapEmployeesFromApi } from '../Settings/settings.mapper';
import { formatDateWithOnlyDigits } from '../../utils/formate.date';

export const mapTaskFromApi = (task, commentsData = null) => {
  const taskableType = task?.related_entity?.type;
  const taskableId = task?.related_entity?.id;

  return {
    id: task.id,
    title: task?.name,
    taskStatus: mapTaskStatus(task?.status),
    related_entity: task?.related_entity,
    stage:
      taskableType === taskableTypes.stage
        ? {
          link: task?.related_entity?.link || '',
          id: taskableId,
          title: task?.related_entity?.name || 'Этап не задан',
        }
        : null,
    deal:
      taskableType === taskableTypes.deal
        ? {
          id: taskableId,
          title: task?.related_entity?.name || 'Сделка не задана',
        }
        : null,
    template: {
      id: task.template?.id || 0,
      title: task.template?.title || 'Название шаблона 1',
    },
    type: task?.type,
    taskLinked: task?.linked_task,
    description: task?.description ?? ' ',
    createdAt: task?.created_at ? `от ${task?.created_at}` : '',
    deadline: task?.deadline ? new Date(task?.deadline) : null,
    deadlineTime: formatDuration(task?.planned_time), // Например, '5 ч'
    actualTime: formatDuration(task?.actual_time), // Например, '2 дн'
    isNewForUser: task?.show_at_client_cabinet === 1,
    showInLk: task?.show_at_client_cabinet === 1,
    // creator:mapEmployeesFromApi(task?.creator),
    responsibles: mapAssigned([task?.responsible]),
    executors: mapAssigned([task?.performer]),
    auditors: mapAssigned(task?.auditors),
    assigned: mapAssigned([task?.responsible, task?.performer]),
    timeTrackings: mapTimeTrackingsFromApi(task?.time_trackings || []),
    cost: task?.cost || null,
    comments: commentsData
      ? mapCommentsFromApi(commentsData)
      : mapComments(task?.comments || []) ?? [], // Комментарии к задаче
  };
};

// const mapTimeTrackings = (timeTrackings) => {
//   return timeTrackings.map((tracking) => ({
//     id: tracking.id,
//     minutes: tracking.minutes,
//     employee: {
//       id: tracking.employee.id,
//       name: tracking.employee.name,
//       middleName: tracking.employee.middle_name,
//       lastName: tracking.employee.last_name,
//       avatar: tracking.employee.avatar ? loadAvatar(tracking.employee.avatar) : null,
//       position: tracking.employee.position?.name || null,
//     },
//     cost: tracking.cost || 0
//   }))};

// Маппинг статуса задачи
const mapTaskStatus = (status) => {
  switch (status) {
    case 'created':
      return taskStatusTypes.created;
    case 'in_progress':
      return taskStatusTypes.in_work;
    case 'finished':
      return taskStatusTypes.finished;
    default:
      return taskStatusTypes[status];
  }
};


const mapAssigned = (assigned) => {
  return assigned
    .filter(Boolean)
    .map((person) => ({
      id: person.id,
      image: person.avatar ? loadAvatar(person.avatar) : null,
      name: person.name,
      surname: person.last_name,
      role: person.position?.name,
    }));
};

// Маппинг комментариев
const mapComments = (comments) => {
  return comments.map((comment) => ({
    id: comment.id,
    date: new Date(comment.date || new Date()), // Преобразуем дату
    sender: {
      id: comment.sender?.id || null,
      image: comment.sender?.avatar ? loadAvatar(comment.sender.avatar) : null,
      name: `${comment.sender?.name || ''} ${comment.sender?.last_name || ''}`.trim(),
    },
    value: {
      text: comment.text || 'Комментарий отсутствует',
    },
  }));
};

export const getTaskableTypeFromUrl = () => {
  const path = window.location.pathname;
  if (path.includes('/deals')) {
    return taskableTypes.deal;
  }
  return taskableTypes.stage; // По умолчанию используем Stage
};

// Функция для форматирования времени
const formatDuration = (time) => {
  if (!time) return 'Не указано';
  // const days = Math.floor(time / 24);
  // const hours = Math.floor(time % 24);
  return `${time} ч`;
};
