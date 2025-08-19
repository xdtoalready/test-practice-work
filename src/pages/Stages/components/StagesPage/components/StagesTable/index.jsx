import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { observer } from 'mobx-react';
import useStageApi from '../../../../stages.api';
import ManagerCell from '../../../../../../components/ManagerCell';
import styles1 from '../../../../../Clients/components/ClientsTable/Table.module.sass';
import styles from './Stages.module.sass';
import Table from '../../../../../../shared/Table';
import { formatDateWithDateAndYear } from '../../../../../../utils/formate.date';
import StageBadge, { StageStatuses } from './components/StagesBadge';
import ClientInfo from '../ClientInfo';
import DeadLineTimeCell from './components/DeadLineTimeCell';
import EditModal from './components/EditModal';
import { convertToHours } from '../../../../../../utils/format.time';
import AdaptiveCard from './components/AdaptiveCard';
import TextLink from '../../../../../../shared/Table/TextLink';
import useOutsideClick from '../../../../../../hooks/useOutsideClick';
import useStore from '../../../../../../hooks/useStore';
import usePagingData from '../../../../../../hooks/usePagingData';
import EditStage from '../../../../../../components/EditStage';
import { useNavigate, useParams } from 'react-router';
import TaskEditModal from '../../../../../../components/TaskModal';
import useTasksApi from '../../../../../Tasks/tasks.api';
import DescriptionInfo from '../DescriptionInfo';
import ConfirmationModal from '../../../../../../components/ConfirmationModal';
import { handleError, handleInfo } from '../../../../../../utils/snackbar';
import withTaskModalHandler from '../../../../../../components/TaskModal/HocHandler';
import { handleCopyTaskLink } from '../../../../../../utils/window.utils';

