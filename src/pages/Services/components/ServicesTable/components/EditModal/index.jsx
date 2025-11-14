import React, { useEffect, useMemo, useState } from 'react';
import styles from './Modal.module.sass';
import TextInput from '../../../../../../shared/TextInput';
import Dropdown from '../../../../../../shared/Dropdown/Default';
import useServiceTypes from '../../../../hooks/useServiceTypes';
import { observer } from 'mobx-react';
import ValuesSelector from '../../../../../../shared/Selector';
import useMembers from '../../../../../Members/hooks/useMembers';
import useServiceStatuses from '../../../../hooks/useServiceStatuses';
import { serviceTypeEnumRu, statusTypesRu } from '../../../../services.types';
import Calendar from '../../../../../../shared/Datepicker';
import useClients from '../../../../../Clients/hooks/useClients';
import useServices from '../../../../hooks/useServices';
import useServiceApi from '../../../../services.api';
import { handleError, handleInfo, handleSubmit as handleSubmitSnackbar } from '../../../../../../utils/snackbar';
import TextLink from '../../../../../../shared/Table/TextLink';
import useStore from '../../../../../../hooks/useStore';
import useAppApi from '../../../../../../api';
import FormValidatedModal from '../../../../../../shared/Modal/FormModal';
import ConfirmationModal from '../../../../../../components/ConfirmationModal';
import useParamSearch from '../../../../../../hooks/useParamSearch';
import CustomButtonContainer from '../../../../../../shared/Button/CustomButtonContainer';
import DeleteButton from '../../../../../../shared/Button/Delete';
import { useLocation, useNavigate, useParams } from 'react-router';
import { removeLastPathSegment } from '../../../../../../utils/window.utils';
import cn from 'classnames';

