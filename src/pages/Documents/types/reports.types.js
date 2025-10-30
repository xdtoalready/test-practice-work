export const reportStatusTypes = {
  draft: 'draft',
  processing: 'processing',
  completed: 'completed',
  sent: 'sent',
  created: 'created',
  viewed: 'viewed',
  agreed: 'agreed',
};

export const reportStatusTypesRu = {
  draft: 'Черновик',
  processing: 'В обработке',
  completed: 'Готов',
  sent: 'Отправлен',
  created: 'Создан',
  viewed: 'Просмотрено',
  agreed: 'Согласован',
};

export const colorReportStatusTypes = {
  draft: { status: reportStatusTypesRu.draft, class: 'status-grey' },
  processing: { status: reportStatusTypesRu.processing, class: 'status-blue' },
  completed: { status: reportStatusTypesRu.completed, class: 'status-green' },
  sent: { status: reportStatusTypesRu.sent, class: 'status-report-sent' },
  created: { status: reportStatusTypesRu.created, class: 'status-report-created' },
  viewed: { status: reportStatusTypesRu.viewed, class: 'status-report-sent' },
  agreed: { status: reportStatusTypesRu.agreed, class: 'status-report-agreed' },
};