import { loadAvatar } from '../../utils/create.utils';
import {taskStatusTypes} from "../Stages/stages.types";

const createTasks = () => {
    return [
        {
            id: 0,
            title: 'Добавить блок',
            status: taskStatusTypes.created,
            stage:{
                id:0,
                title:'SEO продвижение этап'
            },
            type:'seo',

            description: 'Описание задачи...',
            deadline: new Date(),
            deadlineTime: '5 ч',
            actualTime: '2 дн',
            isNewForUser: true,
            assigned:[{
                    id: 0,
                    image: loadAvatar(),
                    name: 'Александр',
                    surname: 'Александр1',
                    role: 'Директор',
            }],
            comments: [
                {
                    id: 0,
                    date: new Date(),
                    sender: {
                        id: 0,
                        image: loadAvatar(),
                        name: 'Александр Шилов',
                    },
                    value: {
                        text: 'Комментарий к задаче...',
                    },
                },
            ],
        },
        {
            id: 1,
            title: 'Обновить дизайн',
            status: taskStatusTypes.finished,
            stage:{
                id:0,
                title:'SEO продвижение этап'
            },
            type:'design',

            description: 'Описание задачи...',
            deadline: new Date(),
            deadlineTime: '3 дн',
            actualTime: '4 ч',
            isNewForUser: false,
            assigned:[{
                id: 0,
                image: loadAvatar(),
                name: 'Александр',
                surname: 'Александр1',
                role: 'Директор',
            }],
            comments: [
                {
                    id: 1,
                    date: new Date(),
                    sender: {
                        id: 1,
                        image: loadAvatar(),
                        name: 'Мария Иванова',
                    },
                    value: {
                        text: 'Комментарий к задаче...',
                    },
                },
            ],
        },
    ];
};

export default { createTasks };
