import {dealStatusTypes, dealStatusTypesRu, sourceTypeRu} from "./deals.types";
import {serviceTypeEnumRu} from "../Services/services.types";
import Calendar from "../../shared/Datepicker";
import { format, isValid } from 'date-fns';
import {getQueryParam} from "../../utils/window.utils";
import {periodEnum, periodEnumRu} from "../Documents/filters/bills.filter.conf";
import { formatDateToQuery } from '../../utils/formate.date';

export const createDealsFilters = (appApi,periodCalendarRef,periodCreatedAtRef) => ({
    filters: [
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
            type: 'select',
            name: 'status',
            label: 'Статус это',
            props: {
                isMulti: true,
                options: Object.entries(dealStatusTypesRu).map(([value, label]) => ({
                    value,
                    label
                }))
            },
            toUrlValue: values => values ? values.map(v => v.value).join(',') : '',
            decodeUrlValue: (value) => {
                if (value) {
                    return value.split(',').map(v => ({value: v,label:dealStatusTypesRu[v]}));
                }
                return null;
            },

        },
        {
            type: 'select',
            name: 'status_no',
            label: 'Статус это не',
            props: {
                defaultValue:  [{label:dealStatusTypesRu.refused,value:dealStatusTypes.refused},{label:dealStatusTypesRu.failed,value:dealStatusTypes.failed}],
                isMulti: true,
                options: Object.entries(dealStatusTypesRu).map(([value, label]) => ({
                    value,
                    label
                }))
            },
            toUrlValue: values => {

                return values ? values.map(v => v.value).join(',') : ''
            },
            decodeUrlValue: (value) => {
                if (value) {
                    return value.split(',').map(v => ({value: v,label:dealStatusTypesRu[v]}));
                }
                return null;
            },
        },
        {
            type: 'select',
            name: 'source',
            label: 'Рекламный источник',
            props: {
                isMulti: true,
                options: Object.entries(sourceTypeRu).map(([value, label]) => ({
                    value,
                    label
                }))
            },
            toUrlValue: values => values ? values.map(v => v.value).join(',') : '',
            decodeUrlValue: (value) => {
                if (value) {
                    return value.split(',').map(v => ({value: v,label:sourceTypeRu[v]}));
                }
                return null;
            },
        },
        {
            type: 'select',
            name: 'service_type',
            label: 'Тип услуги',
            props: {
                isMulti: true,
                options: Object.entries(serviceTypeEnumRu).map(([value, label]) => ({
                    value,
                    label
                }))
            },
            toUrlValue: values => values ? values.map(v => v.value).join(',') : '',
            decodeUrlValue: (value) => {
                if (value) {
                    return value.split(',').map(v => ({value: v,label:serviceTypeEnumRu[v]}));
                }
                return null;
            },
        },
        {
            type: 'date',
            name: 'created_at_range',

            label: 'Дата создания (от/до)',
            component: Calendar,
            props: {
                placeholder: 'Выберите дату (от/до)',
                period: true,
                ref: (ref) => {
                    periodCreatedAtRef = ref;
                },
            },
            decodeUrlValue: (value) => {
                const decodedValue = decodeURIComponent(value);
                const rangeParams = new URLSearchParams(decodedValue);
                const fromDate = rangeParams.get('created_at_start');
                const toDate = rangeParams.get('created_at_end');

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
                if (start) params.push(`created_at_start=${formatDateToQuery(start)}`);
                if (end) params.push(`created_at_end=${formatDateToQuery(end)}`);
                return params.join('&');
            },
        },
        {
            type: 'date',
            name: 'date_range_last_comment',
            label: 'Дата последнего коммента (от/до)',
            props: {
                period: true,
                ref: (ref) => {
                    periodCalendarRef = ref;
                },
            },
            decodeUrlValue: (value) => {
                const decodedValue = decodeURIComponent(value);
                const rangeParams = new URLSearchParams(decodedValue);
                const fromDate = rangeParams.get('from_last_comment');
                const toDate = rangeParams.get('to_last_comment');

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
                if (start) params.push(`from_last_comment=${formatDateToQuery(start)}`);
                if (end) params.push(`to_last_comment=${formatDateToQuery(end)}`);
                return params.join('&');
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
                minInputLength: 2,
                isMulti: false,
                placeholder: 'Поиск клиента'
            },
            toUrlValue: values => values ? values.map(v => v.value).join(',') : ''
        }
    ]
});