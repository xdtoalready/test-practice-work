import useEmployes from '../../../../hooks/useEmployes';
import useEmployesApi from '../../../../api/employes.api';
import { observer } from 'mobx-react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  handleError,
  handleInfo,
  handleSubmit as handleSubmitSnackbar,
} from '../../../../../../utils/snackbar';
import Modal from '../../../../../../shared/Modal';
import styles from './Modal.module.sass';
import Calendar from '../../../../../../shared/Datepicker';
import useAppApi from '../../../../../../api';
import Dropdown from '../../../../../../shared/Dropdown/Default';
import { useSelectorEmployeePositions } from '../../../../../../hooks/useSelectors';
import TextInput from '../../../../../../shared/TextInput';
import Radio from '../../../../../../shared/Radio';
import { genderType, genderTypeRu } from '../../../../settings.types';
import cn from 'classnames';
import { formatDateToBackend } from '../../../../../../utils/formate.date';
import RadioGenderInput from '../../../../../../components/RadioGenderInput';
import FormValidatedModal from '../../../../../../shared/Modal/FormModal';
import CustomButtonContainer from '../../../../../../shared/Button/CustomButtonContainer';
import DeleteButton from '../../../../../../shared/Button/Delete';
import ConfirmationModal from '../../../../../../components/ConfirmationModal';
import useQueryParam from '../../../../../../hooks/useQueryParam';
import {
  mapEmployeesFromApi,
  mapSettingsDataToBackend,
} from '../../../../settings.mapper';
import Switch from '../../../../../../shared/Switch';
import { PermissionGroups, UserPermissions } from '../../../../../../shared/userPermissions';
import { usePermissions } from '../../../../../../providers/PermissionProvider';

