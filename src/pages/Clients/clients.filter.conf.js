import {statusTypesRu} from "./clients.types";

const clientStatusTypes = {
    working: 'В работе',
    not_working: 'Не в работе',
    partner: 'Партнер',
    competitor: 'Конкурент'
};

export const createClientsFilters = (appApi) => ({
    filters: [
        {
            type: 'select',
            name: 'status',
            label: 'Статус',
            props: {
                isMulti: false,
                options: Object.entries(clientStatusTypes).map(([value, label]) => ({
                    value,
                    label
                }))
            },
            toUrlValue: value => {
                return value.length ? value[0]?.value : '';
            }
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
        }
    ]
});