export const statusTypes = {
  inProgress: 'inProgress',
  finished: 'finished',
};
export const statusTypesRu = {
  inProgress: 'В работе',
  finished: 'Завершено',
};

export const colorStatusTypes = {
  inProgress: { status: statusTypesRu.inProgress, class: 'status-green' },
  finished: { status: statusTypesRu.finished, class: 'status-red' },
};

export const statusTaskTypes = {
  inProgress: 'inProgress',
};
export const statusTaskTypesRu = {
  inProgress: 'На составлении',
};

export const colorStatusTaskTypes = {
  inProgress: {
    status: statusTaskTypesRu.inProgress,
    class: 'status-disabled',
  },
};

export const statusActTypes = {
  notAssignedScan: 'notAssignedScan',
  notAssignedOriginal: 'notAssignedOriginal',
};
export const statusActTypesRu = {
  notAssignedScan: 'Скан не подписан',
  notAssignedOriginal: 'Оригинал не подписан',
};

export const colorStatusActTypes = {
  notAssignedScan: {
    status: statusActTypesRu.notAssignedScan,
    class: 'status-disabled',
  },
  notAssignedOriginal: {
    status: statusActTypesRu.notAssignedOriginal,
    class: 'status-disabled',
  },
};

export const statusBillTypes = {
  payed: 'payed',
};
export const statusBillTypesRu = {
  payed: 'Оплачен',
};

export const serviceTypeEnum = {
  seo: 'seo',
  development: 'development',
  context: 'context',
  target: 'target',
  support: 'support',
  reputation: 'reputation',
  design: 'design',
  leadgen: 'leadgen',
  marketplace: 'marketplace',
  improvements: 'improvements',
  crm: 'crm',
};

export const serviceTypeEnumRu = {
  seo: 'SEO',
  development: 'Разработка сайта',
  context: 'Контекстная реклама',
  target: 'Таргетированая реклама',
  support: 'Тех.поддержка',
  reputation: 'Управление репутацией',
  design: 'Дизайн',
  leadgen: 'Лидогенерация',
  marketplace: 'Маркетплейсы',
  improvements: 'Разовые доработки',
  crm: 'Настройка CRM',
};
