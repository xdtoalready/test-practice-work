import React, { useMemo, useState } from 'react';
import TableLink from '../../../../../shared/Table/Row/Link';
import Badge, { statusTypes } from '../../../../../shared/Badge';
import ManagerCell from '../../../../../components/ManagerCell';
import ServicesCell from '../../ClientsTable/Cells/ServicesCell';
import ActivitiesCell from '../../ClientsTable/Cells/ActivitiesCell';
import clients from '../../../index';
import Table from '../../../../../shared/Table';
import AdaptiveCard from './AdaptiveCard';
import { formatDate, formatDateWithDateAndYear, formatDateWithoutHours } from '../../../../../utils/formate.date';
import styles from './Services.module.sass';
import { Link } from 'react-router-dom';
import TextLink from '../../../../../shared/Table/TextLink';
import EditModal from '../../../../Services/components/ServicesTable/components/EditModal';

const ClientService = ({ services, currentClient }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  const cols = React.useMemo(
    () => [
      {
        Header: 'Услуга',
        id: 'service',
        Cell: ({ row }) => {
          const data = row?.original;
          console.log(data, 'data');
          return (
            <TextLink to={`/services/${data.id}`} className={styles.link}>
              {data?.description}
            </TextLink>
          );
        },
      },

      // {
      //   Header: 'Постановщик',
      //   id: 'manager',
      //   sortType: 'basic',
      //   accessor: 'creator.name',
      //   Cell: ({ row }) => {
      //     const data = row?.original;
      //     return (
      //       <ManagerCell className={styles.manager} manager={data.creator} />
      //     );
      //   },
      // },
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
