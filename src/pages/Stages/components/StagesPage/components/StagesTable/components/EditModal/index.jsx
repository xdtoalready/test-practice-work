import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { observer } from 'mobx-react';
import useStages from '../../../../../../hooks/useStages';
import {
  handleError,
  handleSubmit as handleSubmitSnackbar,
} from '../../../../../../../../utils/snackbar';
import useStageApi from '../../../../../../stages.api';
import Modal from '../../../../../../../../shared/Modal';
import TaskDescriptionPart from './components/TaskDescriptionPart';
import TaskTypePart from './components/TaskTypePart';
import Button from '../../../../../../../../shared/Button';
import styles from './Modal.module.sass';
import TextInput from '../../../../../../../../shared/TextInput';
import cn from 'classnames';
import CommentsList from '../../../../../../../../components/CommentsList';
import taskStyles from './components/TaskDescriptionPart/Description.module.sass';
import { tasksTypes } from '../../../../../../../Tasks/tasks.types';
import { useNavigation, useParams } from 'react-router';
import useTasksApi from '../../../../../../../Tasks/tasks.api';
import { mapStageDataToBackend } from '../../../../../../stages.mapper';
import {
  colorStatusTaskTypes,
  taskStatusTypes,
} from '../../../../../../stages.types';
import { usePermissions } from '../../../../../../../../providers/PermissionProvider';
const draftSet = new Set();

const EditModal = observer(({ stage, data, handleClose }) => {
  const { id: stageId, title: stageName } = stage;
  const { store: stagesStore } = useStages(stageId);
  const { id: serviceId } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [localTask, setLocalTask] = useState({
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
    show_at_client_cabinet: false,
    auditors: [],
    stage: {
      title: stageName,
      id: stageId,
    },
  });
  const stageTask = useMemo(
    () =>
      isEditMode
        ? Object.values(stagesStore.getById(stageId)?.tasks).find(
            (el) => el.id === data?.id,
          )
        : localTask,
    [
      isEditMode,
      localTask,
      stagesStore.stages,
      stageId,
      stagesStore.currentStage,
      stagesStore.drafts,
    ],
  );

  const { hasPermission } = usePermissions();
  const navigate = useNavigation();

  useEffect(() => {
    if (data) {
      setIsEditMode(true); // Режим редактирования
    } else {
      setIsEditMode(false); // Режим создания
    }
  }, [data]);
  const api = useStageApi();
  const taskApi = useTasksApi();

  // const handleChange = (name, payload, withId = true) => {
  //   stagesStore.changeById(stageId, name, payload, withId);
  // };
  const handleChange = (name, value, withId = true) => {
    if (name.includes('responsibles')) {
      value = value[0];
    }
    if (isEditMode) {
      stagesStore.changeById(stageId, name, value, withId);
    } else {
      setLocalTask((prev) => ({
        ...prev,
        [name]: value,
      }));
      draftSet.add(name);
    }
  };
  const handleReset = (path = '') => {
    stagesStore.resetDraft(stageId, path);
    handleClose();
  };

  const handleDecline = () => {
    handleError('Задача отклонена');
    handleClose && handleClose(null);
    draftSet.clear();
  };

  // const handleSubmit = useCallback((text) => {
  //   handleSubmitSnackbar(text ?? 'Задача успешно отредактирована');
  //   stagesStore.submitDraft(stageId);
  //   api.setStages(stagesStore.stages);
  //   handleClose && handleClose(null);
  // }, []);

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await taskApi.updateTask(stageTask.id, null); // Обновляем услугу
      } else {
        await taskApi.createTask(
          mapStageDataToBackend(
            { ...stageTask, stage_id: localTask.stage_id },
            draftSet,
          ),
        ); // Создаем новую услугу
        draftSet.clear();
      }
      handleSubmitSnackbar(
        isEditMode
          ? 'Услуга успешно отредактирована'
          : 'Услуга успешно создана',
      );
      handleClose(null); // Закрываем модалку
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
    }
  };

  const handleNavigateToTaskableEntity = () => {
    hasPermission();
  };

  return (
    stageTask && (
      <Modal
        handleClose={handleReset}
        handleSubmit={() => handleSubmit()}
        size={'lg'}
        stageId={stageId}
      >
        <div className={styles.name}>
          <div>{isEditMode ? 'Редактирование задачи' : 'Создание задачи'}</div>
          <span onClick={handleNavigateToTaskableEntity}>
            Принадлежит к {stageTask?.stage?.title}
          </span>
        </div>
        <div className={styles.gridContainer}>
          <TaskDescriptionPart
            selectedStatus={stageTask.taskStatus}
            prefix={isEditMode ? `tasks.${stageTask.id}.` : ''}
            handleSave={() => handleSubmit('Задача принята')}
            handleDecline={() => handleDecline()}
            className={styles.taskDescription}
            data={stageTask}
            handleChange={(name, value, withId) =>
              handleChange(name, value, withId)
            }
          />
          <TaskTypePart
            showInLk={false}
            types={Object.keys(tasksTypes)}
            className={styles.taskType}
            data={
              Array.isArray(stageTask.responsibles)
                ? stageTask
                : { ...stageTask, responsibles: [stageTask.responsibles] }
            }
            handleAdd={(name, payload) => {
              handleChange(
                isEditMode ? `tasks.${data.id}.${name}` : name,
                payload,
                false,
              );
            }}
            handleChange={(name, value, withId) =>
              handleChange(
                isEditMode ? `tasks.${data.id}.${name}` : name,
                value,
                true,
              )
            }
          />
          {/*<CommentComponent*/}
          {/*  className={styles.comment}*/}
          {/*  data={stageTask}*/}
          {/*  handleChange={(name, value, withId) =>*/}
          {/*    handleChange(name, value, withId)*/}
          {/*  }*/}
          {/*/>*/}
        </div>
      </Modal>
    )
  );
});

const CommentComponent = ({
  handleChange,
  data: { comment, comments, id },
}) => {
  return (
    <div>
      <div className={taskStyles.border_container_comment}>
        <TextInput
          onChange={({ target }) => handleChange(target.name, target.value)}
          name={`tasks.${id}.comment`}
          value={comment}
          rows={6}
          edited={true}
          type={'textarea'}
          className={cn(taskStyles.input, taskStyles.textarea)}
          label={<span className={taskStyles.label_bold}>Комментарии</span>}
        />
      </div>
      <CommentsList cls={styles.comment_list} comments={comments} />
    </div>
  );
};

export default EditModal;
