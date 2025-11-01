import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import styles from './index.module.sass';
import cn from 'classnames';
import {
  businessTypes,
  businessTypesRu,
} from '../../pages/Calendar/calendar.types';
import FormValidatedModal from '../../shared/Modal/FormModal';
import ConfirmationModal from '../ConfirmationModal';
import TextInput from '../../shared/TextInput';
import Dropdown from '../../shared/Dropdown/Default';
import Comments from '../Comments';
import useStore from '../../hooks/useStore';
import useCalendarApi from '../../pages/Calendar/calendar.api';
import { handleSubmit as handleSubmitSnackbar } from '../../utils/snackbar';
import TypeSelector from './ui/TypeSelector';
import Icon from '../../shared/Icon';
import Calendar from '../../shared/Datepicker';
import ValuesSelector from '../../shared/Selector';
import useMembers from '../../pages/Members/hooks/useMembers';
import TimeDropdown from '../TimeDropdown';
import Loader from '../../shared/Loader';
import TextLink from '../../shared/Table/TextLink';
import Switch from '../../shared/Switch';
import { UserPermissions } from '../../shared/userPermissions';
import { usePermissions } from '../../providers/PermissionProvider';
import { useNavigate } from 'react-router';
import Tooltip from '../../shared/Tooltip';
import { mapTimeTrackingsFromApi } from '../../pages/TimeTracking/timeTracking.mapper';

