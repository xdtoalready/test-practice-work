import Dropdown from '../../../../../../shared/Dropdown/Default';
import Modal from '../../../../../../shared/Modal';
import TextInput from '../../../../../../shared/TextInput';
import ValuesSelector from '../../../../../../shared/Selector';
import styles from './Modal.module.sass';
import useBills from '../../../../hooks/useBills';
import useClients from '../../../../../Clients/hooks/useClients';
import useLegals from '../../../../../Settings/hooks/useLegals';
import useBillsApi from '../../../../api/bills.api';
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  handleError,
  handleSubmit as handleSubmitSnackbar,
} from '../../../../../../utils/snackbar';
import TextLink from '../../../../../../shared/Table/TextLink';
import Calendar from '../../../../../../shared/Datepicker';
import {
  billStatusTypesRu,
  colorBillStatusTypes,
} from '../../../../types/bills.types';
import cn from 'classnames';
import {
  useSelectorClients,
  useSelectorCompanies,
} from '../../../../../../hooks/useSelectors';
import useAppApi from '../../../../../../api';
import useStore from '../../../../../../hooks/useStore';
import { observer } from 'mobx-react';
import taskStyles
  from '../../../../../Stages/components/StagesPage/components/StagesTable/components/EditModal/components/TaskDescriptionPart/Description.module.sass';
import ServiceItems from './components/ServiceItems';
import useClientsApi from '../../../../../Clients/clients.api';
import Icon from '../../../../../../shared/Icon';
import ConfirmationModal from '../../../../../../components/ConfirmationModal';
import useServiceApi from '../../../../../Services/services.api';
import FormValidatedModal from '../../../../../../shared/Modal/FormModal';
import { colorStatusDealTypes } from '../../../../../Deals/deals.types';
import StatusDropdown from '../../../../../../components/StatusDropdown';
import { LoadingProvider } from '../../../../../../providers/LoadingProvider';

