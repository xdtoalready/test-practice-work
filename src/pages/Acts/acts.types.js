import { statusActTypesRu } from '../Services/services.types';

export const actStatusTypes = {
  stamped: 'stamped',
  unstamped: 'unstamped',
};

export const actStatusTypesRu = {
  stamped: 'Подписан',
  unstamped: 'Не подписан',
};

export const colorActStatusTypes = {
  stamped: { status: actStatusTypesRu.stamped, class: 'status-green' },
  unstamped: { status: actStatusTypesRu.unstamped, class: 'status-red' },
};
