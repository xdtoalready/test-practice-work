import { billStatusTypesRu } from '../types/bills.types';
import { serviceTypeEnumRu } from '../../Services/services.types';

// Создаем список месяцев
export const monthsEnum = {
  '01': 'january',
  '02': 'february', 
  '03': 'march',
  '04': 'april',
  '05': 'may',
  '06': 'june',
  '07': 'july',
  '08': 'august',
  '09': 'september',
  '10': 'october',
  '11': 'november',
  '12': 'december',
};

export const monthsEnumRu = {
  '01': 'Январь',
  '02': 'Февраль',
  '03': 'Март',
  '04': 'Апрель',
  '05': 'Май',
  '06': 'Июнь',
  '07': 'Июль',
  '08': 'Август',
  '09': 'Сентябрь',
  '10': 'Октябрь',
  '11': 'Ноябрь',
  '12': 'Декабрь',
};

// Генерируем годы начиная с 2025
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2025;
  const years = {};
  const yearsRu = {};
  
  for (let year = startYear; year <= Math.max(currentYear, startYear + 10); year++) {
    years[year] = year.toString();
    yearsRu[year] = year.toString();
  }
  
  return { years, yearsRu };
};

const { years: yearsEnum, yearsRu: yearsEnumRu } = generateYears();

export { yearsEnum, yearsEnumRu };

export const createReportsFilters = ({ appApi }) => {
  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const currentYear = currentDate.getFullYear();

  return {
    filters: [
      {
        type: 'select',
        name: 'month',
        label: 'Месяц',
        props: {
          isMulti: false,
          defaultValue: { value: currentMonth, label: monthsEnumRu[currentMonth] },
          options: Object.entries(monthsEnumRu).map(([value, label]) => ({
            value,
            label,
          })),
        },
        decodeUrlValue: (value) => {
          const decodedValue = decodeURIComponent(value);
          return { value: decodedValue, label: monthsEnumRu[decodedValue] };
        },
        toUrlValue: (values) =>
          values
            ? Array.isArray(values)
              ? values[0].value
              : values.value
            : '',
      },
      {
        type: 'select',
        name: 'year',
        label: 'Год',
        props: {
          isMulti: false,
          defaultValue: { value: currentYear.toString(), label: currentYear.toString() },
          options: Object.entries(yearsEnumRu).map(([value, label]) => ({
            value,
            label,
          })),
        },
        decodeUrlValue: (value) => {
          const decodedValue = decodeURIComponent(value);
          return { value: decodedValue, label: yearsEnumRu[decodedValue] };
        },
        toUrlValue: (values) =>
          values
            ? Array.isArray(values)
              ? values[0].value
              : values.value
            : '',
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
        name: 'report_type',
        label: 'Тип отчета',
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
      // {
      //   type: 'select',
      //   name: 'status',
      //   label: 'Статус',
      //   props: {
      //     isMulti: true,
      //     options: Object.entries(billStatusTypesRu).map(([value, label]) => ({
      //       value,
      //       label,
      //     })),
      //   },
      //   toUrlValue: (values) =>
      //     values ? values.map((v) => v.value).join(',') : '',
      // },
      // {
      //   type: 'select',
      //   name: 'service_type',
      //   label: 'Тип услуги',
      //   props: {
      //     isMulti: true,
      //     options: Object.entries(serviceTypeEnumRu).map(([value, label]) => ({
      //       value,
      //       label,
      //     })),
      //   },
      //   toUrlValue: (values) =>
      //     values ? values.map((v) => v.value).join(',') : '',
      // },
    ],
  };
};