import React, { useState } from 'react';
import { observer } from 'mobx-react';
import Table from '../../../../shared/Table';
import Badge, { statusTypes } from '../../../../shared/Badge';
import ManagerCell from '../../../../components/ManagerCell';
import StagesCell from './components/StagesCell';
import { getCorrectWordForm } from '../../../../utils/format.string';
import usePagingData from '../../../../hooks/usePagingData';
import useServiceApi from '../../services.api';
import TableLink from '../../../../shared/Table/Row/Link';
import Tooltip from '../../../../shared/Tooltip';
import EditModal from './components/EditModal';
import AdaptiveCard from './components/AdaptiveCard';
import styles from './Table.module.sass';
import useStore from '../../../../hooks/useStore';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { handleError, handleInfo } from '../../../../utils/snackbar';
import { createServicesFilters } from '../../services.filter.conf';
import useAppApi from '../../../../api';
import { FiltersProvider } from '../../../../providers/FilterProvider';

const ServicesTable = observer(() => {
  const { servicesStore } = useStore();
  const api = useServiceApi();
  const appApi = useAppApi();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);


  const handleFilterChange = async (filters) => {
    await api.getServices(1, filters);
  };

  const {
    currentPage,
    totalItems,
    paginatedData,
    itemsPerPage,
    handlePageChange,
  } = usePagingData(servicesStore, handleFilterChange, () =>
    servicesStore?.getServices(),
  );

  const handleEdit = (service) => {
    setCurrentService(service);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteService(id, currentPage);
      handleInfo('Услуга удалена');
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      handleError('Ошибка при удалении:', error);
    }
  };

  const getActions = (data) => [
    { label: 'Редактировать', onClick: () => handleEdit(data) },
    {
      label: 'Удалить',
      onClick: () => setServiceToDelete(data.id),
      disabled: data.id === 0, // Можно добавить дополнительные условия для деактивации
    },
  ];

  const cols = React.useMemo(
    () => [
      {
        Header: 'ID',
        id: 'id',
        accessor: 'id',
        Cell: ({ row }) => <span>{row.original.id}</span>,
      },
      {
        Header: 'Услуга',
        id: 'title',
        accessor: 'title',
        minWidth: '250px',
        width: '30%',
        Cell: ({ row }) => (
          <TableLink
            to={`/services/${row.original.id}`}
            name={row.original.title}
          />
        ),
      },
      {
        Header: 'Менеджер',
        id: 'manager',
        minWidth: '80px',
        width: '25%',
        accessor: 'manager.name',
        Cell: ({ row }) => <ManagerCell manager={row.original.manager} />,
      },
      {
        Header: 'Команда',
        id: 'command',
        minWidth: '80px',
        width: '10%',
        Cell: ({ row }) => {
          const data = row.original;
          const teamMembers = data.command.map((member) => (
            <p key={member.id}>
              {member.name} {member.surname}
            </p>
          ));
          return (
            <Tooltip title={teamMembers}>
              <div>
                <TableLink
                  cls={styles.teamLink}
                  name={getCorrectWordForm(data.command.length, 'участник')}
                />
              </div>
            </Tooltip>
          );
        },
      },
      {
        Header: 'Статус',
        id: 'status',
        minWidth: '160px',
        Cell: ({ row }) => (
          <Badge
            classname={styles.badge}
            status={row.original.status}
            statusType={statusTypes.services}
          />
        ),
      },
      {
        Header: 'Этапы',
        id: 'stages',
        width: '20%',
        minWidth: '100px',
        Cell: ({ row }) => {
          const maxCellLength = Math.floor(800 / 18);
          return (
            <StagesCell
              serviceId={row.original.id}
              stages={row.original.stages}
              maxCellLength={maxCellLength}
            />
          );
        },
      },
    ],
    [],
  );

  return (
    <FiltersProvider>
      <div className={styles.table}>
        <Table
          cardComponent={(data) => (
            <AdaptiveCard data={data} statusType={statusTypes.services} />
          )}
          headerActions={{
            sorting: true,
            settings: true,
            add: {
              action: () => setEditModalOpen(true),
              title: 'Добавить услугу',
            },
            filter: {
              title: 'Фильтр',
              config: createServicesFilters(appApi),
              onChange: (filters) => {
                handlePageChange(1);
                return handleFilterChange(filters);
              },
            },
          }}
          title="Услуги"
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
          serviceId={currentService?.id ?? null}
          onClose={() => {
            setEditModalOpen(false);
            setCurrentService(null);
          }}
        />
      )}
      {serviceToDelete !== null && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setServiceToDelete(null)}
          onConfirm={() => {
            handleDelete(serviceToDelete).then(() => {
              setServiceToDelete(null);
            });
          }}
          label="Вы уверены, что хотите удалить клиента?"
        />
      )}
    </FiltersProvider>
  );
});

export default ServicesTable;
