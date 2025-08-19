import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { observer } from 'mobx-react';
import Table from '../../../../shared/Table';
import styles from './Table.module.sass';
import { formatDateToQuery } from '../../../../utils/formate.date';
import usePagingData from '../../../../hooks/usePagingData';
import { FiltersProvider } from '../../../../providers/FilterProvider';
import { LoadingProvider } from '../../../../providers/LoadingProvider';
import { usePermissions } from '../../../../providers/PermissionProvider';
import TextLink from '../../../../shared/Table/TextLink';
import useQueryParam from '../../../../hooks/useQueryParam';
import { formatDateForUrl } from '../../../Documents/components/BillsTable';
import TimeSpendingStats from './components/Stats';
import { createTimeSpendingFilters } from '../../timetracking.filters';
import useStore from '../../../../hooks/useStore';
import useTimeTrackingApi from '../../timeTracking.api';
import { startOfDay, sub } from 'date-fns';
import { handleError, handleInfo } from '../../../../utils/snackbar';
import ManagerCell from '../../../../components/ManagerCell';
import EditModal from '../../../Settings/components/EmployesTable/components/EditModal';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import useEmployesApi from '../../../Settings/api/employes.api';
import useAppApi from '../../../../api';
import { getQueryParam } from '../../../../utils/window.utils';
import Link from '../../../../shared/Table/Row/Link';
import TableLink from '../../../../shared/Table/Row/Link';
import { UserPermissions } from '../../../../shared/userPermissions';
// import { Permissions } from '../../../../shared/permissions';

const TimeTrackingsTable = observer(() => {
  const { timeTrackingStore } = useStore();
  const api = useTimeTrackingApi();
  const appApi = useAppApi();
  const employeApi = useEmployesApi();
  const { hasPermission, permissions, Permissions } = usePermissions();
  const periodCalendarRef = useRef();

  const handleFilterChange = async (filters) => {
    try {
      if (filters.date_range && !getQueryParam('date_range')) return;
      await api.getTimeTrackings(currentPage ?? 1);
    } catch (error) {
      handleError('Ошибка при применении фильтров:', JSON.stringify(error));
    }
  };
  const { time: totalTime, cost: totalCost } =
    timeTrackingStore.getStats() ?? {};
  const [currentEmploye, setCurrentEmploye] = useState(null);
  const [employeeDelete, setEmployeeDelete] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const {
    currentPage,
    totalPages,
    totalItems,
    paginatedData,
    itemsPerPage,
    handlePageChange,
  } = usePagingData(timeTrackingStore, handleFilterChange, () =>
    timeTrackingStore?.getTimeTrackingsArray(),
  );

  // useEffect(() => {
  //   api.getTimeTrackings(
  //     currentPage,
  //     from ?? formatDateToQuery(new Date()),
  //     to ?? formatDateToQuery(new Date()),
  //   );
  // }, [from, to]);

  const hasAllTimeSpendingsAccess = useMemo(
    () => hasPermission(UserPermissions.VIEW_ALL_TIME_SPENDINGS),
    [permissions],
  );

  const formatDuration = (timeSpent) => {
    if (!timeSpent) return '-';
    return `${timeSpent.hours} ч ${timeSpent.minutes} мин`;
  };

  const handleEdit = (employe) => {
    setCurrentEmploye(employe);
    setEditModalOpen(true);
  };

  const cols = useMemo(
    () => [
      {
        Header: 'Сотрудник',
        id: 'employee',
        width: '20%',
        accessor: 'employee.name',
        Cell: ({ row }) => {
          const manager = row.original.employee;
          const employee = {
            ...manager,
            fio: `${manager.lastName ?? ''} ${manager.name ?? ''} ${manager.middleName ?? ''}`,
          };
          return <ManagerCell manager={employee} />;
        },
      },
      {
        Header: 'Дата',
        id: 'date',
        width: '15%',
        accessor: 'date',
        Cell: ({ value }) => (
          <span>{new Date(value).toLocaleDateString()}</span>
        ),
      },

      {
        Header: 'Затраченное время',
        id: 'timeSpent',
        width: '20%',
        accessor: 'timeSpent',
        Cell: ({ value }) => formatDuration(value),
      },
      {
        Header: 'Стоимость',
        id: 'cost',
        width: '15%',
        accessor: 'cost',
        Cell: ({ value }) => (
          <span>{value ? `${value.toLocaleString()} ₽` : '-'}</span>
        ),
      },
      {
        Header:'Задача',
        id:'task',
        width: '10%',
        Cell: ({ row }) => (
          <TableLink to={row.original.link} name={<span>Задача #{row.original.taskId}</span>} />
        )
      }
    ],
    [],
  );

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await employeApi.deleteEmployee(employeeId, currentPage);
      handleInfo('Сотрудник уволен');
    } catch (error) {
      handleError('Ошибка при уольнении:', error);
    }
  };

  return (
    <FiltersProvider>
      <LoadingProvider isLoading={false}>
        {editModalOpen && (
          <EditModal
            employeId={currentEmploye?.id ?? null}
            onClose={() => {
              setEditModalOpen(false);
              setCurrentEmploye(null);
            }}
          />
        )}
        <div className={styles.table}>
          <Table
            beforeTable={() => (
              <TimeSpendingStats totalTime={totalTime} totalCost={totalCost} />
            )}
            headerActions={{
              sorting: true,
              settings: true,
              filter: {
                classNameBody: styles.filter_container,
                title: 'Фильтр',
                hasFirstCall: false,
                config: createTimeSpendingFilters({
                  appApi,
                  periodCalendarRef,
                  hasAllTimeSpendingsAccess,
                }),
                onChange: (filters) => {
                  handlePageChange(1);
                  return handleFilterChange(filters);
                },
              },
            }}
            title="Учет времени"
            data={Array.isArray(paginatedData) ? paginatedData : []}
            columns={cols}
            paging={{
              totalPages,
              current: currentPage,
              all: totalItems,
              offset: itemsPerPage,
              onPageChange: handlePageChange,
            }}
          />
        </div>
        {employeeDelete !== null && (
          <ConfirmationModal
            isOpen={employeeDelete !== null}
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
    </FiltersProvider>
  );
});

export default TimeTrackingsTable;
