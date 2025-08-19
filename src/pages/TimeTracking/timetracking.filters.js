import { formatDateToQuery } from '../../utils/formate.date';
import { getQueryParam } from '../../utils/window.utils';
import { periodEnum, periodEnumRu } from '../Documents/filters/bills.filter.conf';

export const createTimeSpendingFilters = ({
  appApi,
  periodCalendarRef,
  hasAllTimeSpendingsAccess,
}) => {
  return {
    filters: [
      {
        type: 'date',
        name: 'date_range',
        label: 'Промежуток (от/до)',
        groupId: 'date_range',
        props: {
          period: true,
          ref: (ref) => {
            periodCalendarRef = ref;
          },
        },
        decodeUrlValue: (value) => {
          const decodedValue = decodeURIComponent(value);
          const rangeParams = new URLSearchParams(decodedValue);
          const fromDate = rangeParams.get('from');
          const toDate = rangeParams.get('to');

          if (fromDate && toDate) {
            return [new Date(fromDate), new Date(toDate)];
          }
          return null;
        },
        toUrlValue: (values) => {
          if (!values || !Array.isArray(values)) return '';
          const [start, end] = values;
          if (!start || !end) return '';
          const params = [];
          if (start) params.push(`from=${formatDateToQuery(start)}`);
          if (end) params.push(`to=${formatDateToQuery(end)}`);
          return params.join('&');
        },
        onChange: (params) => {
          // При изменении календаря очищаем период из URL и провайдера
          if (params.has('period')) {
            params.delete('period');
            return 'period';
          }
        },
      },
      {
        type: 'select',
        name: 'period',
        label: 'Период (за)',
        groupId: 'period',
        props: {
          defaultValue: getQueryParam('date_range')
            ? null
            : { value: periodEnum.month, label: periodEnumRu.month },
          isMulti: false,
          options: Object.entries(periodEnumRu).map(([value, label]) => ({
            value,
            label,
          })),
        },
        toUrlValue: (values) => {
          function mapValues(values) {
            return values.map((v) => v.value).join(',');
          }
          return values
            ? Array.isArray(values)
              ? mapValues(values)
              : values?.value
            : '';
        },
        onChange: (params) => {
          // При изменении календаря очищаем период из URL и провайдера
          if (params.has('date_range')) {
            params.delete('date_range');
            return 'date_range';
          }
        },
      },
      // Фильтр по сотруднику только для пользователей с правами
      ...(hasAllTimeSpendingsAccess
        ? [
            {
              type: 'select',
              name: 'performer_id',
              label: 'Сотрудник',
              props: {
                isAsync: true,
                asyncSearch: async (query) => {
                  const response = await appApi.getEmployees(query);
                  const data = response;
                  return response.map((item) => ({
                    value: item?.id,
                    label: `${item?.last_name ?? ''} ${item?.name ?? ''} ${item?.middle_name ?? ''}`,
                  }));
                },
                minInputLength: 2,
                isMulti: false,
                placeholder: 'Исполнитель',
              },
              decodeUrlValue: (value) => {
                ;
                const decodedValue = decodeURIComponent(value);
                return decodedValue;
              },
              toUrlValue: (values) =>
                values ? values.map((v) => v.value).join(',') : '',
            },
          ]
        : []),
    ],
  };
};
