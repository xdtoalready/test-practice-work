import React, { useMemo, useState } from 'react';
import ManagerCell from '../../../../../components/ManagerCell';
import { formatDate } from '../../../../../utils/formate.date';
import Table from '../../../../../shared/Table';
import { formatSum } from '../../../../../utils/format.number';
import AdaptiveCard from './AdaptiveCard';
import TextLink from '../../../../../shared/Table/TextLink';
import Badge from '../../../../../shared/Badge';
import { colorStatsuDealTypesForPage } from '../../../../Deals/deals.types';
import DealEditModal from '../../../../Deals/components/DealEditModal';
import useStore from '../../../../../hooks/useStore';
import useDealsApi from '../../../../Deals/deals.api';

const ClientDeals = ({ deals, currentClient }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { dealsStore } = useStore();
  const dealsApi = useDealsApi();
  const cols = React.useMemo(
    () => [
      {
        Header: 'Сделка',
        id: 'activity',
        sortType: 'basic',
        accessor: 'name',
        Cell: ({ row }) => {
          const data = row?.original;
          return <TextLink to={`/deals/${data.id}`}>{data.name}</TextLink>;
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
        Header: 'Статус',
        id: 'status',

        Cell: ({ row }) => {
          const data = row?.original;
          return (
            <Badge
              status={data?.status}
              statusType={colorStatsuDealTypesForPage}
            />
          );
        },
      },
      {
        Header: 'Сумма',
        id: 'sum',
        Cell: ({ row }) => {
          const data = row?.original;
          return <p>{formatSum(data?.price)}</p>;
        },
      },
    ],
    [],
  );
  const data = useMemo(() => deals ?? [], deals);
  return (
    <div>
      <Table
        smallTable={true}
        headerInCard={true}
        cardComponent={(data, onPagination) => (
          <AdaptiveCard data={data} onPagination={onPagination} />
        )}
        headerActions={{
          sorting: true,
          add: {
            action: () => setEditModalOpen(true),
            title: '',
          },
        }}
        onPagination={true}
        title={'Cделки'}
        data={data}
        columns={cols}
      />
      {editModalOpen && (
        <DealEditModal
          currentClient={currentClient}
          handleClose={() => setEditModalOpen(false)}
          dealApi={dealsApi}
          dealStore={dealsStore}
        />
      )}
    </div>
  );
};

export default ClientDeals;
