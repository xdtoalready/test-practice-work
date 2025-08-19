// components/Deals/components/DealEditModal/index.js
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import useMembers from '../../../Members/hooks/useMembers';
import useClients from '../../../Clients/hooks/useClients';
import {
  colorStatusDealTypes,
  dealStatusTypes,
  sourceType,
  sourceTypeRu,
} from '../../deals.types';
import {
  serviceTypeEnum,
  serviceTypeEnumRu,
} from '../../../Services/services.types';
import { handleSubmit as handleSubmitSnackbar } from '../../../../utils/snackbar';
import Modal from '../../../../shared/Modal';
import TextInput from '../../../../shared/TextInput';
import ValuesSelector from '../../../../shared/Selector';
import styles from './Modal.module.sass';
import Dropdown from '../../../../shared/Dropdown/Default';
import useServiceTypes from '../../../Services/hooks/useServiceTypes';
import { colorStatusTypes } from '../../../Clients/clients.types';
import StatusDropdown from '../../../../components/StatusDropdown';
import cn from 'classnames';
import useAppApi from '../../../../api';
import useStore from '../../../../hooks/useStore';
import DeleteButton from '../../../../shared/Button/Delete';
import CustomButtonContainer from '../../../../shared/Button/CustomButtonContainer';
import { useNavigate } from 'react-router';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import FormValidatedModal from '../../../../shared/Modal/FormModal';
import useQueryParam from '../../../../hooks/useQueryParam';
import { stageStatusTypesRu } from '../../../Stages/stages.types';
import { tasksTypesRu } from '../../../Tasks/tasks.types';
import useMappedObj from '../../../../hooks/useMappedObj';

