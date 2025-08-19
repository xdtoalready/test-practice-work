export const tasksTypes = {
  frontend: 'frontend',
  backend: 'backend',
  seo: 'seo',
  design: 'design',
  internal: 'internal',
  analytics: 'analytics',
  brief: 'brief',
  calculation: 'calculation',
  target: 'target',
  context: 'context',
  copywriting: 'copywriting',
};

export const tasksTypesRu = {
  frontend: 'Frontend',
  backend: 'Backend',
  seo: 'SEO',
  design: 'Дизайн',
  internal: 'Задача LEadBRO',
  analytics: 'Аналитика',
  brief: 'Бриф',
  calculation: 'Оценка',
  target: 'Контекстная реклама',
  context: 'Таргетированная реклама',
  copywriting: 'Наполнение',
};

export const taskableTypes = {
  deal: 'App\\Models\\Deal',
  stage: 'App\\Models\\Stage',
  client: 'App\\Models\\Company',
};

export const colorTasksTypes = {
  design: { status: tasksTypesRu.design, class: 'status-green' },
  seo: { status: tasksTypesRu.seo, class: 'status-red' },
  frontend: { status: tasksTypesRu.frontend, class: 'status-purple' },
  backend: { status: tasksTypesRu.backend, class: 'status-blue' },
  internal: { status: tasksTypesRu.internal, class: 'status-yellow' },
  analytics: { status: tasksTypesRu.analytics, class: 'status-grey' },
  brief: { status: tasksTypesRu.brief, class: 'status-brown' },
  calculation: { status: tasksTypesRu.calculation, class: 'status-pink' },
  target: { status: tasksTypesRu.target, class: 'status-aqua' },
  context: { status: tasksTypesRu.context, class: 'status-light-green' },
  copywriting: { status: tasksTypesRu.copywriting, class: 'status-dark-green' },
};
