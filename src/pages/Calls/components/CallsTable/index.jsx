import React, {
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { observer } from 'mobx-react';
import Table from '../../../../shared/Table';
import styles from './Table.module.sass';
import {
  formatDate,
} from '../../../../utils/formate.date';
import Badge from '../../../../shared/Badge';
import {
  colorDirectionTypes,
  colorStatusTypes,
} from '../../calls.types';
import TextLink from '../../../../shared/Table/TextLink';
import useStore from '../../../../hooks/useStore';
import useCallsApi from '../../calls.api';
import { FiltersProvider } from '../../../../providers/FilterProvider';
import { LoadingProvider } from '../../../../providers/LoadingProvider';
import { createCallsFilters } from '../../calls.filter.conf';
import usePagingData from '../../../../hooks/usePagingData';
import { getQueryParam } from '../../../../utils/window.utils';
import CallsStats from './CallStats';
import ManagerCell from '../../../../components/ManagerCell';
import useAppApi from '../../../../api';
import CallAudioPlayer from '../CallAudioPlayer';

const CallsTable = observer(() => {
  const { callsStore } = useStore();
  const api = useCallsApi();
  const periodCalendarRef = useRef();
  const periodSelectorRef = useRef();
  const appApi = useAppApi();

  const fetchCalls = useCallback(
    (page) => {
      api.getCalls(page);
    },
    [],
  );

  const {
    currentPage,
    totalPages,
    totalItems,
    paginatedData,
    itemsPerPage,
    handlePageChange,
  } = usePagingData(callsStore, fetchCalls, () => callsStore?.getCalls());

  const handleFilterChange = async (filters) => {

    if (filters.date_range && !getQueryParam('date_range')) return;

    await api.getCalls(1).then(() => handlePageChange(1));
  };

  const renderContactInfo = useCallback((entity) => {
    //
    if (!entity) return <span>-</span>;

    return (
      <div className={styles.contactInfo}>
        {entity.name && (
          <TextLink to={`/clients/${entity.id}`}>{entity.name}</TextLink>
        )}
      </div>
    );
  }, []);

  const renderManagerContactInfo = useCallback((entity, phone) => {
    if (!entity) return <span>-</span>;

    return (
      <div className={styles.contactInfo}>
        <ManagerCell disableRole={true} manager={entity}>
          <span className={styles.info}>{phone}</span>
        </ManagerCell>
      </div>
    );
  }, []);

  const renderPhone = useCallback((phone) => {
    return <div className={styles.phone}>{phone}</div>;
  }, []);

  const renderWhoCallWithPhone = useCallback(({ client, company }, phone) => {
    if (!client) return <span>-</span>;

    return (
      <div className={styles.contactInfo}>
        <ManagerCell fioContainerClass={styles.fioContainer} companyName={company.name} companyLink={`/clients/${company.id}`} disableAvatar={true} disableRole={true} manager={client}>
          <span className={styles.info}>{phone}</span>
        </ManagerCell>
      </div>
    );
  }, []);


  const renderWhoCallInfo = useCallback((entity) => {
    if (!entity) return <span>-</span>;
    if (entity.client) {
      return renderWhoCallWithPhone(entity, entity.phoneClient);
    } else if (entity.company) {
      return renderContactInfo(entity.company);
    } else return renderPhone(entity.phoneClient);
  });

  // Table columns definition
  const cols = useMemo(
    () => [
      {
        Header: 'Тип/Дата',
        accessor: 'type',
        Cell: ({ row }) => {
          return (
            <div className={styles.typeCell}>
              <Badge
                statusType={colorDirectionTypes}
                status={row.original.type}
              />
              <div className={styles.callDate}>
                {formatDate(row.original.createdAt)}
              </div>
            </div>
          );
        },
      },
      {
        Header: 'Статус',
        accessor: 'success',
        Cell: ({ row }) => (
          <Badge statusType={colorStatusTypes} status={row.original.success} />
        ),
      },
      {
        Header: 'Кто звонил',
        accessor: 'company',
        Cell: ({ row }) => {
          return row.original?.manager
            ? renderManagerContactInfo(row.original.manager, row.original.phone)
            : renderPhone(row.original.phone);
        },
      },
      {
        Header: 'Кому звонили',
        accessor: 'manager',
        Cell: ({ row }) => {
          return renderWhoCallInfo(row.original);
        },
      },
      {
        id: 'record',
        Cell: ({ row }) => {
          return <CallAudioPlayer src={row.original.record} />;
        },
      },
    ],
    [renderContactInfo],
  );

  return (
    <FiltersProvider>
      <LoadingProvider isLoading={api.isLoading}>
        <div className={styles.container}>
          <Table
            beforeTable={() => (
              <div>
                <CallsStats />
              </div>
            )}
            headerActions={{
              sorting: true,
              settings: true,
              filter: {
                title: 'Фильтр',
                config: createCallsFilters({
                  appApi,
                  periodSelectorRef,
                  periodCalendarRef,
                }),
                onChange: handleFilterChange,
              },
            }}
            title="Звонки"
            data={paginatedData}
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
export default CallsTable;
