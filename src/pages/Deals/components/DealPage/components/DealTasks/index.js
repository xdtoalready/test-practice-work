import React, { useMemo } from 'react';
import styles from './styles.module.sass';
import TextLink from '../../../../../../shared/Table/TextLink';
import ManagerCell from '../../../../../../components/ManagerCell';
import Table from '../../../../../../shared/Table';
import StageBadge, {
  StageStatuses,
} from '../../../../../Stages/components/StagesPage/components/StagesTable/components/StagesBadge';
import DeadLineTimeCell
  from '../../../../../Stages/components/StagesPage/components/StagesTable/components/DeadLineTimeCell';
import { formatDate } from '../../../../../../utils/formate.date';
import withTaskModalHandler from '../../../../../../components/TaskModal/HocHandler';

const DealTasks = ({ deal, onEditTask, onCreateTasks }) => {
  const cols = useMemo(
    () => [
      {
        Header: 'Задача',
        id: 'task',
        width: '25%',

        Cell: ({ row }) => {
          const data = row?.original;
          return (
            <TextLink
              onClick={() => {
                onEditTask(data);
              }}
              className={styles.link}
            >
              {data?.title}
            </TextLink>
          );
        },
      },
      {
        Header: 'Статус задачи',
        id: 'status',
        width: '15%',
        // editing: true,
        accessor: 'status',
        Cell: ({ row }) => {
          const data = row?.original;
          return (
            <StageBadge
              statusType={StageStatuses.tasks}
              status={data.taskStatus}
            />
          );
        },
      },
      {
        Header: 'Исполнитель',
        id: 'executors',
        Cell: ({ row }) => {
          const data = row?.original;
          return <ManagerCell manager={data.executors[0]} />;
        },
      },
      {
        Header: 'Дедлайн',
        id: 'deadline',
        Cell: ({ row }) => {
          const data = row?.original;
          return <p>{formatDate(data.deadline)}</p>;
        },
      },
      {
        Header: () => null,
        id: 'deadline_time',
        width: '10%',

        Cell: ({ row }) => {
          const data = row?.original;

          return (
            <DeadLineTimeCell
              deadLine={data.deadlineTime}
              actualTime={data.actualTime}
            />
          );
        },
      },
    ],
    [],
  );

  const handleDelete = (id) => {
  };

  const data = useMemo(() => {
    if (!deal?.tasks) return [];

    // Преобразуем задачи в массив и сортируем по sortOrder
    return Object.entries(deal.tasks)
      .map(([id, task], index) => ({
        ...task,
        order: task.order ?? index, // используем существующий sortOrder или создаем новый
      }))
      .sort((a, b) => a.order - b.order);
  }, [deal?.tasks]);

  const getActions = (data) => [
    { label: 'Редактировать', onClick: () => onEditTask(data) },
    {
      label: 'Удалить',
      onClick: () => handleDelete(data.id),
      disabled: data.id === 0,
    },
  ];

  return (
    <div>
      <Table
        onPagination={true}
        smallTable={true}
        headerInCard={true}
        actions={getActions}
        headerActions={{
          add: {
            action: onCreateTasks,
            title: 'Создать задачу',
          },
        }}
        title={'Задачи'}
        data={data}
        columns={cols}
      />
    </div>
  );
};

const DealsTaskWithQueryTask = withTaskModalHandler(DealTasks);

export { DealTasks, DealsTaskWithQueryTask };
