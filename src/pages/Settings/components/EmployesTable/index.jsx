import { observer } from 'mobx-react';
import useStore from '../../../../hooks/useStore';
import { useCallback, useState } from 'react';
import usePagingData from '../../../../hooks/usePagingData';
import ManagerCell from '../../../../components/ManagerCell';
import Badge, { statusTypes } from '../../../../shared/Badge';
import Table from '../../../../shared/Table';
import useEmployesApi from '../../api/employes.api';
import { genderTypeRu } from '../../settings.types';
import styles from './Table.module.sass';
import React from 'react';
import { LoadingProvider } from '../../../../providers/LoadingProvider';
import EditModal from './components/EditModal';
import {
  formatDateWithOnlyDigits,
} from '../../../../utils/formate.date';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { handleError, handleInfo } from '../../../../utils/snackbar';

const EmployesTable = observer(({ currentSwitcher }) => {
  const { employesStore } = useStore();
  const api = useEmployesApi();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEmploye, setCurrentEmploye] = useState(null);
  const [employeeDelete, setEmployeeDelete] = useState(null);

  const fetchEmployes = useCallback((page) => {
    api.getEmployes(page);
  }, []);

  const {
    currentPage,
    totalItems,
    paginatedData,
    itemsPerPage,
    handlePageChange,
  } = usePagingData(employesStore, fetchEmployes, () =>
    employesStore?.getEmployes(),
  );

  const handleEdit = (employe) => {
    setCurrentEmploye(employe);
    setEditModalOpen(true);
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await api.deleteEmployee(employeeId, currentPage);
      handleInfo('Сотрудник уволен');
    } catch (error) {
      handleError('Ошибка при увольнении:', error);
    }
  };

  const getActions = (data) => [
    { label: 'Редактировать', onClick: () => handleEdit(data) },
    {
      label: 'Уволить',
      onClick: () => setEmployeeDelete(data.id),
      disabled: data.id === 0, // Можно добавить дополнительные условия для деактивации
    },
  ];

  const cols = React.useMemo(
    () => [
      {
        Header: 'ID',
        id: 'id',
        accessor: 'id',
        width: '0',
        Cell: ({ row }) => <span>{row.original.id}</span>,
      },
      {
        Header: 'Сотрудник',
        id: 'employee',
        accessor: 'employee',
        width: '50%',
        Cell: ({ row }) => {
          const employee = {
            ...row.original,
            surname: row.original.lastName,
            role: row.original.position?.title ?? row.original.position?.name,
          };
          return <ManagerCell manager={employee} />;
        },
      },
      {
        Header: 'Пол',
        id: 'gender',
        width: '12%',
        accessor: 'gender',
        Cell: ({ row }) => <p>{genderTypeRu[row.original.gender]}</p>,
      },
      {
        Header: 'Статус',
        id: 'status',
        Cell: ({ row }) => (
          <Badge
            classname={styles.badge}
            status={row.original.status}
            statusType={statusTypes.employes}
          />
        ),
      },
      {
        Header: 'Дата рождения',
        id: 'birthday',
        Cell: ({ row }) =>
          row.original.birthday ? (
            <p>{formatDateWithOnlyDigits(row.original.birthday)}</p>
          ) : (
            <p>Не указано</p>
          ),
      },
    ],
    [],
  );

  return (
    <LoadingProvider isLoading={api.isLoading}>
      <div className={styles.table}>
        <Table
          headerActions={{
            sorting: true,
            add: {
              action: () => setEditModalOpen(true),
              title: 'Добавить сотрудника',
            },
          }}
          title="Сотрудники"
          switchers={[
            { key: 'legals', to: '?filter=legals', name: 'Юр. лица' },
            { key: 'employers', to: '?filter=employers', name: 'Сотрудники' },
          ]}
          settingsSwithcerValue={currentSwitcher}
          data={paginatedData}
          columns={cols}
          actions={getActions}
          paging={{
            current: currentPage,
            all: totalItems,
            offset: itemsPerPage,
            onPageChange: handlePageChange,
          }}
        />
      </div>
      {editModalOpen && (
        <EditModal
          employeId={currentEmploye?.id ?? null}
          onClose={() => {
            setEditModalOpen(false);
            setCurrentEmploye(null);
          }}
        />
      )}

      {employeeDelete !== null && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setEmployeeDelete(null)}
          onConfirm={() => {
            handleDeleteEmployee(employeeDelete).then(() => {
              setEmployeeDelete(null);
            });
          }}
          label="Вы уверены, что хотите уволить сотрудника?"
        />
      )}
    </LoadingProvider>
  );
});

export default EmployesTable;
