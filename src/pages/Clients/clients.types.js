export const statusTypes = {
  inProgress: 'inProgress',
  notInProgress: 'notInProgress',
  partner: 'partner',
  competitor: 'competitor',
};
export const statusTypesRu = {
  inProgress: 'В работе',
  notInProgress: 'Не в работе',
  partner: 'Партнер',
  competitor: 'Конкурент',
};

export const colorStatusTypes = {
  inProgress: { status: statusTypesRu.inProgress, class: 'status-green' },
  notInProgress: {
    status: statusTypesRu.notInProgress,
    class: 'status-red-dark',
  },
  partner: { status: statusTypesRu.partner, class: 'status-purple' },
  competitor: { status: statusTypesRu.competitor, class: 'status-yellow' },
  // unknown: { status: statusTypesRu.unknown, class: 'status-grey' },
};
