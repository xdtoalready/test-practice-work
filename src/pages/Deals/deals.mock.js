import {formatDateToBackend} from "../../utils/formate.date";
import {mockHttp} from "../../shared/http";

export const createMockTasks = (dealId) => {
    const taskTypes = ['calculation', 'development', 'research', 'testing'];
    const taskStatuses = ['created', 'in_work', 'waiting_for_approval', 'finished', 'paused'];

    const createMockPerson = (id) => ({
        id,
        name: `Имя${id}`,
        middle_name: `Отчество${id}`,
        last_name: `Фамилия${id}`,
        avatar: `/storage/avatars/default/males/avatar${id}.jpg`,
        birthday: null,
        position: {
            id: Math.floor(Math.random() * 5) + 1,
            name: ["Менеджер", "Разработчик", "Тестировщик", "Аналитик", "Дизайнер"][Math.floor(Math.random() * 5)]
        },
        email: `user${id}@example.com`,
        phone: null,
        gender: "male"
    });

    const tasksCount = Math.floor(Math.random() * 5) + 3;

    return Array.from({ length: tasksCount }, (_, index) => ({
        id: index + 1,
        name: `Задача ${index + 1} для сделки ${dealId}`,
        description: `Описание задачи ${index + 1} для сделки ${dealId}`,
        linked_task: `https://crm.lead-bro.ru/tasks/${index + 1}`,
        type: taskTypes[Math.floor(Math.random() * taskTypes.length)],
        status: taskStatuses[Math.floor(Math.random() * taskStatuses.length)],
        deadline: formatDateToBackend(new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000)),
        responsible: createMockPerson(Math.floor(Math.random() * 5) + 1),
        creator: createMockPerson(Math.floor(Math.random() * 5) + 6),
        planned_time: +(Math.random() * 8).toFixed(1), // От 0 до 8 часов
        actual_time: +(Math.random() * 8).toFixed(1),
        performer: createMockPerson(Math.floor(Math.random() * 5) + 11),
        auditors: [
            createMockPerson(Math.floor(Math.random() * 5) + 16),
            createMockPerson(Math.floor(Math.random() * 5) + 21)
        ],
        show_at_client_cabinet: Math.random() > 0.5 ? 1 : 0,
        related_entity: {
            type: "App\\Models\\Deal",
            id: dealId,
            name: `Сделка ${dealId}`
        }
    }));
};

mockHttp.onGet(/\/api\/deals\/\d+\/tasks/).reply((config) => {
    const dealId = parseInt(config.url.split('/')[3]);
    return [200, { data: createMockTasks(dealId) }];
});

