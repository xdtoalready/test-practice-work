import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import useStore from '../../../hooks/useStore';
import useTasksApi from '../tasks.api';

const useTasks = (id = null, status = null) => {
  const { tasksStore } = useStore();
  const api = useTasksApi();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      if (id !== null) {
        if (!tasksStore.tasks.length) {
          await api.getTaskById(id);
        }
      } else if (status) {
        await api.getTasksByRole(status);
      } else {
        await api.getTasksByRole(status);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [tasksStore, id, api]);
  useMemo(() => {
    fetchData();
  }, [id, tasksStore]);

  const result = useMemo(() => {
    if (id !== null) {
      return tasksStore.getById(id) || api.getTaskById(id);
    } else {
      return tasksStore.getTasks();
    }
  }, [id, tasksStore.tasks, api]);

  return { data: result, isLoading, store: tasksStore };
};

export default useTasks;
