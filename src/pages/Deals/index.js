import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react';
import useDealsApi from './deals.api';
import { useNavigate } from 'react-router';
import useDealsByStatus from './hooks/useDealsByStatus';
import { LoadingProvider } from '../../providers/LoadingProvider';
import Title from '../../shared/Title';
import DealsTable from './components/DealsTable';
import DealEditModal from './components/DealEditModal';
import { FiltersProvider } from '../../providers/FilterProvider';
import { createDealsFilters } from './deals.filter.conf';
import useAppApi from '../../api';
import { handleClickWithHttpResourceOrMiddle } from '../../utils/click';

const Deals = observer(() => {
  const api = useDealsApi();
  const navigate = useNavigate();
  const [dealData, setDealData] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const appApi = useAppApi();
  const periodSelectorRef = useRef();
  const periodCreatedAtRef = useRef();
  const { data, store: dealsStore } = useDealsByStatus();

  const handleCreateDeal = () => {
    setIsCreateMode(true);
    setDealData(null);
  };

  const handleCloseModal = () => {
    setDealData(null);
    setIsCreateMode(false);
  };

  const handleChange = (dealId, newStatus) => {
    dealsStore.clearCurrentDeal();
    dealsStore.changeById(dealId, 'status', newStatus, true);
    api.updateDealStatus(dealId, { status: newStatus });
  };

  const handleFilterChange = async (filters) => {
    await api.getDeals(1, filters);
  };

  const handleDealClick = (event, deal) => {
    handleClickWithHttpResourceOrMiddle({ url: `/deals/${deal.id}` }, event, navigate);
  };

  return (
    <FiltersProvider>
      <LoadingProvider isLoading={false}>
        <Title
          title={'Сделки'}
          actions={{
            add: {
              action: handleCreateDeal,
              title: 'Создать сделку',
            },
            filter: {
              title: 'Фильтр',
              config: createDealsFilters(appApi, periodSelectorRef, periodCreatedAtRef),
              onChange: handleFilterChange,
            },
          }}
        />
        <DealsTable
          onClick={handleDealClick}
          data={data}
          handleChange={handleChange}
        />
        {(dealData || isCreateMode) && (
          <DealEditModal
            data={dealData}
            handleClose={handleCloseModal}
            dealStore={dealsStore}
            dealApi={api}
          />
        )}
      </LoadingProvider>
    </FiltersProvider>
  );
});

export default Deals;