const EditModal = observer(({ serviceId, onClose, ...props }) => {
  const serviceTypes = useServiceTypes();
  const { store: serviceStore } = useServices();
  const { appStore } = useStore();
  const appApi = useAppApi();
  const { members } = useMembers();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const statuses = useServiceStatuses();
  const pageFrom = useParamSearch('page' ?? 1);
  const {
    data: { clients },
  } = useClients();
  const api = useServiceApi();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [localService, setLocalService] = useState({
    title: '',
    contractNumber: '',
    type: null,
    manager: null,
    command: null,
    status: 'created',
    deadline: null,
    client: props.client ?? null,
    creator: null,
    stages: [{ task: { endDate: new Date() } }],
    site: {},
  });

  const service = useMemo(() => {
    return isEditMode ? serviceStore.getById(serviceId) : localService;
  }, [
    isEditMode,
    serviceId,
    serviceStore.services,
    serviceStore.drafts,
    localService,
  ]);

  useEffect(() => {
    if (serviceId) {
      setIsEditMode(true); // Режим редактирования
    } else {
      setIsEditMode(false); // Режим создания
    }
  }, [serviceId]);

  const handleChange = (name, value, withId = true) => {

    if (isEditMode) {
      serviceStore.changeById(serviceId, name, value, withId);

    } else {
      setLocalService((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (onError = null) => {

    try {
      if (isEditMode) {
        await api.updateService(serviceId, service); // Обновляем услугу
      } else {
        await api.createService({
          ...localService,
          // manager_id: localService.manager?.id ?? 0,
          type: localService.type,
        }); // Создаем новую услугу
      }
      handleSubmitSnackbar(
        isEditMode
          ? 'Услуга успешно отредактирована'
          : 'Услуга успешно создана',
      );
      serviceStore.submitDraft(serviceId);
      onClose(); // Закрываем модалку
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      onError && onError();
    }
  };

  const serviceClient = service?.client ?? props?.client ?? null;

  const [sitesOptions,setSitesOptions] = useState([])

  useEffect(() => {
    const fetchOptions = async () => {
      if(serviceClient?.id){

        const options = await api.getCompanySites(serviceClient.id)
        setSitesOptions(Object.values(options));
      }
    }
    fetchOptions()
  }, [serviceClient]);

  const handleReset = () => {
    if (isEditMode) {
      serviceStore.resetDraft(serviceId); // Сброс черновика в режиме редактирования
    }
    onClose(); // Закрытие модалки
  };

  const handleDeleteService = async () => {
    try {
      await api.deleteService(serviceId, pageFrom);
      onClose();
      handleInfo('Услуга удалена');
      id &&
        navigate(
          `${removeLastPathSegment(location.pathname)}${location.search}`,
        );
    } catch (e) {
      handleError('Ошибка при удалении услуги:' + e?.message);
    }
  };

  return (
    <>
      <ConfirmationModal
        label={'Вы действительно хотите удалить услугу?'}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        onConfirm={handleDeleteService}
      />
      <FormValidatedModal
        handleSubmit={handleSubmit}
        handleClose={handleReset}
        size={'md'}
        customButtons={
          isEditMode && (
            <CustomButtonContainer>
              <DeleteButton
                handleDelete={() => setIsDeleteModalOpen(true)}
                label={'Удалить услугу'}
              />
            </CustomButtonContainer>
          )
        }
      >
        <div className={styles.name}>
          {isEditMode ? 'Редактирование услуги' : 'Создание услуги'}
        </div>
        <TextInput
          required
          placeholder={'Название услуги'}
          onChange={({ target }) =>
            handleChange(isEditMode ? 'title' : 'title', target.value)
          }
          name={isEditMode ? 'title' : 'title'}
          value={service?.title || ''}
          edited={true}
          className={styles.input}
          label={'Название услуги'}
        />
        <Dropdown
          name={'type'}
          required
          setValue={(e) => handleChange(isEditMode ? 'type' : 'type', e[0])}
          classNameContainer={styles.input}
          renderValue={(val) => serviceTypeEnumRu[val]}
          label={'Тип услуги'}
          placeholder={'Тип услуги'}
          value={
            service?.type
              ? serviceTypes?.find((el) => el?.[0] === service?.type)?.[0]
              : ''
          }
          renderOption={(opt) => serviceTypeEnumRu[opt[0]]}
          options={serviceTypes}
        />
        {/*<ValuesSelector*/}
        {/*  onChange={(e) =>*/}
        {/*    handleChange(*/}
        {/*      isEditMode ? 'creator' : 'creator',*/}
        {/*      e.length ? members.find((el) => el?.id === el?.[0]?.value) : null,*/}
        {/*    )*/}
        {/*  }*/}
        {/*  isMulti={false}*/}
        {/*  label="Постановщик"*/}
        {/*  options={members?.map((el) => ({*/}
        {/*    value: el?.id,*/}
        {/*    label: `${el?.surname ?? ''} ${el?.name ?? ''} ${el?.middleName ?? ''}`,*/}
        {/*  }))}*/}
        {/*  value={*/}
        {/*    service?.creator*/}
        {/*      ? {*/}
        {/*          value: service?.creator?.id,*/}
        {/*          label: `${service?.creator?.surname ?? ''} ${service?.creator?.name ?? ''} ${service?.creator?.middleName ?? ''}`,*/}
        {/*        }*/}
        {/*      : null*/}
        {/*  }*/}
        {/*/>*/}
        <ValuesSelector
          onChange={(e) =>
            handleChange(
              isEditMode ? 'manager' : 'manager',
              e.length ? members?.find((el) => el?.id === e?.[0]?.value) : null,
            )
          }
          isMulti={false}
          label="Менеджер"
          options={members.map((el) => ({
            value: el?.id,
            label: `${el?.surname ?? ''} ${el?.name ?? ''} ${el?.middleName ?? ''}`,
          }))}
          value={
            service?.manager
              ? {
                  value: service.manager?.id,
                  label: `${service?.manager?.surname ?? ''} ${service?.manager?.name ?? ''} ${service?.manager?.middleName ?? ''}`,
                }
              : null
          }
        />
        <ValuesSelector
          onChange={(e) =>
            handleChange(
              isEditMode ? 'command' : 'command',
              e.length
                ? members.filter((member) =>
                    e.some((option) => option.value === member.id),
                  )
                : [],
            )
          }
          isMulti={true}
          label="Участники"
          options={members.map((el) => ({
            value: el.id,
            label: `${el?.surname ?? ''} ${el?.name ?? ''} ${el?.middleName ?? ''}`,
          }))}
          value={
            service?.command
              ? service.command.map((el) => ({
                  value: el.id,
                  label: `${el?.surname ?? ''} ${el?.name ?? ''} ${el?.middleName ?? ''}`,
                }))
              : []
          }
        />
        <div className={cn(styles.flex,styles.addZIndex)}>
          <Dropdown
            setValue={(e) =>
              handleChange(isEditMode ? 'status' : 'status', e[0])
            }
            classNameContainer={styles.input}
            label={'Статус'}
            value={statusTypesRu[service?.status] || ''}
            renderOption={(opt) => opt[1]}
            options={statuses}
          />
          <Calendar
            classNameContainer={cn(styles.input,styles.addZIndex)}
            className={styles.addZIndex}
            label={'Дедлайн'}
            value={service?.deadline}
            onChange={(date) =>
              handleChange(isEditMode ? 'deadline' : 'deadline', date)
            }
          />
        </div>
        {/*<ValuesSelector*/}
        {/*  readonly={props?.client || isEditMode}*/}
        {/*  placeholder={'Клиент'}*/}
        {/*  onChange={(e) =>*/}
        {/*    handleChange(*/}
        {/*      isEditMode ? 'client' : 'client',*/}
        {/*      e.length ? clients.find((el) => el.id === e[0]?.value) : null,*/}
        {/*    )*/}
        {/*  }*/}
        {/*  isMulti={false}*/}
        {/*  label={*/}
        {/*    <div className={styles.client_label}>*/}
        {/*      <span>Клиент</span>*/}
        {/*      {!props.client && <TextLink>Создать клиента</TextLink>}*/}
        {/*    </div>*/}
        {/*  }*/}
        {/*  options={clients.map((el) => ({ value: el.id, label: el.title }))}*/}
        {/*  value={*/}
        {/*    serviceClient*/}
        {/*      ? { value: serviceClient.id, label: serviceClient.title }*/}
        {/*      : null*/}
        {/*  }*/}
        {/*/>*/}
        <ValuesSelector
          minInputLength={4}
          // readonly={props?.client || isEditMode}
          placeholder={'Клиент'}
          name={'client'}
          onChange={(e) => {
            handleChange(
              'client',
              e.length
                ? appStore?.companies.find((el) => el?.id === e[0]?.value)
                : null,
            );
            handleChange('site','')
          }}
          isMulti={false}
          label={
            <div className={styles.client_label}>
              <span>Клиент</span>
              {!props.client && <TextLink>Создать клиента</TextLink>}
            </div>
          }
          isAsync
          asyncSearch={async (query) => {
            const response = await appApi.getCompanies(query);
            return response.map((item) => ({
              value: item?.id,
              label: item?.name,
            }));
          }}
          value={
            serviceClient
              ? {
                  value: serviceClient.id,
                  label: serviceClient?.name ?? serviceClient?.title ?? '',
                }
              : null
          }
        />
        {serviceClient && (

          <Dropdown
            name={'site'}
            setValue={(e) => handleChange('site', e)}
            classNameContainer={styles.input}
            refInputValue={''}
            label={'Сайт компании'}
            placeholder={'Выберите сайт'}
            value={service?.site ? service.site : {}}
            renderOption={(site) => site?.url ?? ''}
            renderValue={(site) => site?.url ?? ''}
            options={sitesOptions}
            disabled={!serviceClient}
          />
        )}
        <TextInput
          placeholder={'Номер договора'}
          onChange={({ target }) =>
            handleChange(
              isEditMode ? 'contractNumber' : 'contractNumber',
              target.value,
            )
          }
          name={isEditMode ? 'contract_number' : 'contract_number'}
          value={service?.contractNumber || ''}
          edited={true}
          className={styles.input}
          label={'Номер договора'}
        />
      </FormValidatedModal>
    </>
  );
});

export default EditModal;
