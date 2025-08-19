export const callStatusTypes = {
  COMPLETED: 'completed',
  MISSED: 'missed',
  IN_PROGRESS: 'in_progress',
};

export const callDirectionTypes = {
  INCOMING: 'incoming',
  OUTGOING: 'outgoing',
  MISSED: 'missed',
};

export const callDirectionTypesRu = {
  incoming: 'Входящий',
  outgoing: 'Исходящий',
  missed: 'Пропущенный',
};

export const colorStatusTypes = {
  [callStatusTypes.COMPLETED]: {
    class: 'status-green',
    status: 'Завершен',
  },
  [callStatusTypes.MISSED]: {
    class: 'status-red',
    status: 'Пропущен',
  },
  [callStatusTypes.IN_PROGRESS]: {
    class: 'status-yellow',
    status: 'В процессе',
  },
};

export const colorDirectionTypes = {
  [callDirectionTypes.INCOMING]: {
    class: 'status-green',
    status: 'Входящий',
  },
  [callDirectionTypes.OUTGOING]: {
    class: 'status-yellow',
    status: 'Исходящий',
  },
  [callDirectionTypes.MISSED]: {
    class: 'status-red',
    status: 'Пропущен',
  },
};

export const periodEnum = {
  day: 'day',
  week: 'week',
  month: 'month',
  quarter: 'quarter',
  year: 'year',
};

export const periodEnumRu = {
  day: 'День',
  week: 'Неделя',
  month: 'Месяц',
  quarter: 'Квартал',
  year: 'Год',
};

export const durationEnum = {
  1: 'До 1 минуты',
  2: 'От 1 минуты',
  3: 'От 3 минут',
  4: 'От 5 минут',
};