const CalendarModal = observer(
  ({
    businessId,
    data,
    onClose,
    // Получаем различные сторы и API как пропсы
    // Пропсы для режима работы с календарем

    calendarStore,
    calendarApi,
    // Пропсы для режима работы с клиентами
    client,
    clientStore,
    clientApi,
    // Пропсы для режима работы со сделками
    deal,
    dealStore,
    dealApi,
    ...rest
  }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(!!businessId);
    const [comments, setComments] = useState([]);
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);
    const navigate = useNavigate();
    const { members } = useMembers();
    const { tasksStore } = useStore();
    const defaultApiHook = useCalendarApi(); // Используем как fallback

    // Создаем обертку для business timeTracking API
    const businessTimeTrackingApi = useMemo(() => ({
      sendTimeTracking: (timeTracking, businessId) => {
        return defaultApiHook.sendBusinessTimeTracking(timeTracking, businessId)
          .then((data) => mapTimeTrackingsFromApi([data]));
      },
      updateTimeTracking: (timeTrackToUpdate) => {
        return defaultApiHook.updateBusinessTimeTracking(timeTrackToUpdate)
          .then((data) => mapTimeTrackingsFromApi([data])[Object.keys(mapTimeTrackingsFromApi([data]))[0]]);
      },
      deleteTimeTracking: defaultApiHook.deleteBusinessTimeTracking,
    }), [defaultApiHook]);

    // Определяем текущий режим работы компонента
    const mode = useMemo(() => {
      if (clientStore && client) return 'client';
      if (dealStore && deal) return 'deal';
      return 'calendar';
    }, [calendarStore, clientStore, dealStore]);

    // Initial state for a new business item
    const [localBusiness, setLocalBusiness] = useState({
      name: '',
      description: '',
      type: businessTypes.business,
      participants: [],
      client: null,
      startDate: rest?.startDate ?? null,
      endDate: rest?.endDate ?? new Date(),
      startTime: rest?.startTime ?? null,
      endTime: rest?.endTime ?? null,
      performer: null,
      service: null,
      reminders: [],
      relatedEntity: null,
    });

    // Получаем контекстные данные в зависимости от режима
    const contextData = useMemo(() => {
      switch (mode) {
        case 'client':
          return {
            id: client.id,
            store: clientStore,
            api: clientApi,
          };
        case 'deal':
          return {
            store: dealStore,
            api: dealApi,
            id: deal.id,
            // afterDelete: () => dealApi.getDealById(businessId),
            // afterCreate: () => dealApi.getDealById(businessId),
          };
        default:
          return {
            id: null,
            afterDelete:(id)=>{
              calendarStore?.setBusinesses(calendarStore?.businesses.filter(el=>el.id !== id))
            },
            store: calendarStore,
            api: calendarApi,
          };
      }
    }, [mode, calendarStore, clientStore, dealStore, businessId]);
    // Determine the business data - either from store or initial state
    const business = useMemo(() => {
      if (!isEditMode && !businessId) return localBusiness;
      if (mode !== 'calendar') {
        const businessFromContext = Object.values(
          contextData.store.getById(contextData.id)?.businesses,
        ).find((el) => el.id === data?.id);
        if (businessFromContext) {
          const newTaskWithTimeTracking = {
            ...businessFromContext,
            timeTrackings: calendarStore?.currentBussiness?.timeTrackings || data.timeTrackings,
          };
          return newTaskWithTimeTracking;
        }
      }

      return calendarStore?.getById(data?.id ?? Number(businessId));
    }, [
      isEditMode,
      businessId,
      localBusiness,
      contextData?.store?.drafts,
      calendarStore?.currentBussiness,
      calendarStore?.drafts,
      data,
    ]);

    const [selectedType, setSelectedType] = useState(
      isEditMode && businessId
        ? business?.type || businessTypes.business
        : localBusiness.type || businessTypes.business,
    );

    // Effect to set edit mode
    useEffect(() => {
      setIsEditMode(!!businessId);
    }, [businessId]);

    useEffect(() => {
      if (business && business.type) {
        setSelectedType(business.type);
      }
    }, [business?.type]);

    useEffect(() => {
      const loadBusiness = async () => {
        if (isEditMode && businessId && mode === 'calendar') {
          try {
            await defaultApiHook.getBusinessById(businessId);
          } catch (error) {
            console.error('Error loading business:', error);
          }
        }
      };
      loadBusiness();
    }, [isEditMode, businessId, mode]);

    useEffect(() => {
      const loadComments = async () => {
        setIsCommentsLoading(true);
        try {
          const commentsData =
            await defaultApiHook.getBusinessComments(businessId);
          setComments(commentsData);
        } catch (error) {
          console.error('Error loading comments:', error);
        } finally {
          setIsCommentsLoading(false);
        }
      };
      if (isEditMode && businessId) {
        loadComments();
      }
    }, [isEditMode, businessId, contextData.api]);

    useEffect(() => {
      return () => calendarStore?.setCurrentBussiness(null);
    }, [calendarStore]);

    const handleAddComment = async (text) => {
      if (!text.trim()) return;

      try {
        const newComment = await contextData.api.addBusinessComment(
          businessId,
          text,
        );
        setComments((prev) => [...prev, newComment]);
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    };

    const handleRemoveComment = (commentId) => {
      // Удаляем комментарий локально
      setComments((prev) => {
        const updatedComments = { ...prev };
        delete updatedComments[commentId];
        return updatedComments;
      });
    };

    const handleCommentChange = (key, value) => {
      setComments((prevComments) => ({
        ...prevComments,
        [key.replace(`businesses.${businessId}.comments.`, '')]: value,
      }));
    };

    // Handle changes to business item
    const handleChange = (name, value, withId = true) => {
      if (['startTime', 'endTime'].includes(name) && value === null) {
        return;
      }

      if (name === 'startTime' && business.startDate) {
        const dateWithTime = new Date(business.startDate);
        const [hours, minutes] = value?.split(':')?.map(Number);
        dateWithTime.setHours(hours, minutes, 0);

        if (isEditMode) {
          contextData.store.changeById(
            businessId,
            'startDate',
            dateWithTime,
            withId,
          );
          contextData.store.changeById(businessId, name, value, withId);
        } else {
          setLocalBusiness((prev) => ({
            ...prev,
            startDate: dateWithTime,
            [name]: value,
          }));
        }
        return;
      }

      if (name === 'endTime' && business.endDate) {
        const dateWithTime = new Date(business.endDate);
        const [hours, minutes] = value.split(':').map(Number);
        dateWithTime.setHours(hours, minutes, 0);

        if (isEditMode) {
          if (mode !== 'calendar') {
            contextData.store.changeById(
              contextData.id,
              'endDate',
              dateWithTime,
              withId,
            );
            contextData.store.changeById(contextData.id, name, value, withId);
          } else {
            calendarStore?.changeById(data.id, 'endDate', dateWithTime, withId);
            calendarStore?.changeById(data.id, name, value, withId);
          }
        } else {
          setLocalBusiness((prev) => ({
            ...prev,
            endDate: dateWithTime,
            [name]: value,
          }));
        }
        return;
      }

      if (isEditMode) {
        if (mode !== 'calendar') {

          contextData.store.changeById(contextData.id, name, value, withId);
        } else {
          calendarStore?.changeById(data.id, name, value, withId);
        }
      } else {
        setLocalBusiness((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    };

    // Handle form submission
    const handleSubmit = async (onError = null) => {


      try {
        if (isEditMode) {
          await contextData.api.updateBusiness(
            businessId,
            business,
            contextData.store.changedProps,
            contextData.id,
          );
          contextData.store.submitDraft &&
            contextData.store.submitDraft(contextData.id);
        } else {
          await contextData.api.createBusiness(business, contextData.id);
        }

        handleSubmitSnackbar(
          isEditMode ? 'Дело успешно отредактировано' : 'Дело успешно создано',
        );

        // Вызываем afterCreate или afterDelete, если они определены
        if (isEditMode && contextData.afterCreate) {
          await contextData.afterCreate();
        }

        onClose();
      } catch (error) {
        console.error('Error saving business:', error);
        onError && onError();
      }
    };

    // Handle form reset/cancel
    const handleReset = (path = '') => {
      if (mode !== 'calendar' && isEditMode) {
        contextData.store.resetDraft(contextData.id, path);
      } else if (mode === 'calendar' && isEditMode) {
        calendarStore?.resetDraft(data.id, path);
      }
      onClose();
    };

    // Handle business deletion
    const handleDeleteBusiness = async () => {
      try {
        await contextData.api.deleteBusiness(businessId);

        // Вызываем afterDelete, если он определен
        if (contextData.afterDelete) {
          await contextData.afterDelete(Number(businessId));
        }

        onClose();
      } catch (error) {
        console.error('Error deleting business:', error);
      }
    };

    const prefix = useMemo(() => {
      return mode !== 'calendar' && isEditMode
        ? `businesses.${businessId}.`
        : '';
    }, [deal, client, data]);

    const getBelongsToText = () => {
      // switch (mode) {
      //   case 'client':
      //     return `Принадлежит к: ${business?.client?.title ?? client?.name}`;
      //   case 'deal':
      //     return `Принадлежит к: ${business?.deal?.title ?? deal?.name}`;
      //   default:
      //     return 'Не принадлежит ни к чему';
      // }
      if (!isEditMode) return '';
      return business?.relatedEntity
        ? `Принадлежит к: ${business?.relatedEntity?.name ?? ''}`
        : 'Не принадлежит ни к чему';
    };

    const { hasPermission, permissions } = usePermissions();

    const canNavigate = useMemo(() => {
      return (
        (mode === 'client' && hasPermission(UserPermissions.ACCESS_COMPANIES)) ||
        (mode === 'deal' && hasPermission(UserPermissions.ACCESS_DEALS)) ||
        (mode === 'calendar' &&
          ((business?.client?.id &&
            hasPermission(UserPermissions.ACCESS_COMPANIES)) ||
            (business?.deal?.id && hasPermission(UserPermissions.ACCESS_DEALS))))
      );
    }, [client, deal, business, permissions]);

    const handleNavigateToTaskableEntity = () => {
      // if (!canNavigate) return;
      if (!business) return;

      if (business.client?.id) {
        if (hasPermission(UserPermissions.ACCESS_COMPANIES)) {
          navigate(`/clients/${business.client.id}`);
        }
      } else if (business.deal?.id) {
        if (hasPermission(UserPermissions.ACCESS_DEALS)) {
          navigate(`/deals/${business.deal.id}`);
        }
      }
    };

    return (
      <>
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteBusiness}
          label="Вы уверены, что хотите удалить дело?"
        />

        <FormValidatedModal
          handleClose={handleReset}
          handleSubmit={handleSubmit}
          customButtons={
            isEditMode && (
              <div className={styles.addButtons}>
                <DeleteButton handleDelete={() => setIsDeleteModalOpen(true)} />
              </div>
            )
          }
          size={'md_up'}
        >
          <div className={styles.name}>
            <div className={styles.flexBusiness}>
              {isEditMode ? `Редактирование дела` : 'Создание дела'}
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
            <div className={styles.border_container}>
              <TextInput
                required={true}
                name={`${prefix}name`}
                value={business?.name}
                onChange={({ target }) =>
                  handleChange(target.name, target.value)
                }
                label={'Название'}
                className={styles.input}
              />

              <TextInput
                type={'editor'}
                name={`${prefix}description`}
                value={business?.description}
                onChange={({ target }) =>
                  handleChange(target.name, target.value)
                }
                label={'Описание'}
                rows={4}
                className={styles.input}
              />

              {mode === 'calendar' && (
                <div
                  style={{ zIndex: 53 }}
                  className={cn(styles.flex, styles.addZIndex)}
                >
                  <ValuesSelector
                    name={`${prefix}relatedEntity`}
                    placeholder={'Привязать к...'}
                    onChange={(e) => {

                      if (e.length) {
                        const selected = e[0];
                        // Формируем объект связанной сущности в нужном формате
                        const relatedEntity = {
                          id: selected.value,
                          name: selected.name,
                          type: selected.type,
                        };
                        handleChange(`${prefix}relatedEntity`, relatedEntity);
                      } else {
                        handleChange(`${prefix}relatedEntity`, null);
                      }
                    }}
                    isMulti={false}
                    label="Привязать к: "
                    isAsync
                    // required={true}
                    asyncSearch={async (query) => {
                      if (query.length < 3) return [];
                      const response =
                        await calendarApi.searchBusinessable(query);
                      const results = [];

                      // Формируем опции с префиксами типов
                      if (response.companies) {
                        results.push(
                          ...response.companies.map((item) => ({
                            value: item.id,
                            label: `Компания: ${item.name}`,
                            type: 'company',
                            name: item.name,
                          })),
                        );
                      }
                      if (response.deals) {
                        results.push(
                          ...response.deals.map((item) => ({
                            value: item.id,
                            label: `Сделка: ${item.name}`,
                            type: 'deal',
                            name: item.name,
                          })),
                        );
                      }
                      if (response.services) {
                        results.push(
                          ...response.services.map((item) => ({
                            value: item.id,
                            label: `Услуга: ${item.name}`,
                            type: 'service',
                            name: item.name,
                          })),
                        );
                      }

                      return results;
                    }}
                    value={
                      business?.relatedEntity
                        ? {
                            value: business.relatedEntity.id,
                            label: ` ${business.relatedEntity.name}`,
                            type: business.relatedEntity.type,
                          }
                        : null
                    }
                  />
                </div>
              )}

              <div
                style={{ zIndex: 52 }}
                className={cn(styles.flex, styles.addZIndex)}
              >
                <ValuesSelector
                  name={`${prefix}performer`}
                  onChange={(e) => {
                    handleChange(
                      `${prefix}performer`,
                      e.length
                        ? members.filter((member) =>
                            e.some((option) => option.value === member.id),
                          )[0]
                        : null,
                    );
                  }}
                  isMulti={false}
                  placeholder={'Выберите ответственного'}
                  label={
                    <div>
                      <span>Ответственный</span>
                      <div style={{ marginLeft: '5px', display: 'inline' }}>
                        <Tooltip
                          title={
                            'Автоматически назначит вас, если оставить пустым'
                          }
                        >
                          <Icon name={'info-stroke'} />
                        </Tooltip>
                      </div>
                    </div>
                  }
                  options={members.map((el) => ({
                    value: el.id,
                    label: `${el?.surname ?? el?.lastName ?? ''} ${el?.name ?? ''} ${el?.middleName ?? ''}`,
                  }))}
                  value={
                    business?.performer?.id != null
                      ? {
                          value: business?.performer?.id,
                          label: `${business?.performer?.surname ?? business?.performer?.lastName ?? ''} ${business?.performer?.name ?? ''} ${business?.performer?.middleName ?? ''}`,
                        }
                      : null
                  }
                />
              </div>
              <div
                style={{ zIndex: 50 }}
                className={cn(styles.flex, styles.addZIndex)}
              >
                <ValuesSelector
                  required={false}
                  name={`${prefix}participants`}
                  placeholder={'Выберите участников'}
                  onChange={(e) => {
                    const selectedParticipants = e.map((option) =>
                      members.find((member) => member.id === option.value),
                    );
                    handleChange(`${prefix}participants`, selectedParticipants);
                  }}
                  isMulti={true}
                  label="Участники"
                  options={members.map((el) => ({
                    value: el.id,
                    label: `${el?.surname ?? el?.lastName ?? ''} ${el?.name ?? ''} ${el?.middleName ?? ''}`,
                  }))}
                  value={
                    business?.participants?.map((participant) => ({
                      value: participant.id,
                      label: `${participant?.surname ?? participant?.lastName ?? ''} ${participant?.name ?? ''} ${participant?.middleName ?? ''}`,
                    })) || []
                  }
                />
              </div>
              <div className={cn(styles.flex, styles.addZIndex)}>
                <Calendar
                  canClose={!isEditMode}
                  required={true}
                  name={`${prefix}startDate`}
                  label={'Дата'}
                  value={business?.startDate}
                  onChange={(date) => {
                    // Обновляем startDate
                    handleChange(`${prefix}startDate`, date);

                    // Синхронно обновляем endDate сохраняя то же число
                    if (business.endDate) {
                      const newEndDate = new Date(date);
                      // Сохраняем время из существующей endDate если оно есть
                      if (business.endDate instanceof Date) {
                        newEndDate.setHours(
                          business.endDate.getHours(),
                          business.endDate.getMinutes(),
                          business.endDate.getSeconds(),
                        );
                      }
                      handleChange(`${prefix}endDate`, newEndDate);
                    }
                  }}
                />
                <div className={styles.fake} style={{ width: '10%' }} />
                <div className={styles.flex}>
                  <div className={styles.timeDropdownCont}>
                    <span>С</span>
                    <TimeDropdown
                      required={true}
                      placeholder={'Время...'}
                      className={styles.timeDropdown}
                      label={' '}
                      disabled={!business?.startDate}
                      onChange={(value) =>
                        handleChange(`${prefix}startTime`, value)
                      }
                      small={true}
                      value={business?.startTime}
                      validationRules={{ allowAnyMinute: true }}
                    />
                  </div>
                  <div className={styles.timeDropdownCont}>
                    <span>До</span>
                    <TimeDropdown
                      required={true}
                      placeholder={'Время...'}
                      className={styles.timeDropdown}
                      label={'  '}
                      disabled={!business?.startTime}
                      onChange={(value) =>
                        handleChange(`${prefix}endTime`, value)
                      }
                      small={true}
                      value={business?.endTime}
                      validationRules={{ allowAnyMinute: true }}
                    />
                  </div>
                </div>
              </div>
              <div className={cn(styles.lowZIndex)}>
                {isEditMode && (
                  <Switch
                    className={styles.switch}
                    name={`${prefix}finished`}
                    label={'Дело завершено ?'}
                    value={business?.finished}
                    onChange={(name, value) => handleChange(name, value)}
                  />
                )}
              </div>

              <div className={styles.reminders}>
                {/* Здесь можно добавить функциональность напоминаний */}
              </div>
            </div>

            {isEditMode && (
              <div className={styles.comments}>
                {isCommentsLoading ? (
                  <Loader />
                ) : (
                  <Comments
                    comments={comments}
                    onDelete={handleRemoveComment}
                    onChange={handleCommentChange}
                    entityId={businessId}
                    belongsTo={'businesses'}
                    isLoading={isCommentsLoading}
                    timeTrackings={business?.timeTrackings}
                    mode="business"
                    contextStore={contextData.store}
                    timeTrackingApi={businessTimeTrackingApi}
                    prefix=""
                  />
                )}
              </div>
            )}

            <TypeSelector
              className={styles.itemType}
              selectedType={selectedType}
              onTypeSelect={(type) => {
                setSelectedType(type);
                handleChange(`${prefix}type`, type);
              }}
            />
          </div>
        </FormValidatedModal>
      </>
    );
  },
);

// Delete button component
const DeleteButton = ({ handleDelete }) => {
  return (
    <div className={styles.delete} onClick={handleDelete}>
      <span>Удалить дело</span>
      <Icon name={'close'} size={20} />
    </div>
  );
};

export default CalendarModal;
