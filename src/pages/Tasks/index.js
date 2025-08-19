import React, { useMemo, useState } from 'react';
import TasksTable from './components/TasksTable';
import Title from '../../shared/Title';
import TaskFilter from './components/TaskFilter';
import useStore from '../../hooks/useStore';
import useTasksByStatus from './hooks/useTasksByStatus';
import { observer } from 'mobx-react';
import { taskStatusTypes } from '../Stages/stages.types';
import styles from './tasks.module.sass';
import { LoadingProvider } from '../../providers/LoadingProvider';
import useTasksApi from './tasks.api';
import TaskEditModal from '../../components/TaskModal';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import withTaskModalHandler from '../../components/TaskModal/HocHandler';
import { createTaskFilters } from './tasks.filter.conf';
import { FiltersProvider } from '../../providers/FilterProvider';
import useAppApi from '../../api';

const filters = [
  { label: 'Все', value: 'all' },
  { label: 'Я - Создатель', value: 'creator' },
  { label: 'Я - Исполнитель', value: 'performer' },
  { label: 'Я - Ответственный', value: 'responsible' },
  { label: 'Я - Аудитор', value: 'auditor' },
];

const Tasks = observer(({ onEditTask, onCreateTasks }) => {
  const api = useTasksApi();
  const appApi = useAppApi();
  const [searchParams, setSearchParams] = useSearchParams();

  // Получаем значение фильтра из URL или используем значение по умолчанию
  const initialFilter = searchParams.get('filter') || 'all';
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const { data, isLoading, store: tasksStore } = useTasksByStatus(statusFilter);

  const handleFilterChange = async (filters) => {
    const filterValue = filters?.filter;
    // if (filterValue === 'all') {
    //   await api.getTasks();
    // } else {

    await api.getTasksByRole(filters).catch(() => console.log());
    // }
  };

  const getCountStatusTask = (type) => {
    const tasks = data.filter((task) => task.type === type)[0];
    return tasks.values.length;
  };

  const handleChange = (taskId, newStatus) => {
    tasksStore.changeById(taskId, `taskStatus`, newStatus, true);
    api.updateTask(taskId, { status: newStatus });
  };

  const filteredTasks = data;

  const taskCounts = useMemo(() => {
    return Object.keys(taskStatusTypes).reduce((acc, status) => {
      acc[status] = getCountStatusTask(status);
      return acc;
    }, {});
  }, [data]);

  return (
    <FiltersProvider>
      <LoadingProvider isLoading={api.isLoading}>
        <Title
          title={'Мои задачи'}
          actions={{
            add: {
              action: onCreateTasks,
              title: 'Создать задачу',
            },
            filter: {
              // classNameBody: styles.filter_container,
              title: 'Фильтр',
              config: createTaskFilters(appApi),
              onChange: handleFilterChange,
            },
          }}
        />
        <TasksTable
          onClick={(data) => onEditTask(data)}
          counts={taskCounts}
          data={filteredTasks}
          handleChange={handleChange}
        />
      </LoadingProvider>
    </FiltersProvider>
  );
});

const TasksPageWithHoc = withTaskModalHandler(Tasks);

const TasksWithQuery = () => {
  const api = useTasksApi();
  const { tasksStore } = useStore();

  return <TasksPageWithHoc taskApi={api} taskStore={tasksStore} />;
};

export { Tasks, TasksWithQuery };
