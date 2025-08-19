import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { taskableTypes, tasksTypes } from '../../pages/Tasks/tasks.types';
import { taskStatusTypes } from '../../pages/Stages/stages.types';
import { handleError, handleInfo } from '../../utils/snackbar';
import { mapStageDataToBackend } from '../../pages/Stages/stages.mapper';
import Modal from '../../shared/Modal';
import styles from './Modal.module.sass';
import { handleSubmit as handleSubmitSnackbar } from '../../utils/snackbar';
import TaskDescriptionPart from '../../pages/Stages/components/StagesPage/components/StagesTable/components/EditModal/components/TaskDescriptionPart';
import TaskTypePart from '../../pages/Stages/components/StagesPage/components/StagesTable/components/EditModal/components/TaskTypePart';
import Comments from '../Comments';
import FormValidatedModal from '../../shared/Modal/FormModal';
import { usePermissions } from '../../providers/PermissionProvider';
import { useLocation, useNavigate } from 'react-router';
import { UserPermissions } from '../../shared/userPermissions';
import cn from 'classnames';
import ConfirmationModal from '../ConfirmationModal';
import useParamSearch from '../../hooks/useParamSearch';
import CustomButtonContainer from '../../shared/Button/CustomButtonContainer';
import DeleteButton from '../../shared/Button/Delete';
import Icon from '../../shared/Icon';
import Loader from '../../shared/Loader';

const draftSet = new Set();