const StagesTable = observer(({ stage, onEditTask, onCreateTasks }) => {
  const { stagesStore } = useStore();
  const { tasksStore } = useStore();
  const { stageId } = useParams();
  const navigate = useNavigate();
  const api = useStageApi();
  const [taskData, setTaskData] = useState(null);
  const [editStageModalOpen, setEditStageModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  // const ref = useRef();
  const taskApi = useTasksApi();
  const fetchStages = useCallback(async (page) => {
    await api.getTaskStages(stageId, page);
  }, []);

  let {
    currentPage,
    totalPages,
    totalItems,
    paginatedData,
    itemsPerPage,
    handlePageChange,
  } = usePagingData(stagesStore, fetchStages, () => stagesStore?.getStages());

  // useEffect(() => {
  //   return () => {
  //     stage = null;
  //     stagesStore.clearCurrentStage();
  //     paginatedData = null;
  //   };
  // }, []);
  console.log(paginatedData, 'paginatedData');
  const handleEditTask = (data) => {
    setTaskData(data);
    setEditTaskModalOpen(true);
  };
  const handleCreateTask = () => {
    setTaskData(null);
    setEditTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setTaskData(null);
    setEditTaskModalOpen(false);
  };
  const handleDelete = async (id) => {
    try {
      await taskApi.deleteTask(id).then(() => api.getStageById(stage?.id));
      navigate('.');
      handleCloseTaskModal();
      handleInfo('Задача удалена');
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      handleError('Ошибка при удалении:', error);
    }
  };

  const getActions = (data) => [
    { label: 'Редактировать', onClick: () => onEditTask(data) },
    {
      label: 'Удалить',
      onClick: () => setTaskToDelete(data.id),
      disabled: data.id === 0,
    },
    {
      // link:{
      //   action: (id) => handleCopyTaskLink(id),
      //   title: 'Ссылка на задачу',
      // }
      label: 'Ссылка на задачу',
      onClick: () => handleCopyTaskLink(data.id),
    },
  ];

  const cols = React.useMemo(() => {
    return [
      {
        Header: 'Задача',
        id: 'title',
        accessor: 'title',
        width: '25%',

        Cell: ({ row }) => {
          const data = row?.original;
          return (
            <TextLink
              onClick={() => {
                onEditTask(data);
              }}
            >
              {data.title}
            </TextLink>
          );
        },
      },
      {
        Header: 'Статус задачи',
        id: 'status',
        width: '20%',
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
        id: 'responsible',
        width: '25%',
        accessor: 'responsible',
        // editing: true,
        Cell: ({ row }) => {
          const data = row?.original;
          return Array.isArray(data.executors) ? (
            data.executors.map((el) => (
              <ManagerCell
                inTable={true}
                manager={{
                  ...el,
                }}
              />
            ))
          ) : (
            <ManagerCell
              inTable={true}
              manager={{
                ...data.executors,
              }}
            />
          );
        },
      },
      {
        Header: 'Дедлайн',
        id: 'deadline',
        width: '25%',
        minWidth: '200px',

        Cell: ({ row }) => {
          const data = row?.original;
          return <span>{formatDateWithDateAndYear(data.deadline)}</span>;
        },
      },
      {
        Header: () => null,
        id: 'deadline_time',
        width: '30%',

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
    ];
  }, []);

  const tableData = useMemo(() => {
    if (!paginatedData[0]?.tasks) return [];
    return Object.values(paginatedData[0].tasks).sort(
      (a, b) => a.order - b.order,
    );
  }, [paginatedData[0]?.tasks]);

  const sumActualTime = useMemo(() => {
    if (!stage) return '';
    const sortedTasks = Object.values(stage?.tasks).sort(
      (a, b) => a.order - b.order,
    );

    const totalHours = sortedTasks.reduce(
      (sum, task) =>
        task.actualTime ? sum + (convertToHours(task.actualTime) || 0) : sum,
      0,
    );
    return totalHours + ' ч';
  }, [paginatedData[0]]);

  return (
    <div className={styles.table}>
      <Table
        isLoading={api.isLoading}
        paging={{
          current: currentPage,
          all: totalItems,
          offset: itemsPerPage,
          onPageChange: handlePageChange,
        }}
        // editComponent={(data) => <EditModal stageId={stage.id} data={data} />}
        classContainer={styles.tableContainer}
        // editComponent={(data, onClose) => <EditModal data={data} />}
        // cardComponent={(data) => (
        //   <AdaptiveCard data={data} statusType={StageStatuses.tasks} />
        // )}
        actions={getActions}
        after={
          <ClientInfo timeActual={sumActualTime} data={paginatedData[0]} />
        }
        // lastColumn = {
        //   // <DescriptionInfo label={'ТЗ'} description={stage?.taskDescription}/>
        // }
        headerActions={{
          add: {
            action: () => onCreateTasks(),
            title: 'Создать задачу',
          },
          edit: {
            action: () => setEditStageModalOpen(true),
          },
        }}
        data={tableData}
        title={`${stage.title}`}
        columns={cols}
      />
      {editTaskModalOpen && (
        <TaskEditModal
          data={taskData}
          handleClose={handleCloseTaskModal}
          stage={stage}
          stagesStore={stagesStore}
          stageApi={api}
          taskApi={taskApi}
          taskStore={tasksStore}
        />
      )}
      {taskToDelete !== null && (
        <ConfirmationModal
          isOpen={taskToDelete !== null}
          onClose={() => setTaskToDelete(null)}
          onConfirm={() => {
            handleDelete(taskToDelete).then(() => {
              setTaskToDelete(null);
            });
          }}
          label="Вы уверены, что хотите удалить задачу?"
        />
      )}
      {editStageModalOpen && (
        <EditStage
          stageId={Number(stage?.id)}
          handleClose={() => setEditStageModalOpen(false)}
        />
      )}
    </div>
  );
});

export { StagesTable };

export const StagesTableWithTasksQuery = withTaskModalHandler(StagesTable);
