import { loadAvatar } from '../../utils/create.utils';
import {
  statusActTypes,
  statusBillTypes,
  statusTaskTypes,
  statusTypes,
} from './services.types';

const createServices = () => {
  return [
    {
      id: 0,

      title: 'Название услуги 1',
      contractNumber: '44444',
      client: {
        id: 0,
        title: 'a  ООО ПКФ «Катав-Ивановский лакокрасочный завод»',
      },
      type: {
        id: 0,
        title: 'Название услуги 1',
      },
      manager: {
        id: 0,
        image: loadAvatar(),
        name: 'Александр',
        surname: 'Александр1',
        role: 'Директор',
      },
      command: [
        {
          id: 0,
          image: loadAvatar(),
          name: 'Александр',
          surname: 'Александр1',
          role: 'Директор',
        },
        {
          id: 1,
          image: loadAvatar(),
          name: 'Александр',
          surname: 'Александр2',
          role: 'Директор',
        },
      ],
      status: statusTypes.finished,
      stages: [
        {
          id: 0,
          number: '1234',
          title:
            'SEO продвижение: февраль 2024 12312321 13131312 312123121 32131',
          task: {
            id: 0,
            status: statusTaskTypes.inProgress,
            description: 'SEO-продвижение',
            startDate: new Date(),
            endDate: new Date(),
          },
          time: {
            planned: {
              planned: 5,
              actual: 8,
              type: 'часов',
            },
            extra: {
              planned: 5,
              actual: 8,
              type: 'часов',
              cost: 7500,
            },
          },
          act: {
            scanStatus: statusActTypes.notAssignedScan,
            originalStatus: statusActTypes.notAssignedOriginal,
            withSign: {
              id: 0,
              file: 'Act with sign',
              extension: '.pdf',
            },
            withoutSign: {
              id: 1,
              file: 'Act without sign',
              extension: '.pdf',
            },
          },
          bills: [
            {
              id: 0,
              title: 'Счет №1904-1',
              withSign: {
                id: 3,
                file: 'Bill with sign',
                extension: '.pdf',
              },
              withoutSign: {
                id: 4,
                file: 'Bill without sign',
                extension: '.pdf',
              },
              sum: 10000,
              status: statusBillTypes.payed,
              payedDate: new Date(2024, 12, 12),
            },
          ],
        },
      ],
    },
    {
      id: 1,

      title: 'Название услуги 2',
      contractNumber: '44444',
      type: {
        id: 0,
        title: 'Название услуги 1',
      },
      client: {
        id: 1,
        title: 'в ООО ПКФ «Катав-Ивановский лакокрасочный завод»',
      },
      manager: {
        id: 1,
        image: loadAvatar(),
        name: 'Александр',
        surname: 'Александр2',
        role: 'Директор',
      },
      command: [
        {
          id: 0,
          image: loadAvatar(),
          name: 'Александр',
          surname: 'Александр1',
          role: 'Директор',
        },
      ],
      status: statusTypes.finished,
      stages: [
        {
          id: 0,
          number: '1234',
          title: 'SEO продвижение: февраль 2024',
          task: {
            id: 0,
            status: statusTaskTypes.inProgress,
            description: 'SEO-продвижение',
            startDate: new Date(),
            endDate: new Date(),
          },
          time: {
            planned: {
              planned: 5,
              actual: 8,
              type: 'часов',
            },
            extra: {
              planned: 5,
              actual: 8,
              type: 'часов',
              cost: 7500,
            },
          },
          act: {
            scanStatus: statusActTypes.notAssignedScan,
            originalStatus: statusActTypes.notAssignedOriginal,
            withSign: {
              id: 0,
              file: 'Act with sign',
              extension: '.pdf',
            },
            withoutSign: {
              id: 1,
              file: 'Act without sign',
              extension: '.pdf',
            },
          },
          bills: [
            {
              id: 0,
              title: 'Счет №1904-1',
              withSign: {
                id: 3,
                file: 'Bill with sign',
                extension: '.pdf',
              },
              withoutSign: {
                id: 4,
                file: 'Bill without sign',
                extension: '.pdf',
              },
              sum: 10000,
              status: statusBillTypes.payed,
              payedDate: new Date(2024, 12, 12),
            },
          ],
        },
      ],
    },
  ];
};

const createServiceTypes = () => {
  return [
    {
      id: 0,
      title: 'Название услуги 1',
    },
    {
      id: 1,
      title: 'Название услуги 2',
    },
    {
      id: 2,
      title: 'Название услуги 3',
    },
  ];
};

export default { createServices, createServiceTypes };
