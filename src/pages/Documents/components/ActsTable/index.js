import { observer } from 'mobx-react';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import usePagingData from '../../../../hooks/usePagingData';
import TableLink from '../../../../shared/Table/Row/Link';
import useStore from '../../../../hooks/useStore';
import useBillsApi from '../../api/bills.api';
import useDocumentsPrintApi from '../../api/documents-print.api';
import Table from '../../../../shared/Table';
import Badge, { statusTypes } from '../../../../shared/Badge';
import styles from './Table.module.sass';
import TextLink from '../../../../shared/Table/TextLink';
import BillsStats from './components/BillsStats';
import useQueryParam from '../../../../hooks/useQueryParam';
import { formatDateToQuery } from '../../../../utils/formate.date';
import { format, startOfDay, sub } from 'date-fns';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { handleError, handleInfo } from '../../../../utils/snackbar';
import TaskFilter from '../../../Tasks/components/TaskFilter';
import BillsTableFilter from './components/BillsFilters/BillsTableFilter';
import BillsFilter from './components/BillsFilters/BillsFilter';
import { FiltersProvider } from '../../../../providers/FilterProvider';
import { createTaskFilters } from '../../../Tasks/tasks.filter.conf';
import { createBillsFilters } from '../../filters/bills.filter.conf';
import { LoadingProvider } from '../../../../providers/LoadingProvider';
import { getQueryParam } from '../../../../utils/window.utils';
import { createActsFilter } from '../../filters/acts.filter.conf';
import useActsApi from '../../../Acts/acts.api';
import EditModal from '../../../Acts/components/ActsTable/components/EditModal';
import useAppApi from '../../../../api';

export const formatDateForUrl = (date) => {
  return format(date, 'yyyy-MM-dd');
};

const ActsTable = observer(({currentSwitcher}) => {
  const { actsStore } = useStore();
  const docApi = useBillsApi();
  const api = useActsApi();
  const appApi = useAppApi();
  const documentsPrintApi = useDocumentsPrintApi();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentAct, setCurrentAct] = useState(null);
  const [actToDelete, setActToDelete] = useState(null);
  const periodCalendarRef = useRef();
  const periodSelectorRef = useRef();

  const handleFilterChange = async (filters) => {
    if (filters?.date_range && !getQueryParam('date_range')) return;
    await api.getActs(Number(currentPage),currentSwitcher);
  };

  const {
    currentPage,
    totalPages,
    totalItems,
    paginatedData,
    itemsPerPage,
    handlePageChange,
  } = usePagingData(actsStore, handleFilterChange, () =>
    actsStore?.getActs(1,currentSwitcher),
);

  const handleEdit = (bill) => {
    setCurrentAct(bill);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteAct(id, currentPage);
      handleInfo('Услуга удалена');
    } catch (error) {
      handleError('Ошибка при удалении:', error);
    }
  };

  const handleView = (actId) => {
    window.open(`/acts/${actId}?stamp=1`, '_blank');
  };

  const handleDownload = async (actId) => {
    try {
      await documentsPrintApi.downloadActPdf(actId, true);
    } catch (error) {
      handleError('Ошибка при скачивании акта');
    }
  };

  const getActions = (data) => [
    { label: 'Просмотр', onClick: () => handleView(data.id) },
    { label: 'Скачать', onClick: () => handleDownload(data.id) },
    { label: 'Редактировать', onClick: () => handleEdit(data) },
    {
      label: 'Удалить',
      onClick: () => setActToDelete(data.id),
      disabled: data.id === 0,
    },
  ];

  const cols = useMemo(
    () => [
      {
        Header: 'Номер акта',
        id: 'number',
        accessor: 'number',
        width: '15%',
        Cell: ({ row }) => (
          <TableLink
            onClick={() => handleEdit(row.original)}
            name={row.original.number}
          />
        ),
      },
      {
        Header: 'Дата создания',
        id: 'creationDate',
        width: '15%',
        accessor: 'creationDate',
        Cell: ({ row }) => (
          <span>
            {new Date(row.original.creationDate).toLocaleDateString()}
          </span>
        ),
      },
      // {
      //   Header: 'План. дата оплаты',
      //   id: 'paymentDate',
      //   width: '15%',
      //   accessor: 'paymentDate',
      //   Cell: ({ row }) => (
      //     <span>{new Date(row.original.paymentDate).toLocaleDateString()}</span>
      //   ),
      // },
      {
        Header: 'Сумма',
        id: 'sum',
        width: '15%',
        accessor: 'sum',
        Cell: ({ row }) => {
          return <span>{row.original.sum.toLocaleString()} руб.</span>;
        },
      },
      {
        Header: 'Клиент',
        id: 'company',
        width: '20%',
        accessor: 'company.name',
        Cell: ({ row }) => {
          return row.original.company ? (
            <TextLink to={`/clients/${row.original.company.id}`}>
              {row.original.company.name}
            </TextLink>
          ) : (
            <></>
          );
        },
      },

      {
        Header: 'Статус',
        id: 'signed',
        Cell: ({ row }) => (
          <Badge
            classname={styles.badge}
            status={row.original.status}
            statusType={statusTypes.acts}
          />
        ),
      },
    ],
    [],
  );

  return (
    <FiltersProvider>
      <LoadingProvider isLoading={api.isLoading}>
        <div className={styles.table}>
          <Table
            settingsSwithcerValue={currentSwitcher}
            beforeTable={() => (
              <div>
                {/*<BillsTableFilter />*/}
                <BillsStats />
              </div>
            )}
            switchers={[
              {key:'bill',to:'?filter=bill',name:'Счета'},
              {key:'act',to:'?filter=act',name:'Акты'},
              {key:'report',to:'?filter=report',name:'Отчеты'},
            ]}
            // cardComponent={(data) => (
            //   <AdaptiveCard data={data} statusType={statusTypes.bills} />
            // )}

            headerActions={{
              sorting: true,
              settings: true,
              add: {
                action: () => setEditModalOpen(true),
                title: 'Добавить акт',
              },
              filter: {
                classNameBody: styles.filter_container,
                title: 'Фильтр',
                hasFirstCall: false,
                config: createActsFilter({
                  appApi,
                  periodSelectorRef,
                  periodCalendarRef,
                }),
                onChange: (filters) => {
                  handlePageChange(1);
                  return handleFilterChange(filters);
                },
              },
            }}
            title="Акты
           "
            data={paginatedData}
            columns={cols}
            actions={getActions}
            paging={{
              totalPages,
              current: currentPage,
              all: totalItems,
              offset: itemsPerPage,
              onPageChange: handlePageChange,
            }}
          />
        </div>
        {editModalOpen && (
          <EditModal
            actId={currentAct?.id ?? null}
            onClose={() => {
              setEditModalOpen(false);
              setCurrentAct(null);
            }}
          />
        )}
        {actToDelete !== null && (
          <ConfirmationModal
            isOpen={actToDelete !== null}
            onClose={() => setActToDelete(null)}
            onConfirm={() => {
              handleDelete(actToDelete).then(() => {
                setActToDelete(null);
              });
            }}
            label="Вы уверены, что хотите удалить акт?"
          />
        )}
      </LoadingProvider>
    </FiltersProvider>
  );
});

export default ActsTable;
