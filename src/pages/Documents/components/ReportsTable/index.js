import { observer } from 'mobx-react';
import React, {
  useMemo,
  useRef,
  useState,
} from 'react';
import usePagingData from '../../../../hooks/usePagingData';
import TableLink from '../../../../shared/Table/Row/Link';
import useStore from '../../../../hooks/useStore';
import useReportsApi from '../../api/reports.api';
import Table from '../../../../shared/Table';
import Badge, { statusTypes } from '../../../../shared/Badge';
import styles from './Table.module.sass';
import TextLink from '../../../../shared/Table/TextLink';
import ReportsStats from './components/ReportsStats';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { handleError, handleInfo } from '../../../../utils/snackbar';
import { FiltersProvider } from '../../../../providers/FilterProvider';
import { createReportsFilters } from '../../filters/reports.filter.conf';
import { LoadingProvider } from '../../../../providers/LoadingProvider';
import { getQueryParam } from '../../../../utils/window.utils';
import useAppApi from '../../../../api';

const ReportsTable = observer(({ currentSwitcher }) => {
  const { reportsStore } = useStore();
  const api = useReportsApi();
  const appApi = useAppApi();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [reportToDelete, setReportToDelete] = useState(null);

  const handleFilterChange = async (filters) => {
    await api.getReports(Number(currentPage));
  };

  const {
    currentPage,
    totalPages,
    totalItems,
    paginatedData,
    itemsPerPage,
    handlePageChange,
  } = usePagingData(reportsStore, handleFilterChange, () =>
    reportsStore?.getReports(),
  );

  const handleEdit = (report) => {
    setCurrentReport(report);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteReport(id, currentPage);
      handleInfo('Отчет удален');
    } catch (error) {
      handleError('Ошибка при удалении:', error);
    }
  };

  const handleDownload = (urlToReport) => {
    window.open(urlToReport, '_blank');
  };

  const getActions = (data) => [
    { label: 'Скачать', onClick: () => handleDownload(data.downloadUrl) },
    { label: 'Редактировать', onClick: () => handleEdit(data) },
    {
      label: 'Удалить',
      onClick: () => setReportToDelete(data.id),
      disabled: data.id === 0,
    },
  ];

  const cols = useMemo(
    () => [
      {
        Header: 'Номер отчета',
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
        Header: 'Период',
        id: 'period',
        width: '15%',
        accessor: 'period',
        Cell: ({ row }) => (
          <span>{row.original.period}</span>
        ),
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
        Header: 'Тип услуги',
        id: 'serviceType',
        width: '15%',
        accessor: 'serviceType',
        Cell: ({ row }) => (
          <span>{row.original.serviceType}</span>
        ),
      },
      {
        Header: 'Статус',
        id: 'status',
        Cell: ({ row }) => (
          <Badge
            classname={styles.badge}
            status={row.original.status}
            statusType={statusTypes.reports}
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
                <ReportsStats />
              </div>
            )}
            switchers={[
              { key: 'bill', to: '?filter=bill', name: 'Счета' },
              { key: 'act', to: '?filter=act', name: 'Акты' },
              { key: 'report', to: '?filter=report', name: 'Отчеты' },
            ]}
            headerActions={{
              sorting: true,
              settings: true,
              add: {
                action: () => setEditModalOpen(true),
                title: 'Создать отчет',
              },
              filter: {
                classNameBody: styles.filter_container,
                title: 'Фильтр',
                hasFirstCall: false,
                config: createReportsFilters({ appApi }),
                onChange: (filters) => {
                  handlePageChange(1);
                  return handleFilterChange(filters);
                },
              },
            }}
            title="Отчеты"
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
        {/* EditModal будет добавлен позже */}
        {editModalOpen && (
          <div>
            {/* Placeholder для модалки редактирования */}
            <button onClick={() => setEditModalOpen(false)}>Закрыть</button>
          </div>
        )}
        {reportToDelete !== null && (
          <ConfirmationModal
            isOpen={reportToDelete !== null}
            onClose={() => setReportToDelete(null)}
            onConfirm={() => {
              handleDelete(reportToDelete).then(() => {
                setReportToDelete(null);
              });
            }}
            label="Вы уверены, что хотите удалить отчет?"
          />
        )}
      </LoadingProvider>
    </FiltersProvider>
  );
});

export default ReportsTable;