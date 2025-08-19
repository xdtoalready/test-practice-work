import { loadAvatar } from '../../utils/create.utils';
import { taskStatusTypes, taskStatusTypesRu, stageStatusTypes, stageStatusTypesRu } from './stages.types';

const createStages = () => {
  return [
    {
      id: 0,
      number: '1234',
      title: 'SEO-продвижение',
      startTime: new Date(),
      deadline: new Date(),
      deadlineTime: '5 ч',
      contactPerson: 'Александр Шилов',
      extraCosts: '7500',
      actSum: '2500',
      budgetTimeValue: 20,
      budgetTimeType: 'minutes',
      status: stageStatusTypes.created,
      taskDescription: 'Нарисовать СРМ',
      sumByHand: true,
      service: {
        id: 0,
        title: 'Услуга 1',
      },
      client: {
        id: 0,
        title: 'a ООО ПКФ «Катав-Ивановский лакокрасочный завод»',
      },
      tasks: [
        {
          id: 0,
          title: 'Добавить блок',
          status: taskStatusTypes.created,
          service: {
            id: 0,
            title: 'Название услуги 1',
          },
          template: {
            id: 0,
            title: 'Название шаблона 1',
          },
          description:
            '1. Сводная кейсов (нужно изменить согласно последним предложениям) +\n' +
            '2. Посадочная страница кейса по разработке сайта. Необходимо убрать зависимость картинки на странице услуги от первой картинке в кейсе, так мы сможем более гибко заполнять кейс. +\n' +
            '3. Поменять заголовки на всем сайте, сейчас на всех блоках заголовок h1 +\n' +
            '4. Добавить на страницу о компании стандарты работы. (Евгения подготовит материал и приложит к задаче, дедлайн для подготовки 30.11) +\n' +
            '5. Изменить блок "наши клиенты" обсуждали идеи в телеграмм чате +\n' +
            '6. Заверстать новые страницы:\n' +
            'Продвижение сайта за позиции\n' +
            'Продвижение молодых сайтов\n' +
            'и Максим еще дополнит какие страницы нужно будет создать. Тз будет чуть позже\n' +
            '7. Упорядочить статьи в блоге по дате добавления +\n' +
            '8. Упорядочить кейсы +\n' +
            '9. Скорректировать вывод кейса по разработке',
          showInLK: true,
          comments: {
            0: {
              id: 0,
              date: new Date(2011, 11, 10),
              sender: {
                id: 0,
                image: loadAvatar(),
                name: 'Александр Шилов',
              },
              value: {
                text: 'Нам необходимо продвигать Эмали: ПФ-115, НЦ-132, ХВ-785, ХС-759, ХВ-124, ХВ-15, КО-174, КО-198, КО-813, КО-814, ХВ-518, МЛ-12. Грунтовки ГФ-021, ХС-010, АК-570, ФЛ-03. Мастики МБРх, битумно-полимерные, АПМ, праймер НК-50. Лаки БТ-577, ХВ-784. Краски водно-дисперсионные (ВД-ВА 224, ВД-ВА-220, ВД-ВК-111). Серебрянка БТ-177',
              },
            },
          },
          taskLinked: {
            id: 0,
            title: 'Задача № 3 - разработать сайт',
          },
          type: {
            id: 0,
            title: 'Тип задачи 1',
          },
          auditors: [
            {
              id: 0,
              image: loadAvatar(),
              fio: 'Александр Шилов',
              role: 'Директор',
            },
          ],
          executors: [
            {
              id: 0,
              image: loadAvatar(),
              fio: 'Александр Шилов',
              role: 'Директор',
            },
          ],
          responsibles: [
            {
              id: 0,
              image: loadAvatar(),
              fio: 'Александр Шилов',
              role: 'Директор',
            },
          ],
          deadline: new Date(),
          deadlineTime: '5 ч',
          actualTime: '2 дн',
          isNewForUser: true,
        },
        {
          id: 1,
          title: 'Обновить дизайн',
          status: taskStatusTypes.finished,
          service: {
            id: 1,
            title: 'Название услуги 2',
          },
          template: {
            id: 1,
            title: 'Название шаблона 2',
          },
          description:
            '1. Обновить логотип компании +\n' +
            '2. Переработать главную страницу сайта +\n' +
            '3. Изменить цветовую схему на всех страницах +\n' +
            '4. Добавить новый раздел "Отзывы клиентов" (Анна предоставит материалы, дедлайн 15.07) +\n' +
            '5. Обновить контакты на странице "Контакты" согласно новым данным +\n' +
            '6. Заверстать страницу "О нас":\n' +
            'История компании\n' +
            'Команда\n' +
            'и Елена еще дополнит информацию. Тз будет чуть позже\n' +
            '7. Упорядочить проекты в портфолио по алфавиту +\n' +
            '8. Оптимизировать загрузку изображений +\n' +
            '9. Проверить корректность отображения на мобильных устройствах',
          showInLK: false,
          comments: {
            1: {
              id: 1,
              date: new Date(2022, 6, 15),
              sender: {
                id: 1,
                image: loadAvatar(),
                name: 'Мария Иванова',
              },
              value: {
                text: 'Необходимо пересмотреть дизайн главной страницы: добавить новые элементы и убрать устаревшие.',
              },
            },
          },
          taskLinked: {
            id: 1,
            title: 'Задача № 4 - редизайн сайта',
          },
          type: {
            id: 1,
            title: 'Тип задачи 2',
          },
          auditors: [
            {
              id: 1,
              image: loadAvatar(),
              fio: 'Мария Иванова',
              role: 'Менеджер проекта',
            },
          ],
          executors: [
            {
              id: 2,
              image: loadAvatar(),
              fio: 'Иван Петров',
              role: 'Дизайнер',
            },
          ],
          responsibles: [
            {
              id: 3,
              image: loadAvatar(),
              fio: 'Алексей Сидоров',
              role: 'Разработчик',
            },
          ],
          deadline: new Date(2024, 8, 1),
          deadlineTime: '3 дн',
          actualTime: '4 ч',
          isNewForUser: false,
        },
      ],
    },
  ];
};

const createTemplateTypes = () => {
  return [
    {
      id: 0,
      title: 'Название шаблона 1',
    },
    {
      id: 1,
      title: 'Название шаблона 2',
    },
    {
      id: 2,
      title: 'Название шаблона 3',
    },
  ];
};

const createTaskTypes = () => {
  return [
    {
      id: 0,
      title: 'Тип задачи 1',
    },
    {
      id: 1,
      title: 'Тип задачи 2',
    },
    {
      id: 2,
      title: 'Тип задачи 3',
    },
  ];
};

export default { createStages, createTemplateTypes };
