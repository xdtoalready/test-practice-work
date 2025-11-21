import { observer } from 'mobx-react';
import React, { useEffect, useMemo, useState } from 'react';
import ConfirmationModal from '../../../../../components/ConfirmationModal';
import FormValidatedModal from '../../../../../shared/Modal/FormModal';
import StatusDropdown from '../../../../../components/StatusDropdown';
import TextInput from '../../../../../shared/TextInput';
import ValuesSelector from '../../../../../shared/Selector';
import ServiceItems from '../../../../Documents/components/BillsTable/components/EditModal/components/ServiceItems';
import Icon from '../../../../../shared/Icon';
import useStore from '../../../../../hooks/useStore';
import useAppApi from '../../../../../api';
import useActsApi from '../../../acts.api';
import taskStyles
  from '../../../../Stages/components/StagesPage/components/StagesTable/components/EditModal/components/TaskDescriptionPart/Description.module.sass';
import { handleError, handleSubmit as handleSubmitSnackbar } from '../../../../../utils/snackbar';
import styles from './Modal.module.sass';
import { actStatusTypes, colorActStatusTypes } from '../../../acts.types';
import cn from 'classnames';
import useActs from '../../../hooks/useActs';

const EditModal = observer(({ actId, onClose, company, service, stage }) => {
  stage && useActs(actId);
  const { actsStore } = useStore();
  const appApi = useAppApi();
  const { appStore } = useStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const api = useActsApi();
  const [services, setServices] = useState([]);
  const [stages, setStages] = useState([]);

  const act = useMemo(() => {
    return actsStore.getById(actId);
  }, [actId, actsStore.acts, actsStore.currentAct, actsStore.drafts]);

  useEffect(() => {
    const loadServices = async () => {
      if (act?.company?.id && !appStore.servicesByCompany.length) {
        try {
          const data = await appApi.getServicesByCompany(act?.company.id ?? company?.id);
          const mappedServices = data.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          setServices(mappedServices);
        } catch (error) {
          console.error('Ошибка загрузки услуг:', error);
          setServices([]);
        }
      } else if (act?.company?.id && appStore.servicesByCompany.length) {
        const mappedServices = appStore.servicesByCompany.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setServices(mappedServices);
      }
    };

    loadServices();
  }, [act?.company?.id]);

  useEffect(() => {
    const loadStages = async () => {
      if (act?.service?.id && !appStore.stagesByService.length) {
        try {
          const data = await appApi.getStagesByService(act?.service.id ?? service?.id);
          const mappedStages = data.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          setStages(mappedStages);
        } catch (error) {
          console.error('Ошибка загрузки этапов:', error);
          setStages([]);
        }
      } else if (act?.service?.id && appStore.stagesByService.length) {
        const mappedStages = appStore.stagesByService.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setStages(mappedStages);
      }
    };
    loadStages();
  }, [act?.service?.id]);

  const handleChange = (name, value, withId = true) => {
    actsStore.changeById(actId, name, value, withId);
  };

  const handleSubmit = async (onError = null) => {
    if (isDeleteModalOpen) return;

    try {
      await api.updateAct(actId, act, Boolean(stage?.id));
      handleSubmitSnackbar('Акт успешно отредактирован');
      actsStore.resetDraft(actId);
      onClose();
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      handleError('Ошибка при сохранении:', error);
      onError && onError();
    }
  };

  const handleClearInfoAfterCompany = () => {
    appStore.clearProp(['servicesByCompany']);
    handleChange('service', null);
    handleChange('stage', null);
  };

  const handleClearInfoAfterService = () => {
    appStore.clearProp(['stagesByService']);
    handleChange('stage', null);
  };

  const handleReset = () => {
    if (isDeleteModalOpen) return;
    actsStore.resetDraft(actId);
    onClose();
  };

  const handleDownloadAct = async () => {
    api.downloadAct(act?.stampedAct);
  };

  const handleDeleteAct = async () => {
    const success = await api.deleteAct(actId);
    if (success) {
      handleSubmitSnackbar('Акт успешно удален');
      onClose();
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <ConfirmationModal
        label={'Вы действительно хотите удалить акт?'}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        onConfirm={handleDeleteAct}
      />
      <FormValidatedModal
        handleSubmit={handleSubmit}
        handleClose={handleReset}
        size={'md'}
        customButtons={
          <div className={styles.addButtons}>
            <DeleteButton handleDelete={() => setIsDeleteModalOpen(true)} />
          </div>
        }
      >
        <div className={styles.name}>
          Редактирование акта
          <StatusDropdown
            required={true}
            name={'status'}
            statuses={colorActStatusTypes}
            value={colorActStatusTypes[act?.status]}
            onChange={(option) => handleChange('status', option.key)}
          />
        </div>

        <div className={cn(styles.flex, styles.addZIndex)}>
          <TextInput
            required={true}
            onChange={({ target }) => handleChange(target.name, target.value)}
            name={'number'}
            value={act?.number}
            edited={true}
            placeholder={'Введите номер акта'}
            className={cn(taskStyles.input, taskStyles.textarea)}
            label={'Номер акта'}
          />
        </div>

        {!company &&
          <ValuesSelector
            required={true}
            name={'company'}
            minInputLength={4}
            readonly={act?.company ?? false}
            placeholder={'Клиент'}
            onChange={(e) => {
              handleChange(
                'company',
                e.length
                  ? appStore?.companies.find((el) => el?.id === e[0]?.value)
                  : null,
              );
              handleClearInfoAfterCompany();
            }}
            isMulti={false}
            label={<div className={styles.client_label}>Клиент</div>}
            isAsync
            asyncSearch={async (query) => {
              const response = await appApi.getCompanies(query);
              return response.map((item) => ({
                value: item?.id,
                label: item?.name,
              }));
            }}
            value={
              act?.company
                ? { value: act?.company?.id, label: act?.company?.name ?? '' }
                : null
            }
          />
        }

        {act?.company?.id && (
          <ValuesSelector
            required={true}
            name={'service'}
            minInputLength={4}
            readonly={service ?? false}
            placeholder={'Услуга'}
            onChange={(e) => {
              handleChange(
                'service',
                e.length
                  ? appStore?.servicesByCompany.find(
                    (el) => el.id === e[0]?.value,
                  )
                  : null,
              );
              handleClearInfoAfterService();
            }}
            isMulti={false}
            label={<div className={styles.client_label}>Услуга</div>}
            options={services}
            value={
              act?.service
                ? {
                  value: act?.service.id,
                  label: act?.service?.name ?? '',
                }
                : null
            }
          />
        )}

        {act?.service?.id && (
          <ValuesSelector
            required={true}
            name={'stage'}
            minInputLength={4}
            readonly={stage ?? false}
            placeholder={'Этап'}
            onChange={(e) =>
              handleChange(
                'stage',
                e.length
                  ? appStore?.stagesByService.find(
                    (el) => el.id === e[0]?.value,
                  )
                  : null,
              )
            }
            isMulti={false}
            label={<div className={styles.client_label}>Этап</div>}
            options={stages}
            value={
              act?.stage
                ? { value: act?.stage.id, label: act?.stage?.name ?? '' }
                : null
            }
          />
        )}

        <ServiceItems
          items={act?.items}
          onChange={(items) => handleChange('items', items, true)}
        />
      </FormValidatedModal>
    </>
  );
});

const DeleteButton = ({ handleDelete }) => {
  return (
    <div className={styles.delete} onClick={handleDelete}>
      <span>Удалить акт</span>
      <Icon name={'close'} size={20} />
    </div>
  );
};

export default EditModal;