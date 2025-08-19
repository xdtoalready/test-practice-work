import { businessTypes, businessTypesRu } from './calendar.types';
import Calendar from '../../shared/Datepicker';
import { format } from 'date-fns';

export const createCalendarFilters = (appApi) => {

  return {
    filters: [
      {
        type: 'input',
        name: 'employee_id',
        label: 'Ответственный',
        props: {
          isAsync: true,
          asyncSearch: async (query) => {
            const response = await appApi.getEmployees(query);
            return response.map((item) => ({
              value: item?.id,
              label: `${item?.last_name ?? item?.surname ?? ''} ${item?.name ?? ''} ${item?.middle_name ?? ''}`,
            }));
          },
          minInputLength: 2,
          isMulti: false,
          placeholder: 'Поиск сотрудника',
        },
        // toUrlValue: values => values ? values.map(v => v.value).join(',') : ''
        toUrlValue: (value) => {
          return value.length ? value[0]?.value : '';
        },
      },
      {
        type: 'select',
        name: 'type',
        label: 'Тип дела',
        props: {
          isMulti: false,
          options: Object.entries(businessTypesRu).map(([value, label]) => ({
            value,
            label,
          })),
        },
        toUrlValue: (value) => {
          return value.length ? value[0]?.value : '';
        },
        // toUrlValue: values => values ? values.map(v => v.value).join(',') : ''
      },
    ],
  };
};
