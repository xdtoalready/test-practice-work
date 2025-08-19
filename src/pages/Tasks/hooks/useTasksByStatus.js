import { useEffect, useMemo, useState } from 'react';
import useStore from '../../../hooks/useStore';
import useTasks from './useTasks';
import {
  colorStatusTaskTypesForTaskList,
  taskStatusTypes,
  taskStatusTypesRu,
} from '../../Stages/stages.types';

const useTasksByStatus = (statusFilter) => {
  const { data: data, isLoading } = useTasks(
    null,
    statusFilter !== 'all' ? statusFilter : null,
  );
  const { tasksStore } = useStore();

  const statusedTasks = useMemo(() => {
    const filteredData = Object.values(taskStatusTypes).map((status) => {
      return {
        type: status,
        typeRu: taskStatusTypesRu[status],

        values: data.filter((task) => task.taskStatus === status),
        color: { color: colorStatusTaskTypesForTaskList[status].class },
      };
    });
    return filteredData;
  }, [data]);

  return { data: statusedTasks, isLoading, store: tasksStore };
};

export default useTasksByStatus;
