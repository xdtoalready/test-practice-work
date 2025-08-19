import { mockHttp, resetApiProvider } from '../../shared/http';
import { statusTypes } from './clients.types';
import { loadAvatar } from '../../utils/create.utils';

export const createRequisites = ({
  INN = '',
  KPP = '',
  OGRN = '',
  RS = '',
  BIK = '',
  BankName = '',
}) => {
  return {
    INN,
    KPP,
    OGRN,
    RS,
    BIK,
    BankName,
  };
};

const createClients = () => {
  const baseClient = {
    id: 0,
    description:
      'Лакокрасочный завод XYZ специализируется на производстве качественных лакокрасочных материалов и покрытий для различных отраслей промышленности с 2004 года. Мы постоянно совершенствуем наши технологии и материалы, чтобы отвечать высоким требованиям наших клиентов. ',
    title: 'ООО ПКФ «Катав-Ивановский лакокрасочный завод»',
    status: statusTypes.inProgress,
    manager: {
      image: loadAvatar(),
      name: 'Александр',
      surname: 'Шилов',
      role: 'Директор',
    },
    contactPersons: [
      {
        id: 0,
        role: 'Руководитель',
        fio: 'Шилов Александр Александрович',
        tel: '+7 987 654-32-10',
        email: 'example@mail.ru',
        messengers: [{ telegram: '' }, { whatsapp: '' }],
      },
      {
        id: 1,
        role: 'Руководитель',
        fio: 'Шилов Александр Александрович',
        tel: '+7 987 654-32-10',
        email: 'example@mail.ru',
        messengers: [{ telegram: '' }, { whatsapp: '' }],
      },
    ],
    passwords: {
      0: {
        id: 0,
        name: 'Хостинг',
        values: {
          0: {
            login: '12345678',
            password: '12345678',
          },
        },
      },
    },
    contactData: {
      address: {
        0: '620131, г. Екатеринбург, ул. Крауля, д. 182, оф...',
      },
      tel: {
        0: '+7 987 654-32-10',
        1: '1',
      },
      email: { 0: 'example@mail.ru' },
      site: { 0: 'example.ru' },
      requisites: {
        0: createRequisites({
          INN: '1234567890',
          BankName: 'ФИЛИАЛ "ЕКАТЕРИНБУРГСКИЙ" АО "АЛЬФА-БАНК"',
          KPP: '1234567890',
          OGRN: '620131, г. Екатеринбург, ул. Крауля, д. 182, офис 201',
          RS: '4002402400000020400',
          BIK: '046577964',
        }),
      },
    },
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
          files: [
            { id: 0, name: 'File name long long long long', extension: '.txt' },
            { id: 1, name: 'File name', extension: '.pdf' },
          ],
        },
      },
    },
    activities: [
      {
        date: new Date(2024, 1, 11),
        time: new Date(),
        description: 'Звонок',
        type: 'call',
        members: 2,
        assignee: {
          image: loadAvatar(),
          name: 'Александр',
          surname: 'Шилов',
          role: 'Директор',
        },
      },
      {
        date: new Date(2024, 9, 20),
        time: new Date(),
        description:
          'Звонок клиенту Звонок клиенту Звонок клиенту Звонок клиенту Звонок клиенту Звонок клиенту Звонок клиенту ',
        type: 'call',
        members: 2,
        assignee: {
          image: loadAvatar(),
          name: 'Александр',
          surname: 'Шилов',
          role: 'Директор',
        },
      },
    ],
    services: [
      {
        description: 'SEONeo',
        creator: {
          image: loadAvatar(),
          name: 'Александр',
          surname: 'Шилов',
          role: 'Директор',
        },
        responsible: {
          image: loadAvatar(),
          name: 'Александр',
          surname: 'Шилов',
          role: 'Директор',
        },
        deadline: new Date(),
      },
      {
        description: 'SEONeo',
        creator: {
          image: loadAvatar(),
          name: 'Александр',
          surname: 'Шилов',
          role: 'Директор',
        },
        responsible: {
          image: loadAvatar(),
          name: 'Александр',
          surname: 'Шилов',
          role: 'Директор',
        },
        deadline: new Date(),
      },
    ],

    deals: [
      {
        status: 'Догоовр подписан',
        sum: '39000',
        description: 'Связаться с клиентом',
        deadline: new Date(),
        responsible: {
          image: loadAvatar(),
          name: 'Александр',
          surname: 'Шилов',
          role: 'Директор',
          deadline: new Date(),
        },
      },
    ],
  };

  const clients = [];
  for (let i = 0; i < 20; i++) {
    clients.push({
      ...baseClient,
      id: i,
      title: `${String.fromCharCode(97 + (i % 26)).toUpperCase()} ${baseClient.title}`,
    });
  }

  return clients;
};

export default { createClients, resetApiProvider };