const EditModal = observer(({ billId, onClose, company, service, stage }) => {
  stage && useBills(billId);
  const { billsStore } = useStore();
  const appApi = useAppApi();
  const { appStore } = useStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const api = useBillsApi();
  const serviceApi = useServiceApi();

  const [isEditMode, setIsEditMode] = useState(false);
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [stages, setStages] = useState([]);

  const [localBill, setLocalBill] = useState({
    number: '',
    creationDate: new Date(),
    paymentDate: new Date(),
    legalEntity: null,
    company: company ?? null,
    status: 'created',
    paymentReason: '',
    service: service ?? null,
    stage: stage ?? null,
    items: [],
  });

  const bill = useMemo(() => {
    return isEditMode ? billsStore.getById(billId) : localBill;
  }, [
    isEditMode,
    billId,
    billsStore.bills,
    billsStore.currentBill,
    billsStore.drafts,
    localBill,
  ]);

  useEffect(() => {
    const loadServices = async () => {
      if (bill?.company?.id && !appStore.servicesByCompany.length) {
        try {
          const data = await appApi.getServicesByCompany(
            bill?.company.id ?? company?.id,
          );

          const mappedServices = data.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          setServices(mappedServices);
        } catch (error) {
          console.error('Ошибка загрузки услуг:', error);
          setServices([]);
        }
      } else if (bill?.company?.id && appStore.servicesByCompany.length) {
        const mappedServices = appStore.servicesByCompany.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setServices(mappedServices);
      }
    };

    loadServices();
  }, [bill?.company?.id]);

  useEffect(() => {
    const loadServices = async () => {
      if (bill?.service?.id && !appStore.stagesByService.length) {
        try {
          const data = await appApi.getStagesByService(
            bill?.service.id ?? service?.id,
          );
          const mappedServices = data.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          setStages(mappedServices);
        } catch (error) {
          console.error('Ошибка загрузки этапов:', error);
          setStages([]);
        }
      } else if (bill?.service?.id && appStore.stagesByService.length) {
        const mappedServices = appStore.stagesByService.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setStages(mappedServices);
      }
    };
    loadServices();
  }, [bill?.service?.id]);

  useEffect(() => {
    const loadLegalEntities = async () => {
      if (!appStore.legalEntities.length) {
        await appApi.getLegalEntities('');
      }
    };
    loadLegalEntities();
  }, []);

  useEffect(() => {
    if (billId) {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [billId]);

  const handleChange = (name, value, withId = true) => {
    if (isEditMode) {
      billsStore.changeById(billId, name, value, withId);
    } else {
      setLocalBill((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (onError = null) => {
    if (isDeleteModalOpen) return;

    try {
      if (isEditMode) {
        await api.updateBill(billId, bill, Boolean(stage?.id));
      } else {
        await api
          .createBill({
            ...localBill,
            legalEntityId: bill?.legalEntity?.id ?? 0,
            companyId: bill?.company?.id ?? 0,
          }, stage?.id ?? null)
          .then(
            () => service && stage && serviceApi.getServiceById(service.id),
          );
      }
      handleSubmitSnackbar(
        isEditMode ? 'Счет успешно отредактирован' : 'Счет успешно создан',
      );
      billsStore.resetDraft(billId);
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

    if (isEditMode) {
      billsStore.resetDraft(billId);
    }
    onClose();
  };

  const handleDownloadBill = async () => {
    api.downloadBill(bill?.stampedBill);
  };

  const handleDeleteBill = async () => {
    const success = await api.deleteBill(billId);
    if (success) {
      handleSubmitSnackbar('Счет успешно удален');
      onClose();
    }
    setIsDeleteModalOpen(false);
  };
  return (
    <>
      <ConfirmationModal
        label={'Вы действительно хотите удалить счет?'}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        onConfirm={handleDeleteBill}
      />
      <FormValidatedModal
        handleSubmit={handleSubmit}
        handleClose={handleReset}
        size={'md'}
        customButtons={
          isEditMode && (
            <div className={styles.addButtons}>
              <DeleteButton handleDelete={() => setIsDeleteModalOpen(true)} />
            </div>
          )
        }
      >
        <div className={styles.name}>
          {isEditMode ? 'Редактирование счета' : 'Создание счета'}
          <StatusDropdown
            required={true}
            name={'status'}
            statuses={colorBillStatusTypes}
            value={colorBillStatusTypes[bill?.status]}
            onChange={(option) => handleChange('status', option.key)}
          />
        </div>
        <div className={cn(styles.flex, styles.addZIndex)}>
          <Dropdown
            required={true}
            name={'legalEntity'}
            setValue={(e) => {
              handleChange('legalEntity', e);
            }}
            classNameContainer={styles.input}
            label={'Получатель платежа'}
            value={bill?.legalEntity}
            renderValue={(val) => val.name}
            renderOption={(opt) => opt.name}
            options={appStore?.legalEntities ?? []}
          />
          <TextInput
            required={true}
            onChange={({ target }) => handleChange(target.name, target.value)}
            name={'number'}
            value={bill?.number}
            edited={true}
            placeholder={'Введите номер счета'}
            className={cn(taskStyles.input, taskStyles.textarea)}
            label={'Номер счета'}
          />
        </div>

        <div className={cn(styles.flex, styles.addZIndex)}>
          <Calendar
            required={true}
            name={'creationDate'}
            label={'Дата создания'}
            value={bill?.creationDate}
            onChange={(date) => handleChange('creationDate', date)}
          />
          <Calendar
            required={true}
            name={'paymentDate'}
            label={'План. дата платежа'}
            value={bill?.paymentDate}
            onChange={(date) => handleChange('paymentDate', date)}
          />
        </div>

        <TextInput
          required={true}
          onChange={({ target }) => handleChange(target.name, target.value)}
          name={'paymentReason'}
          value={bill?.paymentReason}
          rows={6}
          edited={true}
          placeholder={'Введите комментарий'}
          className={cn(taskStyles.input, taskStyles.textarea)}
          label={'Назначение платежа'}
        />

        <ValuesSelector
          required={true}
          name={'company'}
          minInputLength={4}
          readonly={company ?? false}
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
            const data = response;
            return data.map((item) => ({
              value: item?.id,
              label: item?.name,
            }));
          }}
          value={
            bill?.company
              ? { value: bill?.company?.id, label: bill?.company?.name ?? '' }
              : null
          }
        />

        {bill?.company?.id && (
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
              bill?.service
                ? {
                  value: bill?.service.id,
                  label: bill?.service?.name ?? '',
                }
                : null
            }
          />
        )}

        {bill?.service?.id && (
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
              bill?.stage
                ? { value: bill?.stage.id, label: bill?.stage?.name ?? '' }
                : null
            }
          />
        )}
        <ServiceItems
          items={bill?.items}
          onChange={(items) => handleChange('items', items, true)}
        />
      </FormValidatedModal>
    </>
  );
});

const DeleteButton = ({ handleDelete }) => {
  return (
    <div className={styles.delete} onClick={handleDelete}>
      <span>Удалить счет</span>
      <Icon name={'close'} size={20} />
    </div>
  );
};

export default EditModal;
