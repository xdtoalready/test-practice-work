export const taskStatusTypes = {
  created: 'created',
  in_work: 'in_work',
  waiting_for_approval: 'waiting_for_approval',
  time_evaluation: 'time_evaluation',

  finished: 'finished',
  paused: 'paused',
  // waiting: 'waiting',
};
export const taskStatusTypesRu = {
  time_evaluation: 'На согласовании',
  in_work: 'В работе',
  finished: 'Завершено',
  // waiting: 'Ожидает',
  created: 'Создана',
  waiting_for_approval: 'На проверке',
  paused: 'Отложено',
};

export const stageStatusTypes = {
  inProgress: 'inProgress',
  finished: 'finished',
};
export const stageStatusTypesRu = {
  inProgress: 'В работе',
  finished: 'Завершен',
};

export const colorStatusTaskTypes = {

  created: { status: taskStatusTypesRu.created, class: 'status-blue' },
  time_evaluation: {
    status: taskStatusTypesRu.time_evaluation,
    class: 'status-aqua',
  },
  in_work: { status: taskStatusTypesRu.in_work, class: 'status-green' },
  waiting_for_approval: {
    status: taskStatusTypesRu.waiting_for_approval,
    class: 'status-yellow',
  },
  finished: { status: taskStatusTypesRu.finished, class: 'status-red' },
  paused: { status: taskStatusTypesRu.paused, class: 'status-disabled' },
  // waiting: { status: taskStatusTypesRu.waiting, class: 'status-disabled' },
};

export const colorStatusTaskTypesForTaskList = {
  in_work: {
    status: taskStatusTypesRu.in_work,
    class: 'status-task-green',
  },
  time_evaluation: {
    status: taskStatusTypesRu.time_evaluation,
    class: 'status-task-aqua',
  },

  // waiting: { status: taskStatusTypesRu.waiting, class: 'status-task-brown' },
  finished: { status: taskStatusTypesRu.finished, class: 'status-task-red' },
  created: { status: taskStatusTypesRu.created, class: 'status-task-blue' },
  waiting_for_approval: {
    status: taskStatusTypesRu.waiting_for_approval,
    class: 'status-task-yellow',
  },
  paused: { status: taskStatusTypesRu.paused, class: 'status-task-disabled' },
};
