import { billStatusTypesRu } from '../types/bills.types';
import { serviceTypeEnumRu } from '../../Services/services.types';
import {
  formatDateToBackend,
  formatDateToQuery,
} from '../../../utils/formate.date';
import { getQueryParam } from '../../../utils/window.utils';

export const periodEnum = {
  day: 'day',
  week: 'week',
  month: 'month',
  quarter: 'quarter',
  year: 'year',
};

export const periodEnumRu = {
  day: 'День',
  week: 'Неделя',
  month: 'Месяц',
  quarter: 'Квартал',
  year: 'Год',
};

export const createBillsFilters = ({
  appApi,
  periodSelectorRef,
  periodCalendarRef,
}) => {
  // const handlePeriodChange = (values, { periodCalendar = false } = {}) => {
  //
  //     if (periodCalendar) {
  //         // Если изменился календарь, сбрасываем селектор
  //         if (periodSelectorRef) {
  //             periodSelectorRef.clearValue();
  //         }
  //     } else {
  //         // Если изменился селектор, сбрасываем календарь
  //         if (periodCalendarRef) {
  //             periodCalendarRef.clearValue();
  //         }
  //     }
  // };

  return {
    filters: [
      {
        type: 'select',
        name: 'status',
        label: 'Статус',
        props: {
          isMulti: true,
          options: Object.entries(billStatusTypesRu).map(([value, label]) => ({
            value,
            label,
          })),
        },
        toUrlValue: (values) =>
          values ? values.map((v) => v.value).join(',') : '',
      },
      {
        type: 'select',
        name: 'service_type',
        label: 'Тип услуги',
        props: {
          isMulti: true,
          options: Object.entries(serviceTypeEnumRu).map(([value, label]) => ({
            value,
            label,
          })),
        },
        toUrlValue: (values) =>
          values ? values.map((v) => v.value).join(',') : '',
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
            : { value: periodEnum.month, label: periodEnumRu.month },
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
        name: 'company_id',
        label: 'Клиент',
        props: {
          isAsync: true,
          asyncSearch: async (query) => {
            const response = await appApi.getCompanies(query);
            return response.map((item) => ({
              value: item?.id,
              label: item?.name
            }));
          },
          minInputLength: 4,
          isMulti: false,
          placeholder: 'Поиск клиента'
        },
        toUrlValue: values => values ? values.map(v => v.value).join(',') : ''
      },
      {
        type: 'select',
        name: 'legal_entity_id',
        label: 'Юридическое лицо',
        props: {
          isMulti: false,
          options: [
            { value: '1', label: 'ИП Шилов Александр Александрович' },
            { value: '2', label: 'ООО "СОВРЕМЕННЫЙ МАРКЕТИНГ"' },
            { value: '3', label: 'ООО "СМ-РЕКЛАМА"' },
          ],
        },
        toUrlValue: (values) => values?.value || '',
      }
    ],
  };
};
