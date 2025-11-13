import React, {
  useMemo,
  useRef,
  useState,
} from 'react';
import { observer } from 'mobx-react';
import Table from '../../../../shared/Table';
import styles from './Table.module.sass';
import usePagingData from '../../../../hooks/usePagingData';
import { FiltersProvider } from '../../../../providers/FilterProvider';
import { LoadingProvider } from '../../../../providers/LoadingProvider';
import { usePermissions } from '../../../../providers/PermissionProvider';
import TimeSpendingStats from './components/Stats';
import { createTimeSpendingFilters } from '../../timetracking.filters';
import useStore from '../../../../hooks/useStore';
import useTimeTrackingApi from '../../timeTracking.api';
import { handleError } from '../../../../utils/snackbar';
import ManagerCell from '../../../../components/ManagerCell';
import EditModal from '../../../Settings/components/EmployesTable/components/EditModal';
import useEmployesApi from '../../../Settings/api/employes.api';
import useAppApi from '../../../../api';
import { getQueryParam } from '../../../../utils/window.utils';
import TableLink from '../../../../shared/Table/Row/Link';
import { UserPermissions } from '../../../../shared/userPermissions';

const TimeTrackingsTable = observer(() => {
  const { timeTrackingStore } = useStore();
  const api = useTimeTrackingApi();
  const appApi = useAppApi();
  useEmployesApi();
  const { hasPermission, permissions } = usePermissions();
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

  const hasAllTimeSpendingsAccess = useMemo(
    () => hasPermission(UserPermissions.VIEW_ALL_TIME_SPENDINGS),
    [permissions],
  );

  const formatDuration = (timeSpent) => {
    if (!timeSpent) return '-';
    return `${timeSpent.hours} ч ${timeSpent.minutes} мин`;
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
        Header: 'Активность',
        id: 'task',
        width: '10%',
        Cell: ({ row }) => (
          <TableLink to={row.original.link} name={<span>{row.original.link_title}</span>} />
        ),
      },
    ],
    [],
  );

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
      </LoadingProvider>
    </FiltersProvider>
  );
});

export default TimeTrackingsTable;
