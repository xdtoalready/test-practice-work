import TaskEditModal from './index';
import { observer } from 'mobx-react';
import { useLocation, useNavigate } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { handleError } from '../../utils/snackbar';
import { useSearchParams } from 'react-router-dom';
import { getSearchParamsFromLocation } from '../../utils/create.utils';
import useQueryParam from '../../hooks/useQueryParam';
import { getQueryParam } from '../../utils/window.utils';

const withTaskModalHandler = (WrappedComponent) => {
  return observer(
    ({
      taskStore,
      taskApi,
      stage = null,
      stagesStore = null,
      stageApi = null,
      deal = null,
      dealsStore = null,
      dealApi = null,
      ...props
    }) => {
      const [searchParams, setSearchParams] = useSearchParams();
      const [isLoading,setIsLoading] = useState(false);
      const [taskData, setTaskData] = useState(null);
      const [isModalOpen, setIsModalOpen] = useState(false);
      // const

      const updateSearchParams = useCallback(
        (updates) => {
          const newSearchParams = new URLSearchParams(searchParams);
          const currentPage = getQueryParam('page', 1);
          // Preserve the current page
          // if (currentPage && currentPage !== '1') {
          //   newSearchParams.set('page', currentPage);
          // }

          stage && newSearchParams.set('page', currentPage);

          // Apply updates
          Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
              newSearchParams.delete(key);
            } else {
              newSearchParams.set(key, value);
            }
          });

          setSearchParams(newSearchParams, { replace: true });
        },
        [searchParams, setSearchParams],
      );

      // Загрузка данных задачи
      const loadTaskData = async (taskId) => {
          try {
              setIsLoading(true);
              const task = await taskApi.getTaskById(taskId);
              setTaskData(task);
          } catch (error) {
              console.error('Error loading task:', error);
              handleError('Ошибка при загрузке задачи');
          } finally {
              setIsLoading(false);
          }
      };

      // Обработка taskId из URL при монтировании
      useEffect(() => {
          const taskId = searchParams.get('taskId');
          if (taskId) {
              setIsModalOpen(true);
              loadTaskData(taskId);
          }
        // const handleTaskFromUrl = async () => {
        //   const taskId = searchParams.get('taskId');
        //   if (!taskId) return;
        //
        //   const task = await loadTaskData(taskId);
        //   if (task) {
        //     setTaskData(task);
        //     setIsModalOpen(true);
        //   }
        // };
        //
        // handleTaskFromUrl();

      }, [searchParams.get('taskId')]);

        const handleEditTask = (task) => {
            if (!task) {
                setTaskData(null);
                setIsModalOpen(true);
                return;
            }

            setIsModalOpen(true);
            updateSearchParams({ taskId: task.id.toString() });
            loadTaskData(task.id);
        };
      // const handleEditTask = async (task) => {
      //   if (!task) {
      //     setTaskData(null);
      //     setIsModalOpen(true);
      //     return;
      //   }
      //
      //
      //
      //   const taskId = task.id;
      //
      //   const loadedTask = await loadTaskData(taskId);
      //
      //   if (loadedTask) {
      //     setTaskData(loadedTask);
      //     setIsModalOpen(true);
      //     updateSearchParams({ taskId: taskId.toString() });
      //   }
      // };
      //
      // const handleCloseModal = () => {
      //   setTaskData(null);
      //   setIsModalOpen(false);
      //   updateSearchParams({ taskId: null });
      // };
        const handleCloseModal = () => {
            setTaskData(null);
            setIsLoading(false);
            setIsModalOpen(false);
            updateSearchParams({ taskId: null });
        };

      const handleCreateTask = () => {
        setTaskData(null);
        setIsModalOpen(true);
      };
      console.log(isModalOpen, 'isModalOpen', taskData, taskStore);
      return (
        <>
          <WrappedComponent
            {...props}
            deal={deal}
            stage={stage}
            onEditTask={handleEditTask}
            onCreateTasks={handleCreateTask}
          />
          {isModalOpen && (
            <TaskEditModal
                id={searchParams.get('taskId')}
                isLoading={isLoading}
              data={taskData}
              handleClose={handleCloseModal}
              stage={stage}
              stagesStore={stagesStore}
              stageApi={stageApi}
              deal={deal}
              dealsStore={dealsStore}
              dealApi={dealApi}
              taskStore={taskStore}
              taskApi={taskApi}
            />
          )}
        </>
      );
    },
  );
};

export default withTaskModalHandler;
