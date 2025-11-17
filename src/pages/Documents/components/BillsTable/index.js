import { observer } from 'mobx-react';

import React, {
  useMemo,
  useRef,
  useState,
} from 'react';
import usePagingData from '../../../../hooks/usePagingData';
import TableLink from '../../../../shared/Table/Row/Link';
import EditModal from './components/EditModal';
import useStore from '../../../../hooks/useStore';
import useBillsApi from '../../api/bills.api';
import useDocumentsPrintApi from '../../api/documents-print.api';
import Table from '../../../../shared/Table';
import Badge, { statusTypes } from '../../../../shared/Badge';
import styles from './Table.module.sass';
import TextLink from '../../../../shared/Table/TextLink';
import BillsStats from './components/BillsStats';
import { format } from 'date-fns';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { handleError, handleInfo } from '../../../../utils/snackbar';
import { FiltersProvider } from '../../../../providers/FilterProvider';
import { createBillsFilters } from '../../filters/bills.filter.conf';
import { LoadingProvider } from '../../../../providers/LoadingProvider';
import { getQueryParam } from '../../../../utils/window.utils';
import useAppApi from '../../../../api';
import BillsAdaptiveCard from './components/BillsAdaptiveCard';

export const formatDateForUrl = (date) => {
  return format(date, 'yyyy-MM-dd');
};

const BillsTable = observer(({ currentSwitcher }) => {
  const { billsStore } = useStore();
  const api = useBillsApi();
  const appApi = useAppApi();
  const documentsPrintApi = useDocumentsPrintApi();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);
  const [billToDelete, setBillToDelete] = useState(null);
  const periodCalendarRef = useRef();
  const periodSelectorRef = useRef();

  const handleFilterChange = async (filters) => {
    if (filters?.date_range && !getQueryParam('date_range')) return;
    await api.getBills(Number(currentPage), currentSwitcher);
  };

  const {
    currentPage,
    totalPages,
    totalItems,
    paginatedData,
    itemsPerPage,
    handlePageChange,
  } = usePagingData(billsStore, handleFilterChange, () =>
    billsStore?.getBills(1, currentSwitcher),
  );

  const handleEdit = (bill) => {
    setCurrentBill(bill);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteBill(id, currentPage);
      handleInfo('Счет удален');
    } catch (error) {
      handleError('Ошибка при удалении:', error);
    }
  };

  const handleDownload = async (billId) => {
    try {
      await documentsPrintApi.downloadBillPdf(billId, true);
    } catch (error) {
      handleError('Ошибка при скачивании счета');
    }
  };

  const getActions = (data) => [
    { label: 'Просмотр', onClick: () => window.open(`/documents/bills/${data.id}?stamp=1`, '_blank') },
    { label: 'Скачать', onClick: () => handleDownload(data.id) },
    { label: 'Редактировать', onClick: () => handleEdit(data) },
    { label: 'Удалить', onClick: () => setBillToDelete(data.id), disabled: data.id === 0 },
  ];

  const cols = useMemo(
    () => [
      {
        Header: 'Номер счета',
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
      {
        Header: 'План. дата оплаты',
        id: 'paymentDate',
        width: '15%',
        accessor: 'paymentDate',
        Cell: ({ row }) => (
          <span>{new Date(row.original.paymentDate).toLocaleDateString()}</span>
        ),
      },
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
        id: 'status',
        Cell: ({ row }) => (
          <Badge
            classname={styles.badge}
            status={row.original.status}
            statusType={statusTypes.bills}
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
            switchers={[
              { key: 'bill', to: '?filter=bill', name: 'Счета' },
              { key: 'act', to: '?filter=act', name: 'Акты' },
              { key: 'report', to: '?filter=report', name: 'Отчеты' },
            ]}
            beforeTable={() => (
              <div>
                <BillsStats />
              </div>
            )}
            headerActions={{
              sorting: true,
              settings: true,
              add: {
                action: () => setEditModalOpen(true),
                title: 'Добавить счет',
              },
              filter: {
                classNameBody: styles.filter_container,
                title: 'Фильтр',
                hasFirstCall: false,
                config: createBillsFilters({
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
            title="Счета"
            data={paginatedData}
            columns={cols}
            actions={getActions}
            cardComponent={(data) => (
              <BillsAdaptiveCard data={data} actions={getActions} />
            )}
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
            billId={currentBill?.id ?? null}
            onClose={() => {
              setEditModalOpen(false);
              setCurrentBill(null);
            }}
          />
        )}
        {billToDelete !== null && (
          <ConfirmationModal
            isOpen={true}
            onClose={() => setBillToDelete(null)}
            onConfirm={() => {
              handleDelete(billToDelete).then(() => {
                setBillToDelete(null);
              });
            }}
            label="Вы уверены, что хотите удалить счет?"
          />
        )}
      </LoadingProvider>
    </FiltersProvider>
  );
});

export default BillsTable;
