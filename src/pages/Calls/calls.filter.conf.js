import {
  callDirectionTypes,
  callDirectionTypesRu,
  durationEnum,
  periodEnum,
  periodEnumRu,
} from './calls.types';
import { getQueryParam } from '../../utils/window.utils';
import { formatDateToQuery } from '../../utils/formate.date';

export const createCallsFilters = ({
                                     appApi,
  periodSelectorRef,
  periodCalendarRef,
}) => {
  return {
    filters: [
      {
        type: 'select',
        name: 'type',
        label: 'Тип звонка',
        props: {
          isMulti: true,
          options: Object.entries(callDirectionTypesRu).map(
            ([value, label]) => ({
              value,
              label,
            }),
          ),
        },
        toUrlValue: (values) => {
          ;
          return values
            ? Array.isArray(values)
              ? values.map((v) => v.value).join(',')
              : values
            : '';
        },
      },
      {
        type: 'select',
        name: 'duration',
        label: 'Продолжительность',
        props: {
          isMulti: false,
          options: Object.entries(durationEnum).map(([value, label]) => ({
            value,
            label,
          })),
        },
        toUrlValue: (values) =>
          values
            ? Array.isArray(values)
              ? values[0].value
              : values.value
            : '',
      },
      {
        type: 'date',
        name: 'date_range',
        groupId: 'date_range',
        label: 'Промежуток (от/до)',
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
        groupId: 'period',
        label: 'Период (за)',
        props: {
          defaultValue: getQueryParam('date_range')
            ? null
            : { value: periodEnum.day, label: periodEnumRu.day },
          isMulti: false,
          ref: (ref) => {
            periodSelectorRef = ref;
          },
          options: Object.entries(periodEnumRu).map(([value, label]) => ({
            value,
            label,
          })),
        },
        toUrlValue: (values) => {
          function mapValues(values) {
            return values.map((v) => v.value).join(',');
          }
          ;
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
      {
        type: 'input',
        name: 'manager_id',
        label: 'Менеджер',
        props: {
          isAsync: true,
          asyncSearch: async (query) => {
            const response = await appApi.getEmployees(query);
            return response.map((item) => ({
              value: item?.id,
              label: `${item?.last_name??''} ${item?.name??''} ${item?.middle_name??""}`
            }));
          },
          minInputLength: 2,
          isMulti: true,
          placeholder: 'Поиск менеджера'
        },
        toUrlValue: values => values ? values.map(v => v.value).join(',') : ''
      },
      {
        type: 'textInput',
        name: 'phone',
        label: 'Телефон',
        props: {
          placeholder: '+7XXXXXXXXXX',
        },
        toUrlValue: (value) => value || '',
      },
    ],
  };
};