const EditModal = observer(({ employeId, onClose }) => {
  const { store: employeStore } = useEmployes();
  const api = useEmployesApi();
  const positions = useSelectorEmployeePositions();
  console.log(positions, 'positions');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const page = useQueryParam('page', 1);
  const { hasPermission, permissions } = usePermissions();

  const [localEmploye, setlocalEmploye] = useState({
    birthday: '',
    position: {},
    name: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: genderType.male,
    hourlyRate: 0,
    password: '',
    confirmPassword: '',
    permissions: [],
  });

  const [errors, setErrors] = useState({
    passwordError: null,
    confirmPasswordError: null,
  });

  const employe = useMemo(() => {
    if (isEditMode) {
      const currentEmploye = employeStore.getById(employeId);
      return currentEmploye || localEmploye;
    }
    return localEmploye;
  }, [
    isEditMode,
    employeId,
    employeStore,
    employeStore.drafts,
    employeStore.services,
    ,
    localEmploye,
  ]);
  useEffect(() => {
    if (employeId) {
      setIsEditMode(true); // Режим редактирования
    } else {
      setIsEditMode(false); // Режим создания
    }
  }, [employeId]);

  const handleChange = (name, value, withId = true) => {
    if (isEditMode) {
      employeStore.changeById(employeId, name, value, withId);
    } else {
      setlocalEmploye((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleSubmit = async (onError = null) => {
    try {
      if (isEditMode) {
        await api.updateEmploye(employeId, employe); // Обновляем услугу
        employeStore.submitDraft(employeId);
      } else {
        // await api.createEmploye({
        //   ...localEmploye,
        //   ['birthday']: formatDateToBackend(localEmploye.birthday),
        // }); // Создаем новую услугу
        await api.createEmploye(
          mapSettingsDataToBackend(localEmploye, Object.keys(localEmploye)),
        );
      }
      handleSubmitSnackbar(
        isEditMode
          ? 'Сотрудник успешно отредактирован'
          : 'Сотрудник успешно создан',
      );
      onClose(); // Закрываем модалку
    } catch (error) {
      onError && onError();
    }
  };

  const validatePassword = (value) => {
    return value.length >= 4 ? true : 'Пароль должен быть не менее 4 символов';
  };

  const validateConfirmPassword = (value) => {
    return value === employe.password ? true : 'Пароли должны совпадать';
  };

  const handleReset = (path) => {
    if (isEditMode) {
      employeStore.resetDraft(employeId); // Сброс черновика в режиме редактирования
      employeStore.clearCurrentEmploye(); // Сброс черновика в режиме редактирования
    }
    onClose(); // Закрытие модалки
  };

  const handleDeleteEmployee = async () => {
    try {
      await api.deleteEmployee(employeId, page);
      handleInfo('Сотрудник уволен');
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      handleError('Ошибка при удалении:', error);
    }
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteEmployee}
        label="Вы уверены, что хотите уволить сотрудника?"
      />
      <FormValidatedModal
        customButtons={
          isEditMode && (
            <CustomButtonContainer>
              <DeleteButton
                handleDelete={() => setIsDeleteModalOpen(true)}
                label={'Удалить сотрудника '}
              />
            </CustomButtonContainer>
          )
        }
        closeButton={'Отменить'}
        handleSubmit={handleSubmit}
        handleClose={handleReset}
        size={'md'}
      >
        <div className={styles.name}>
          {isEditMode ? 'Редактирование сотрудника' : 'Создание сотрудника'}
        </div>
        <div className={cn(styles.flex, styles.addZIndex)}>
          <Calendar
            label={'Дата рождения'}
            name={'birthday'}
            value={employe.birthday}
            // readonly={true}
            className={styles.input}
            // placeholder={''}
            onChange={(element) =>
              handleChange(isEditMode ? 'birthday' : 'birthday', element)
            }
          />
          <Dropdown
            name={'position'}
            setValue={(e) =>
              handleChange(isEditMode ? 'position' : 'position', e)
            }
            classNameContainer={styles.input}
            renderValue={(val) => positions?.find((el) => el?.id === val)?.name}
            label={'Должность'}
            placeholder={'Должность'}
            value={employe?.position?.id}
            renderOption={(opt) => opt?.name}
            options={positions}
          />
        </div>
        <div className={cn(styles.flex, styles.lowZIndex)}>
          <TextInput
            required={true}
            placeholder={'Фамилия'}
            onChange={({ target }) =>
              handleChange(isEditMode ? 'lastName' : 'lastName', target.value)
            }
            name={isEditMode ? 'lastName' : 'lastName'}
            value={isEditMode ? employe.lastName : employe.lastName}
            edited={true}
            className={styles.input}
            label={'Фамилия'}
          />
          <TextInput
            required={true}
            placeholder={'Имя'}
            onChange={({ target }) =>
              handleChange(isEditMode ? 'name' : 'name', target.value)
            }
            name={isEditMode ? 'name' : 'name'}
            value={employe?.name || ''}
            edited={true}
            className={styles.input}
            label={'Имя'}
          />
        </div>
        <div className={styles.flex}>
          <TextInput
            required={false}
            placeholder={'Отчество'}
            onChange={({ target }) =>
              handleChange(
                isEditMode ? 'middleName' : 'middleName',
                target.value,
              )
            }
            name={isEditMode ? 'middleName' : 'middleName'}
            value={isEditMode ? employe.middleName : employe.middleName}
            edited={true}
            className={styles.input}
            label={'Отчество'}
          />
          {/*<div className={styles.radio_container}>*/}
          {/*    <label>Пол</label>*/}
          {/*    <div className={styles.radio_buttons}>*/}
          {/*        <Radio content={'Муж'} onChange={({target}) =>*/}
          {/*            handleChange(*/}
          {/*                isEditMode ? 'gender' : 'gender',*/}
          {/*                genderType.male*/}
          {/*            )*/}
          {/*        } name={'gender'} value={employe.gender === genderType.male || employe.gender === null}/>*/}
          {/*        <Radio content={'Жен'} onChange={({target}) =>*/}
          {/*            handleChange(*/}
          {/*                isEditMode ? 'gender' : 'gender',*/}
          {/*                genderType.female*/}
          {/*            )*/}
          {/*        } name={'gender'} value={employe.gender === genderType.female}/>*/}
          {/*    </div>*/}
          {/*</div>*/}
          <RadioGenderInput
            value={employe.gender}
            onChange={handleChange}
            isEditMode={isEditMode}
          />
        </div>
        <div className={styles.flex}>
          <TextInput
            required={true}
            placeholder={'Почта'}
            onChange={({ target }) =>
              handleChange(isEditMode ? 'email' : 'email', target.value)
            }
            name={isEditMode ? 'email' : 'email'}
            value={isEditMode ? employe.email : employe.email}
            edited={true}
            type={'email'}
            className={styles.input}
            label={'Почта'}
          />
          <TextInput
            required={true}
            placeholder={'Телефон'}
            onChange={({ target }) =>
              handleChange(isEditMode ? 'phone' : 'phone', target.value)
            }
            name={isEditMode ? 'phone' : 'phone'}
            value={isEditMode ? employe.phone : employe.phone}
            edited={true}
            type={'tel'}
            className={styles.input}
            label={'Телефон'}
          />
        </div>
        <div className={styles.flex}>
          <TextInput
            placeholder={'Ставка в час'}
            onChange={({ target }) =>
              handleChange(
                isEditMode ? 'hourlyRate' : 'hourlyRate',
                target.value,
              )
            }
            name={isEditMode ? 'hourlyRate' : 'hourlyRate'}
            value={isEditMode ? employe.hourlyRate : employe.hourlyRate}
            edited={true}
            type={'number'}
            className={styles.input}
            label={'Ставка в час'}
          />
          <div />
        </div>
        {(!employeId || (isEditMode && hasPermission(UserPermissions.SUPER_ADMIN))) && (
          <div className={styles.flex}>
            <TextInput
              required={!isEditMode && true}
              placeholder={'Новый пароль'}
              onChange={(e) => {
                console.log('target', e);
                handleChange(
                  isEditMode ? 'password' : 'password',
                  e.target.value,
                );
              }}
              name={'password'}
              value={isEditMode ? employe.password : employe.password}
              edited={true}
              className={cn(
                styles.input,
                errors.passwordError && styles.errorInput,
              )}
              label={'Новый пароль'}
              validate={validatePassword}
            />
            <div/>
          </div>
        )}
        <PermissionsSection
          permissions={employe.permissions}
          onChange={handleChange}
          isEditMode={isEditMode}
        />
      </FormValidatedModal>
    </>
  );
});

const PermissionsSection = ({ permissions = [], onChange, isEditMode }) => {
  const permissionGroups = {
    admin: {
      title: 'Администрирование',
      permissions: {
        'super admin': 'Супер администратор',
      },
    },
    deals: {
      title: 'Сделки',
      permissions: {
        'access deals': 'Доступ к сделкам',
        'access all deals': 'Доступ ко всем сделкам',
        'create deals': 'Создание сделок',
        'edit deals': 'Редактирование сделок',
        'delete deals': 'Удаление сделок',
      },
    },
    companies: {
      title: 'Компании',
      permissions: {
        'access companies': 'Доступ к компаниям',
        'access all companies': 'Доступ ко всем компаниям',
        'create companies': 'Создание компаний',
        'edit companies': 'Редактирование компаний',
        'delete companies': 'Удаление компаний',
      },
    },
    clients: {
      title: 'Клиенты',
      permissions: {
        'view clients': 'Просмотр клиентов',
        'create clients': 'Создание клиентов',
        'edit clients': 'Редактирование клиентов',
        'delete clients': 'Удаление клиентов',
      },
    },
    services: {
      title: 'Услуги',
      permissions: {
        'access services': 'Доступ к услугам',
        'access all services': 'Доступ ко всем услугам',
        'create services': 'Создание услуг',
        'edit services': 'Редактирование услуг',
        'delete services': 'Удаление услуг',
      },
    },
    tasks: {
      title: 'Задачи',
      permissions: {
        'view all tasks': 'Просмотр всех задач',
      },
    },
    bills: {
      title: 'Документы',
      permissions: {
        'access documents': 'Доступ к документам',
        'access all documents': 'Доступ ко всем документам',
        'create documents': 'Создание документов',
        'edit documents': 'Редактирование документов',
        'delete documents': 'Удаление документов',
      },
    },
    other: {
      title: 'Другое',
      permissions: {
        'access employees': 'Доступ к сотрудникам',
        'access legal entities': 'Доступ к юр. лицам',
        'view all time spendings': 'Доступ ко всем затратам',
        'access all calls': 'Доступ ко всем звонкам',
      },
    },
  };

  const handlePermissionChange = (permissionName, checked) => {
    let newPermissions = [...permissions];

    if (checked) {
      newPermissions.push(permissionName);
    } else {
      newPermissions = newPermissions.filter((p) => p !== permissionName);
    }

    onChange(isEditMode ? 'permissions' : 'permissions', newPermissions);
  };

  return (
    <div className={styles.permissionsContainer}>
      <div className={styles.permissionsTitle}>Права сотрудника</div>
      <div className={styles.permissionsList}>
        {Object.entries(permissionGroups).map(([groupKey, group]) => (
          <div key={groupKey} className={styles.permissionGroup}>
            <div className={styles.permissionGroupTitle}>{group.title}</div>
            {Object.entries(group.permissions).map(
              ([permissionKey, translation]) => (
                <div key={permissionKey} className={styles.permissionItem}>
                  <div className={styles.permissionLabel}>{translation}</div>
                  <Switch
                    value={permissions.includes(permissionKey)}
                    onChange={(name, value) =>
                      handlePermissionChange(permissionKey, value)
                    }
                  />
                </div>
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditModal;
