import {
  handleHttpError,
  handleHttpResponse,
  handleShowError,
  http,
  mockHttp,
  resetApiProvider,
  setMockProvider,
} from '../../shared/http';
import mocks from './tasks.mocks';
import useStore from '../../hooks/useStore';
import { mapTaskFromApi } from './tasks.mapper';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import useStageApi from '../Stages/stages.api';
import { mapStageDataToBackend } from '../Stages/stages.mapper';
import { taskStatusTypes } from '../Stages/stages.types';
import { mapCommentsFromApi } from '../Clients/clients.mapper';

mockHttp.onGet('/tasks').reply(200, mocks.createTasks());
mockHttp.onPost('/tasks').reply(200, mocks.createTasks());
mockHttp.onGet(/\/tasks\/\d+/).reply((config) => {
  const urlParts = config.url.split('/');
  const taskId = parseInt(urlParts[urlParts.length - 1]);
  const tasks = mocks.createTasks();
  const task = tasks.find((c) => c.id === taskId);

  if (task) {
    return [200, task];
  } else {
    console.log(`Task with id ${taskId} not found`);
    return [404, { message: 'Task not found' }];
  }
});

const useTasksApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { tasksStore } = useStore();
  const { stagesStore } = useStore();
  const stagesApi = useStageApi();
  const { stageId } = useParams();

  const getTasks = useCallback(() => {
    resetApiProvider();
    setIsLoading(true);
    return http
      .get('api/tasks/mine')
      .then(handleHttpResponse)
      .then((res) => {
        const mappedTasks = res.body.data.map((e) => mapTaskFromApi(e));
        tasksStore.setTasks(mappedTasks);
        return mappedTasks;
      })
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  }, []);

  const getTaskById = useCallback((id) => {
    resetApiProvider();
    return Promise.all([
      http.get(`api/tasks/${id}`),
      http.get(`/api/tasks/${id}/activities`),
    ])
      .then(([taskData, commentsData]) => {
        const mappedTask = mapTaskFromApi(
          taskData.data.data,
          commentsData.data.data,
        );
        tasksStore.setCurrentTask(mappedTask);
        return mappedTask;
      })
      .catch(handleShowError);
  }, []);

  const getTasksByRole = useCallback(async () => {
    resetApiProvider();
    setIsLoading(true);
    ;
    // Получаем все параметры из URL
    const searchParams = new URLSearchParams(window.location.search);

    // Получаем значения фильтров из URL
    const filterRole = searchParams.get('filter');
    const status = searchParams.get('status');
    const types = searchParams.get('types');
    const performerId = searchParams.get('performer');
    const creatorId = searchParams.get('creator');
    const taskableType = searchParams.get('taskable_type');
    if (
      (!filterRole || filterRole === 'all') &&
      !status &&
      !types &&
      !performerId &&
      !creatorId &&
      !taskableType
    ) {
      return http
        .get(`api/tasks/mine`, {})
        .then(handleHttpResponse)
        .then((res) => {
          const mappedTasks = res.body.data.map((e) => mapTaskFromApi(e));
          tasksStore.setTasks(mappedTasks);
          return mappedTasks;
        })
        .finally(() => setIsLoading(false));
    }
    // Если есть фильтр по роли, используем специальный endpoint
    if (filterRole && filterRole !== 'all') {
      const roleMapping = {
        creator: 'i_am_creator',
        performer: 'i_am_performer',
        responsible: 'i_am_responsible',
        auditor: 'i_am_auditor',
      };

      return http
        .get(`api/tasks/mine/${roleMapping[filterRole]}`, {})
        .then(handleHttpResponse)
        .then((res) => {
          const mappedTasks = res.body.data.map((e) => mapTaskFromApi(e));
          tasksStore.setTasks(mappedTasks);
          return mappedTasks;
        })
        .finally(() => setIsLoading(false));
    }


    // Иначе используем общий endpoint с параметрами
    return http
      .get('api/tasks', {
        params: {
          status,
          type: types,
          performer_id: performerId,
          creator_id: creatorId,
          taskable_type: taskableType,
        },
      })
      .then(handleHttpResponse)
      .then((res) => {
        const mappedTasks = res.body.data.map((e) => mapTaskFromApi(e));
        tasksStore.setTasks(mappedTasks);
        return mappedTasks;
      })
      .catch(handleShowError)
      .finally(() => setIsLoading(false));
  }, []);

  const createTask = useCallback((updateData) => {
    resetApiProvider();
    return http
      .post('/api/tasks', { ...updateData, stage_id: stageId })
      .then(handleHttpResponse)
      .then((res) => {
        const newTask = mapTaskFromApi(res.body.data);
        tasksStore.setTasks([...tasksStore.tasks, newTask]);
      })
      .then(() => stageId !== undefined && stagesApi.getStageById(stageId))
      .catch(handleShowError);
  }, []);

  const updateTask = useCallback(
    (
      id,
      updateData,
      drafts = stagesStore.drafts[stageId],
      props = stagesStore.changedProps,
    ) => {
      updateData = updateData ?? mapStageDataToBackend(drafts, props, id);

      resetApiProvider();
      return http
        .put(`/api/tasks/${id}`, updateData)
        .then(handleHttpResponse)
        .then(() => stageId !== undefined && stagesApi.getStageById(stageId))
        .catch(handleShowError);
    },
    [],
  );

  // DELETE - Удаление задачи
  const deleteTask = useCallback((id) => {
    resetApiProvider();

    return http
      .delete(`/api/tasks/${id}`)
      .then(handleHttpResponse)
      .catch(handleHttpError);
  }, []);

  // const setTasks = (body) => {
  //   return http
  //     .post('/tasks', body)
  //     .then(handleHttpResponse)
  //     .then((res) => tasksStore.setTasks(res.body))
  //
  //     .catch(handleHttpError);
  // };

  // const getTaskTypes = useCallback(() => {
  //   resetApiProvider()
  //   return http.get('/api/enums/task_types')
  //       .then(handleHttpResponse)
  //       .then((res)=>tasksStore.setTypes(res.body))
  //       .catch(handleHttpError)
  // },[])
  // if(!tasksStore.getTypes()?.length)
  //   getTaskTypes()

  const getTaskComments = useCallback((taskId) => {
    resetApiProvider();

    return http
      .get(`/api/tasks/${taskId}/activities`)
      .then(handleHttpResponse)
      .then((response) => {
        return mapCommentsFromApi(response.body.data);
      })
      .catch(handleHttpError);
  }, []);

  const searchTaskable = useCallback((query) => {
    resetApiProvider();
    setIsLoading(true);
    return http
      .get(`/api/search`, {
        params: { query },
      })
      .then(handleHttpResponse)
      .then((res) => {
        // Удаляем tasks из результатов
        const { tasks, services, ...taskableResults } = res.body;

        return taskableResults;
      })
      .catch(handleHttpError)
      .finally(() => setIsLoading(false));
  })

  return {
    isLoading,
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskComments,
    getTasksByRole,
    searchTaskable,
  };
};

export default useTasksApi;
