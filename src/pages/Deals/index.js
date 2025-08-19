import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react';
import useDealsApi from './deals.api';
import { useNavigate } from 'react-router';
import useDealsByStatus from './hooks/useDealsByStatus';
import { LoadingProvider } from '../../providers/LoadingProvider';
import Title from '../../shared/Title';
import DealsTable from './components/DealsTable';
import DealEditModal from './components/DealEditModal';
import {FiltersProvider} from "../../providers/FilterProvider";
import {createServicesFilters} from "../Services/services.filter.conf";
import {createDealsFilters} from "./deals.filter.conf";
import useAppApi from "../../api";
import {handleClickWithHttpResourceOrMiddle} from "../../utils/click";
import {CallsProvider} from "../../providers/CallsProvider";

const Deals = observer(() => {
  const api = useDealsApi();
  const navigate = useNavigate();
  const [dealData, setDealData] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const appApi = useAppApi()
  const periodSelectorRef = useRef();
  const periodCreatedAtRef = useRef();

  const { data, isLoading, store: dealsStore } = useDealsByStatus();

  // Обработчик создания новой сделки
  const handleCreateDeal = () => {
    setIsCreateMode(true);
    setDealData(null);
  };

  // Обработчик закрытия модального окна
  const handleCloseModal = () => {
    setDealData(null);
    setIsCreateMode(false);
  };

  // Подсчет количества сделок в каждом статусе
  const getCountStatusDeal = (type) => {
    const deals = data.find((deal) => deal.type === type);
    return deals ? deals.values.length : 0;
  };

  // Обработчик изменения статуса сделки
  const handleChange = (dealId, newStatus) => {
    dealsStore.clearCurrentDeal()
    dealsStore.changeById(dealId, 'status', newStatus, true);
    api.updateDealStatus(dealId, { status: newStatus });
  };

  const handleFilterChange = async (filters) => {

    await api.getDeals(1, filters); // Сбрасываем на первую страницу при изменении фильтров
  };

  // Обработчик клика по карточке сделки
  const handleDealClick = (event,deal) => {
    // navigate(`/deals/${deal.id}`);

    handleClickWithHttpResourceOrMiddle({url:`/deals/${deal.id}`},event,navigate);
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
            config: createDealsFilters(appApi,periodSelectorRef,periodCreatedAtRef),
            onChange: handleFilterChange
          }
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
