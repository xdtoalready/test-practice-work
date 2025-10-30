import React, {useContext} from 'react';
import TimeTrackingList from "../index";
import TimeTrackingInput from "../../../pages/TimeTracking/components/TimeTrackingInput";
import {handleError, handleSubmit} from "../../../utils/snackbar";
import useStore from "../../../hooks/useStore";

const TimeTrackingSection = ({
                                 timeTrackings,
                                 timeTrackingLength,
                                 taskId,
                                 entityId,
                                 tasksStore,
                                 timeTrackingApi,
    mode,
    contextStore,
    prefix
                             }) => {
    // Для businesses используем entityId, для tasks - taskId
    const trackableId = entityId || taskId;

    const updateStore = (action, timeTrackId = null, value = null) => {
        // Для business режима обновляем contextStore (calendarStore)
        if (mode === 'business') {
            switch(action) {
                case 'add':
                    contextStore.addTimeTrackToCurrentBusiness(value);
                    break;
                case 'update':
                    contextStore.updateTimeTrackInCurrentBusiness(timeTrackId, value);
                    break;
                case 'delete':
                    contextStore.deleteTimeTrackFromCurrentBusiness(timeTrackId);
                    break;
            }
        } else {
            // Для task/stage/deal режимов
            if (mode !== 'task') {
                // Создаем драфт если его нет
                if (!contextStore.drafts[entityId]) {
                    contextStore.createDraft(entityId);
                }

                switch(action) {
                    case 'add':
                        const valueKey = Object.keys(value)[0];
                        contextStore.changeById(
                            entityId,
                            `${prefix}timeTrackings.${valueKey}`,
                            value[valueKey],
                            true
                        );
                        break;

                    case 'update':
                        contextStore.changeById(
                            entityId,
                            `${prefix}timeTrackings.${timeTrackId}`,
                            value,
                            true
                        );
                        break;

                    case 'delete':
                        contextStore.changeById(
                            entityId,
                            `${prefix}timeTrackings.${timeTrackId}`,
                            null,
                            true
                        );
                        break;
                }
            }

            // Обновляем taskStore
            switch(action) {
                case 'add':
                    tasksStore.addTimeTrackToCurrentTask(value);
                    break;
                case 'update':
                    tasksStore.updateTimeTrackInCurrentTask(timeTrackId, value);
                    break;
                case 'delete':
                    tasksStore.deleteTimeTrackFromCurrentTask(timeTrackId);
                    break;
            }
        }
    };
    return (
        <>
            <TimeTrackingList
                timeTrackings={timeTrackings}
                onReset={(timeTrackId) => updateStore('reset', timeTrackId)}
                onDelete={async (timeTrackId) => {
                    try {
                        const isDeleted = await timeTrackingApi.deleteTimeTracking(timeTrackId);
                        if (isDeleted) {
                            await updateStore('delete', timeTrackId);
                            handleSubmit('Таймтрек успешно удален!');
                        }
                    } catch (error) {
                        handleError(error?.message, error);
                    }
                }}
                onSave={async (timeTrackToUpdate) => {
                    try {
                        await timeTrackingApi.updateTimeTracking(timeTrackToUpdate);
                        await updateStore('update', timeTrackToUpdate.id, timeTrackToUpdate);
                        handleSubmit('Время успешно отредактировано!');
                    } catch (error) {
                        handleError(error?.message, error);
                    }
                }}
                onEdit={(timeTrackingId, newValue) => {
                    updateStore('update', timeTrackingId, newValue);
                }}
            />
            <TimeTrackingInput
                timeTrackingsLength={timeTrackingLength}
                onSendTimeTracking={async (val) => {
                    try {


                        const result = await timeTrackingApi.sendTimeTracking(val, trackableId);
                        if (result) {
                            await updateStore('add', null, result);
                        }
                    } catch (error) {
                        handleError(error?.message, error);
                    }
                }}
            />
        </>
    );
};
export default TimeTrackingSection;