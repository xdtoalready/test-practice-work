import { taskStatusTypesRu } from '../Stages/stages.types';
import { taskableTypes, tasksTypesRu } from './tasks.types';

export const createTaskFilters = (appApi) => ({
  filters: [
    {
      type: 'radio',
      name: 'filter',
      groupId: 'role',
      options: [
        { label: 'Все', value: 'all' },
        { label: 'Я - Создатель', value: 'creator' },
        { label: 'Я - Исполнитель', value: 'performer' },
        { label: 'Я - Ответственный', value: 'responsible' },
        { label: 'Я - Аудитор', value: 'auditor' },
      ],
    },
    {
      type: 'input',
      name: 'creator',
      label: 'Ответственный',
      groupId: 'others',
      props: {
        isAsync: true,
        asyncSearch: async (query) => {
          const response = await appApi.getEmployees(query);
          return response.map((item) => ({
            value: item?.id,
            label: `${item?.last_name ?? ''} ${item?.name ?? ''} ${item?.middle_name ?? ''}`,
          }));
        },
        minInputLength: 2,
        isMulti: false,
        placeholder: 'Ответственный',
      },
      toUrlValue: (value) => {
        return value.length ? value[0]?.value : '';
      },
    },
    {
      type: 'input',
      name: 'performer',
      label: 'Исполнитель',
      groupId: 'others',
      props: {
        isAsync: true,
        asyncSearch: async (query) => {
          const response = await appApi.getEmployees(query);
          return response.map((item) => ({
            value: item?.id,
            label: `${item?.last_name ?? ''} ${item?.name ?? ''} ${item?.middle_name ?? ''}`,
          }));
        },
        minInputLength: 2,
        isMulti: false,
        placeholder: 'Исполнитель',
      },
      toUrlValue: (value) => {
        return value.length ? value[0]?.value : '';
      },
    },
    {
      type: 'select',
      name: 'status',
      label: 'Статус',
      groupId: 'others',
      props: {
        isMulti: true,
        options: Object.entries(taskStatusTypesRu).map(([value, label]) => ({
          value,
          label,
        })),
      },
      toUrlValue: (values) =>
        values ? values.map((v) => v.value).join(',') : '',
    },
    // {
    //   type: 'select',
    //   name: 'status_no',
    //   label: 'Статус это не',
    //   groupId: 'others',
    //   props: {
    //     // defaultValue: [{label:taskStatusTypesRu.finished,value:taskStatusTypes.finished},{label:taskStatusTypesRu.paused,value:taskStatusTypes.paused}],
    //     isMulti: true,
    //     options: Object.entries(taskStatusTypesRu).map(([value, label]) => ({
    //       value,
    //       label,
    //     })),
    //   },
    //   toUrlValue: (values) =>
    //       values ? values.map((v) => v.value).join(',') : '',
    // },
    {
      type: 'select',
      name: 'types',
      label: 'Тип',
      groupId: 'others',
      props: {
        isMulti: true,
        options: Object.entries(tasksTypesRu).map(([value, label]) => ({
          value,
          label,
        })),
      },
      toUrlValue: (values) =>
        values ? values.map((v) => v.value).join(',') : '',
    },
    {
      type: 'select',
      name: 'taskable_type',
      label: 'Создано из',
      groupId: 'others',
      props: {
        isMulti: true,
        options: Object.entries(taskableTypes).map(([key, value]) => ({
          value,
          label: value === 'App\\Models\\Deal' ? 'Сделка' : 'Этап',
        })),
      },
      toUrlValue: (values) =>
        values ? values.map((v) => v.value).join(',') : '',
    },
  ],
});