const TaskEditModal = observer(
  ({
    // Базовые пропсы
    id,
    data,
    handleClose,
    // Пропсы для режима работы со стейджами
    stage,
    stagesStore,
    stageApi,
    // Пропсы для режима работы со сделками
    deal,
    dealsStore,
    dealApi,
    // Пропсы для режима работы с тасками
    taskStore,
    taskApi,
    isLoading,
  }) => {
    const isEditMode = Boolean(data);
    const { hasPermission, permissions } = usePermissions();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const pageFrom = useParamSearch('page' ?? 1);
    console.log(data, isLoading, 'test', 'task');
    const mode = useMemo(() => {
      if (stage) return 'stage';
      if (deal) return 'deal';
      return 'task';
    }, [stage, deal]);

    // Получаем контекстные данные в зависимости от режима
    const contextData = useMemo(() => {
      switch (mode) {
        case 'stage':
          return {
            type: taskableTypes.stage,
            id: stage.id,
            title: stage.title,
            store: stagesStore,
            afterDelete: () => {
              return stageApi.getStageById(stage.id);
            },
            afterCreate: () => stageApi.getStageById(stage?.id),
          };
        case 'deal':
          return {
            type: taskableTypes.deal,
            id: deal.id,
            title: deal.title,
            store: dealsStore,
            // afterDelete:()=>dealApi.getDealById(deal?.id)
            afterDelete: () => {
              return dealApi.getDealById(deal?.id);
            },
            afterCreate: () => dealApi.getDealById(deal?.id),
          };
        default:
          return {
            type: null,
            id: null,
            title: null,
            store: taskStore,
            afterDelete: () => {
              taskStore.setCurrentTask(null);
              const newTasks = taskStore.tasks.filter(
                (el) => el.id !== taskData?.id,
              );
              taskStore.setTasks(newTasks);
            },
            afterCreate: () => {},
          };
      }
    }, [mode, stage, deal, stagesStore, dealsStore, taskStore]);

    // Начальное состояние для новой задачи
    const initialTaskState = {
      name: '',
      description: ' ',
      linked_task: '',
      type: '',
      taskStatus: taskStatusTypes.created,
      deadline: '',
      responsibles: [],
      planned_time: '',
      actual_time: '',
      performer: [],
      showInLk: true,
      auditors: [],
      related_entity: mode !== 'task' ? {
        taskable_type: contextData.type,
        id: contextData.id,
        [mode]: {
          title: contextData.title,
          id: contextData.id,
        }
      } : null,
      ...(mode !== 'task' && {
        taskable_type: contextData.type,
        taskable_id: contextData.id,
        [mode]: {
          title: contextData.title,
          id: contextData.id,
        },
      }),
    };

    useEffect(() => {
      return () => taskStore.setCurrentTask(null);
    }, []);

    const [localTask, setLocalTask] = useState(initialTaskState);

    // Получаем актуальные данные задачи в зависимости от режима
    const taskData = useMemo(() => {
      if (!isEditMode && !id) return localTask;

      if (mode !== 'task') {
        const taskFromContext = Object.values(
          contextData.store.getById(contextData.id)?.tasks,
        ).find((el) => el.id === data?.id);
        if (taskFromContext) {
          const newTaskWithTimeTracking = {
            ...taskFromContext,
            timeTrackings: taskStore.currentTask.timeTrackings,
          };
          return newTaskWithTimeTracking;
        }
      }
      return taskStore.getById(data?.id ?? Number(id));
    }, [
      isEditMode,
      localTask,
      data,
      mode,
      contextData,
      taskStore?.drafts,
      taskStore.currentTask,
      id,
    ]);
    console.log(taskData,'taskData');
    const [comments, setComments] = useState(taskData?.comments ?? {});

    const [isLoadingComments, setIsLoadingComments] = useState(false);

    const canNavigate = useMemo(
      () =>
        (mode === 'stage' && hasPermission(UserPermissions.ACCESS_SERVICES)) ||
        (mode === 'deal' && hasPermission(UserPermissions.ACCESS_DEALS)) ||
        (mode === 'task' &&
          ((taskData?.stage?.id &&
            hasPermission(UserPermissions.ACCESS_SERVICES)) ||
            (taskData?.deal?.id && hasPermission(UserPermissions.ACCESS_DEALS)))),
      [stage, deal, taskData, permissions],
    );

    const handleChange = (name, value, withId = true) => {
      if (name.includes('responsibles') && value.length) {
        value = value[0];
      }

      if (isEditMode) {
        if (mode !== 'task') {
          contextData.store.changeById(contextData.id, name, value, withId);
        } else {
          taskStore.changeById(data.id, name, value, withId);
        }
      } else {
        setLocalTask((prev) => ({
          ...prev,
          [name]: value,
        }));
        draftSet.add(name);
      }
    };

    // Обработчик сброса
    const handleReset = (path = '') => {
      if (mode !== 'task' && isEditMode) {
        contextData.store.resetDraft(contextData.id, path);
      } else if (mode === 'task' && isEditMode) {
        taskStore.resetDraft(data.id, path);
      }
      handleClose();
    };

    // Обработчик отклонения
    const handleDecline = () => {
      handleError('Задача отклонена');
      draftSet.clear();
      handleClose();
    };

    // Обработчик сохранения
    const handleSubmit = async () => {
      try {
        debugger
        if (isEditMode)
          if (mode !== 'task') {
            await taskApi
              .updateTask(
                taskData.id,
                null,
                contextData.store.drafts[contextData.id],
                contextData.store.changedProps,
              )
              .then(() => contextData.afterCreate());
            contextData.store.submitDraft(contextData.id);
          } else
            await taskApi.updateTask(
              taskData.id,
              null,
              taskStore.drafts[taskData.id],
              taskStore.changedProps,
            );
        else {
          const payload =
            mode !== 'task'
              ? {
                  ...taskData,
                  [`${mode}_id`]: contextData.id,
                  taskable_type: contextData.type,
                  taskable_id: contextData.id,
                }
              : taskData;

          await taskApi
            .createTask(mapStageDataToBackend(payload, Object.keys(payload)))
            .then(() => contextData.afterCreate());
          draftSet.clear();
        }

        handleSubmitSnackbar(
          isEditMode
            ? 'Задача успешно отредактирована'
            : 'Задача успешно создана',
        );
        handleClose();
      } catch (error) {
        console.error('Ошибка при сохранении:', error);
      }
    };

    // Получаем текст принадлежности в зависимости от режима
    const getBelongsToText = () => {
      switch (mode) {
        case 'stage':
          return `Принадлежит к: ${taskData?.stage?.title ?? stage?.title}`;
        case 'deal':
          return `Принадлежит к: ${taskData?.deal?.title ?? deal?.name}`;
        case 'task':
          return isEditMode
            ? taskData?.stage?.id || taskData?.deal?.id
              ? `Принадлежит к: ${taskData?.stage?.title ?? taskData?.deal?.title}`
              : 'Не принадлежит ни к чему'
            : '';
        default:
          return null;
      }
    };

    const handleAddComment = (newComment, value) => {
      // Сначала добавляем локально
      setComments((prev) => ({
        ...prev,
        [value.id]: value,
      }));
    };

    const handleRemoveComment = (commentId) => {
      // Удаляем комментарий локально
      setComments((prev) => {
        const updatedComments = { ...prev };
        delete updatedComments[commentId];
        return updatedComments;
      });
    };

    const loadComments = async () => {
      if (!taskData?.id) return;

      try {
        setIsLoadingComments(true);
        const taskComments = await taskApi.getTaskComments(taskData.id);
        setComments(taskComments);
      } catch (error) {
        handleError('Ошибка при загрузке комментариев');
        console.error('Error loading comments:', error);
      } finally {
        setIsLoadingComments(false);
      }
    };

    // Загружаем комментарии при первом рендере и при изменении ID задачи
    useEffect(() => {
      if (isEditMode) {
        loadComments();
      }
    }, [taskData?.id, isEditMode]);

    const handleNavigateToTaskableEntity = () => {
      // if (!canNavigate) return;
      if (!taskData) return;

      if (taskData.stage?.id) {
        if (hasPermission(UserPermissions.ACCESS_SERVICES)) {
          navigate(taskData.stage?.link);
        }
      } else if (taskData.deal?.id) {
        if (hasPermission(UserPermissions.ACCESS_DEALS)) {
          navigate(`/deals/${taskData.deal.id}`);
        }
      }
    };

    const handleDeleteTask = async () => {
      try {
        await taskApi.deleteTask(taskData?.id, pageFrom).then(() => {
          contextData.afterDelete();
        });
        handleInfo('Задача удалена');

        handleClose();
        navigate(location.pathname);
      } catch (e) {
        handleInfo('Ошибка при удалении задача:', e);
      }
    };

    const handleCopyTask = () => {
      navigator.clipboard
        .writeText(`${window.location.origin}/tasks?taskId=${taskData?.id}`)
        .then((r) => handleInfo('Ссылка на задачу скопирована!'));
    };
    //
    // if (isLoading){
    //   return <FormValidatedModal
    //       size={mode !== 'task' ? 'lg' : 'md_up'}>
    //     <Loader/>
    //   </FormValidatedModal>
    // }

    useEffect(() => {
      return () => {
        taskStore.setCurrentTask(null);
      };
    }, []);
    return (
      taskData && (
        <>
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteTask}
            label="Вы уверены, что хотите удалить задачу?"
          />
          <FormValidatedModal
            handleClose={handleReset}
            handleSubmit={handleSubmit}
            customButtons={
              isEditMode && (
                <CustomButtonContainer>
                  <DeleteButton
                    handleDelete={() => setIsDeleteModalOpen(true)}
                    label={'Удалить задачу '}
                  />
                </CustomButtonContainer>
              )
            }
            size={'md_up'}
          >
            <div className={styles.name}>
              <div>
                {isEditMode ? `Задача#${taskData?.id} ${taskData?.createdAt}` : 'Создание задачи'}
                {isEditMode && (
                  <Icon
                    size={20}
                    onClick={() => handleCopyTask()}
                    className={styles.copy}
                    name={'copy'}
                  />
                )}
              </div>
              {
                <span
                  onClick={handleNavigateToTaskableEntity}
                  className={cn(styles.entityLink, {
                    // [styles.clickable]: canNavigate,
                  })}
                >
                  {getBelongsToText() ?? ''}
                </span>
              }
            </div>
            <div className={styles.gridContainer}>
              <TaskDescriptionPart
                mode={mode}
                isEditMode={isEditMode}
                isLoading={isLoading}
                selectedStatus={taskData.taskStatus}
                prefix={
                  isEditMode && mode !== 'task' ? `tasks.${taskData.id}.` : ''
                }
                handleSave={() => handleSubmit('Задача принята')}
                handleDecline={handleDecline}
                className={styles.taskDescription}
                data={taskData}
                handleChange={handleChange}
              />
              {isEditMode && (
                <div className={styles.comments}>
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <Comments
                      inTask={true}
                      mode={mode}
                      contextStore={contextData.store}
                      timeTrackings={taskData?.timeTrackings}
                      onDelete={(commentId) =>
                        taskApi
                          .getTaskById(data?.id)
                          .then(() => handleRemoveComment(commentId))
                      }
                      belongsTo={'tasks'}
                      entityId={taskData.id}
                      comments={comments}
                      prefix={
                        isEditMode && mode !== 'task'
                          ? `tasks.${taskData.id}.`
                          : ''
                      }
                      onChange={handleAddComment}
                      isLoading={isLoading}
                    />
                  )}
                </div>
              )}
              <TaskTypePart
                showInLk={taskData.showInLk}
                isEditMode={isEditMode}
                types={Object.keys(tasksTypes)}
                className={styles.taskType}
                data={
                  Array.isArray(taskData.responsibles)
                    ? taskData
                    : { ...taskData, responsibles: [taskData.responsibles] }
                }
                handleAdd={(name, payload) => {
                  const fieldName =
                    isEditMode && mode !== 'task'
                      ? `tasks.${data.id}.${name}`
                      : name;
                  handleChange(fieldName, payload, false);
                }}
                handleChange={(name, value, withId) => {
                  const fieldName =
                    isEditMode && mode !== 'task'
                      ? `tasks.${data.id}.${name}`
                      : name;
                  handleChange(fieldName, value, withId);
                }}
              />
            </div>
          </FormValidatedModal>
        </>
      )
    );
  },
);

export default TaskEditModal;