const DealEditModal = observer(
  ({ data, handleClose, dealStore, dealApi, ...props }) => {
    const { members } = useMembers();
    const { appStore } = useStore();
    const navigate = useNavigate();
    const { data: companies } = useClients();
    const serviceTypes = useServiceTypes();
    const sourceTypes = useMappedObj(sourceType);
    const appApi = useAppApi();
    const [isEditMode, setIsEditMode] = useState(data?.id ?? false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const page = useQueryParam('page', 1);
    const [localDeal, setLocalDeal] = useState({
      name: '',
      description: ' ',
      source: sourceType.seo,
      serviceType: serviceTypeEnum.seo,
      price: '',
      status: dealStatusTypes.new_lead,

      auditor: [],
      manager: null,
      company: props?.currentClient ?? null,
    });

    // useEffect(() => {
    //   if (data?.id) {
    //     setIsEditMode(true);
    //   } else {
    //     setIsEditMode(false);
    //   }
    // }, [data]);

    const deal = isEditMode ? dealStore.getById(data.id) : localDeal;

    const handleChange = (name, value, withId = true) => {
      if (isEditMode) {
        dealStore.changeById(data.id, name, value, withId);
      } else {
        setLocalDeal((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    };

    const handleSubmit = async (onError = null) => {
      if (isDeleteModalOpen) return;
      try {
        if (isEditMode) {
          await dealApi.updateDeal(data.id, deal);
        } else {
          await dealApi.createDeal(localDeal);
        }
        handleSubmitSnackbar(
          isEditMode
            ? 'Сделка успешно отредактирована'
            : 'Сделка успешно создана',
        );
        handleClose();
      } catch (error) {
        console.error('Ошибка при сохранении:', error);
        onError && onError();
      }
    };
    console.log(deal, 'deal123');
    const handleDeleteDeal = () => {
      dealApi
        .deleteDeal(deal.id)
        .then(() => {
          handleSubmitSnackbar('Сделка успешно удалена');
          navigate('/deals');
        })
        .finally(() => {
          setIsDeleteModalOpen(false);
        });
    };

    const handleReset = () => {
      if (isDeleteModalOpen) return;
      if (isEditMode) {
        dealStore.resetDraft(data.id);
      }
      handleClose();
    };
    return (
      <>
        <ConfirmationModal
          label={'Вы действительно хотите удалить сделку?'}
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
          }}
          onConfirm={handleDeleteDeal}
        />
        <FormValidatedModal
          customButtons={
            isEditMode && (
              <CustomButtonContainer>
                <DeleteButton
                  handleDelete={() => setIsDeleteModalOpen(true)}
                  label={'Удалить сделку'}
                />
              </CustomButtonContainer>
            )
          }
          handleSubmit={handleSubmit}
          handleClose={handleReset}
          size={'md'}
        >
          <div className={cn(styles.name, styles.name_flex)}>
            {isEditMode ? 'Редактирование сделки' : 'Создание сделки'}
            <StatusDropdown
              required={true}
              name={'status'}
              statuses={colorStatusDealTypes}
              value={colorStatusDealTypes[deal.status]}
              onChange={(option) => handleChange('status', option.key)}
            />
          </div>
          <TextInput
            required={true}
            name={'name'}
            placeholder={'Название сделки'}
            onChange={({ target }) => handleChange('name', target.value)}
            value={deal?.name || ''}
            edited={true}
            className={styles.input}
            label={'Название сделки'}
          />
          <TextInput
            type={'editor'}
            placeholder={'Комментарий'}
            onChange={({ target }) => handleChange('description', target.value)}
            value={deal?.description === '' ? ' ' : deal?.description}
            edited={true}
            className={styles.input}
            label={'Комментарий'}
          />
          <div className={styles.flex}>
            <Dropdown
              classNameContainer={styles.input}
              name={'source'}
              placeholder={'Источник'}
              setValue={(e) => {
                return handleChange('source', e[0]);
              }}
              value={deal?.source ?? ''}
              edited={true}
              renderValue={(value) => sourceTypeRu[value]}
              // renderValue={(value)=>value}
              renderOption={(option) => sourceTypeRu[option[0]]}
              options={sourceTypes}
              label={'Рекламный источник'}
            />
            <Dropdown
              setValue={(e) =>
                handleChange(isEditMode ? 'serviceType' : 'serviceType', e[0])
              }
              classNameContainer={styles.input}
              renderValue={(val) => serviceTypeEnumRu[val]}
              label={'Тип услуги'}
              placeholder={'Тип услуги'}
              value={
                deal?.serviceType
                  ? serviceTypes?.find((el) => el[0] === deal?.serviceType)?.[0]
                  : ''
              }
              renderOption={(opt) => serviceTypeEnumRu[opt[0]]}
              options={serviceTypes}
            />
          </div>

          <TextInput
            placeholder={'Стоимость'}
            onChange={({ target }) => handleChange('price', target.value)}
            value={deal?.price || ''}
            type="number"
            edited={true}
            className={styles.input}
            label={'Стоимость сделки'}
          />
          <ValuesSelector
            required={true}
            name={'manager'}
            onChange={(e) =>
              handleChange(
                'manager',
                e.length ? members.find((el) => el.id === e[0]?.value) : null,
              )
            }
            isMulti={false}
            label="Менеджер"
            options={members.map((el) => ({
              value: el.id,
              label: `${el?.surname ?? ''} ${el?.name ?? ''} ${el?.middleName ?? ''}`,
            }))}
            value={
              deal.manager
                ? {
                    value: deal.manager.id,
                    label: `${deal?.manager?.surname ?? deal?.manager?.lastName ?? ''} ${deal?.manager?.name ?? ''} ${deal?.manager?.middleName ?? ''}`,
                  }
                : null
            }
          />
          {/*<ValuesSelector*/}
          {/*    required={true}*/}

          {/*    onChange={(e) => {*/}
          {/*    handleChange(*/}
          {/*      'responsible',*/}
          {/*      e.length ? members.find((el) => el.id === e[0]?.value) : null,*/}
          {/*    );*/}
          {/*  }}*/}
          {/*  isMulti={false}*/}
          {/*  label="Ответственный"*/}
          {/*  options={members.map((el) => ({*/}
          {/*    value: el.id,*/}
          {/*    label: `${el?.surname ?? ''} ${el?.name ?? ''} ${el?.middleName ?? ''}`,*/}
          {/*  }))}*/}
          {/*  value={*/}
          {/*    deal.responsible*/}
          {/*      ? {*/}
          {/*          value: deal.responsible.id,*/}
          {/*          label: `${deal?.responsible?.surname ?? deal?.responsible?.lastName ?? ''} ${deal?.responsible?.name ?? ''} ${deal?.responsible?.middleName ?? ''}`,*/}
          {/*        }*/}
          {/*      : null*/}
          {/*  }*/}
          {/*/>*/}
          <ValuesSelector
            onChange={(e) =>
              handleChange(
                'auditor',
                e.length
                  ? members.filter((member) =>
                      e.some((option) => option.value === member.id),
                    )
                  : [],
              )
            }
            isMulti={true}
            label="Аудитор"
            options={members.map((el) => ({
              value: el.id,
              label: `${el?.surname ?? ''} ${el?.name ?? ''} ${el?.middleName ?? ''}`,
            }))}
            value={
              deal.auditor
                ? deal.auditor.map((el) => ({
                    value: el.id,
                    label: `${el?.surname ?? el?.lastName ?? ''} ${el?.name ?? ''} ${el?.middleName ?? ''}`,
                  }))
                : []
            }
          />
          <ValuesSelector
            name={'company'}
            minInputLength={4}
            readonly={props?.currentClient ?? false}
            placeholder={'Клиент'}
            onChange={(e) => {
              handleChange(
                'company',
                e.length
                  ? appStore?.companies.find((el) => el?.id === e[0]?.value)
                  : null,
              );
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
              deal?.company
                ? {
                    value: deal?.company?.id,
                    label: deal?.company?.name ?? deal?.company?.title ?? '',
                  }
                : null
            }
          />
        </FormValidatedModal>
      </>
    );
  },
);

export default DealEditModal;
