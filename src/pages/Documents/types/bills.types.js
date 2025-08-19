export const billStatusTypes = {
  created: 'created',
  paid: 'paid',
  canceled: 'canceled',
  expired: 'expired',
};

export const billStatusTypesRu = {
  created: 'Создан',
  paid: 'Оплачен',
  canceled: 'Отменен',
  expired: 'Просрочен',
};

export const colorBillStatusTypes = {
  created: { status: billStatusTypesRu.created, class: 'status-blue' },
  paid: { status: billStatusTypesRu.paid, class: 'status-green' },
  canceled: { status: billStatusTypesRu.canceled, class: 'status-grey' },
  expired: { status: billStatusTypesRu.expired, class: 'status-red' },
};

export const measurementUnitTypes = {
  pcs: 'pcs',
  hours: 'hours',
};

export const measurementUnitTypesRu = {
  pcs: 'шт',
  hours: 'часы',
};
