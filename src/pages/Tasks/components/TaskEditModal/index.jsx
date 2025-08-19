import {observer} from "mobx-react";
import useStages from "../../../Stages/hooks/useStages";
import React, {useCallback, useMemo, useState} from "react";
import useStageApi from "../../../Stages/stages.api";
import {handleError,handleSubmit as handleSubmitSnackbar,} from "../../../../utils/snackbar";
import Modal from "../../../../shared/Modal";
import TaskDescriptionPart
    from "../../../Stages/components/StagesPage/components/StagesTable/components/EditModal/components/TaskDescriptionPart";
import TaskTypePart
    from "../../../Stages/components/StagesPage/components/StagesTable/components/EditModal/components/TaskTypePart";
import CommentsList from "../../../../components/CommentsList";
import TextInput from "../../../../shared/TextInput";
import styles from '../../../Stages/components/StagesPage/components/StagesTable/components/EditModal/Modal.module.sass';
import taskStyles from '../../../Stages/components/StagesPage/components/StagesTable/components/EditModal/components/TaskDescriptionPart/Description.module.sass';
import useTasks from "../../hooks/useTasks";
import cn from "classnames";
import useTasksApi from "../../tasks.api";
import {tasksTypes} from "../../tasks.types";

const EditTaskModal = observer(({ data, handleClose }) => {
    const { store: taskStore } = useTasks(data.id);
    const task = useMemo(
        () => taskStore.getById(data.id),
        [
            data.id,
            taskStore.tasks,
            taskStore.drafts,
        ],
    );

    const [isOpened, setOpened] = useState(true);
    const api = useTasksApi();
    const handleChange = (name, payload, withId = true) => {
        taskStore.changeById(data.id, name, payload, withId);
    };
    const handleReset = useCallback((path = '') => {
        taskStore.resetDraft(data.id, path);
    }, []);

    const handleDecline = () => {
        handleError('Задача отклонена');
        setOpened(false);
        handleClose && handleClose(null);
    };

    const handleSubmit = useCallback((text) => {
        handleSubmitSnackbar(text ?? 'Задача успешно отредактирована');
        taskStore.submitDraft(data.id);
        setOpened(false);
        handleClose && handleClose(null);
    }, []);
    return (
        task &&
        isOpened && (
            <Modal
                handleClose={() => handleClose && handleClose(null)}
                handleSubmit={() => handleSubmit()}
                size={'md_up'}
                // stageId={stageId}
            >
                <div className={styles.name}>
                    {'Редактирование задачи'}
                </div>
                <div className={styles.gridContainer}>
                    <TaskDescriptionPart
                        prefix={''}
                        selectedStatus={task.taskStatus}
                        handleSave={() => handleSubmit('Задача принята')}
                        handleDecline={() => handleDecline()}
                        className={styles.taskDescription}
                        data={task}
                        handleChange={(name, value, withId) =>
                            handleChange(name, value, withId)
                        }
                    />
                    <TaskTypePart
                      showInLk={task.showInLk}
                        types={Object.keys(tasksTypes)}
                        className={styles.taskType}
                        data={task}

                        handleAdd={(name, payload) => {
                            handleChange(`${name}`, payload, false);
                        }}
                        handleChange={(name, value, withId) =>
                            handleChange(`${name}`, value, true)
                        }

                    />
                    {/*<CommentComponent*/}
                    {/*    className={styles.comment}*/}
                    {/*    data={task}*/}
                    {/*    handleChange={(name, value, withId) =>*/}
                    {/*        handleChange(name, value, withId)*/}
                    {/*    }*/}
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

export default EditTaskModal;
