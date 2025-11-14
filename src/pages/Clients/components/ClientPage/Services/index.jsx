import React, { useMemo, useState } from 'react';
import ManagerCell from '../../../../../components/ManagerCell';
import Table from '../../../../../shared/Table';
import AdaptiveCard from './AdaptiveCard';
import { formatDateWithDateAndYear } from '../../../../../utils/formate.date';
import styles from './Services.module.sass';
import TextLink from '../../../../../shared/Table/TextLink';
import EditModal from '../../../../Services/components/ServicesTable/components/EditModal';

const ClientService = ({ services, currentClient }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentService] = useState(null);

  const cols = React.useMemo(
    () => [
      {
        Header: 'Услуга',
        id: 'service',
        Cell: ({ row }) => {
          const data = row?.original;
          return (
            <TextLink to={`/services/${data.id}`} className={styles.link}>
              {data?.description}
            </TextLink>
          );
        },
      },
      {
        Header: 'Менеджер',
        id: 'manager',
        sortType: 'basic',
        accessor: 'manager.name',
        Cell: ({ row }) => {
          const data = row?.original;
          return <ManagerCell manager={data.manager} />;
        },
      },
      {
        Header: 'Дедлайн',
        id: 'deadline',
        Cell: ({ row }) => {
          const data = row?.original;
          return <p>{formatDateWithDateAndYear(data.deadline)}</p>;
        },
      },
    ],
    [],
  );
  const data = useMemo(() => services ?? [], services);
  return (
    <div>
      <Table
        onPagination={true}
        smallTable={true}
        headerInCard={true}
        cardComponent={(data, onPagination) => (
          <AdaptiveCard
            onPagination={onPagination}
            className={styles.card_adaptive}
            data={data}
          />
        )}
        headerActions={{
          sorting: true,
          add: {
            action: () => setEditModalOpen(true),
            title: '',
          },
        }}
        title={'Услуги'}
        data={data}
        columns={cols}
      />
      {editModalOpen && (
        <EditModal
          client={currentClient}
          serviceId={currentService?.id ?? null}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ClientService;
