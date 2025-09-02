export const reportStatusTypes = {
  draft: 'draft',
  processing: 'processing',
  completed: 'completed',
  sent: 'sent',
};

export const reportStatusTypesRu = {
  draft: 'Черновик',
  processing: 'В обработке',
  completed: 'Готов',
  sent: 'Отправлен',
};

export const colorReportStatusTypes = {
  draft: { status: reportStatusTypesRu.draft, class: 'status-grey' },
  processing: { status: reportStatusTypesRu.processing, class: 'status-blue' },
  completed: { status: reportStatusTypesRu.completed, class: 'status-green' },
  sent: { status: reportStatusTypesRu.sent, class: 'status-green' },
};