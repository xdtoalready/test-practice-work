import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useSearchParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router';
import { getQueryParam } from '../../utils/window.utils';
import { handleError } from '../../utils/snackbar';
import CalendarModal from './index';

const withBusinessModalHandler = (WrappedComponent) => {
  return observer(
    ({
      calendarStore,
      calendarApi,
      deal = null,
      dealApi = null,
      dealStore = null,
      client = null,
      clientStore = null,
      clientApi = null,
      ...props
    }) => {
      const [searchParams, setSearchParams] = useSearchParams();
      const [isLoading, setIsLoading] = useState(false);
      const [businessData, setBusinessData] = useState(null);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [restParams, setRestParams] = useState({});

      const updateSearchParams = useCallback(
        (updates) => {
          const newSearchParams = new URLSearchParams(searchParams);
          Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
              newSearchParams.delete(key);
            } else {
              newSearchParams.set(key, value);
            }
          });

          setSearchParams(newSearchParams, { replace: true });
        },
        [searchParams, setSearchParams],
      );

      const loadBusinessData = async (businessId) => {
        try {
          setIsLoading(true);

          const business = await calendarApi.getBusinessById(businessId);

          setBusinessData(business);
        } catch (error) {
          console.error('Error loading business:', error);
          handleError('Ошибка при загрузке задачи');
        } finally {
          setIsLoading(false);
        }
      };

      useEffect(() => {
        const businessId = searchParams.get('businessId');

        if (businessId) {
          setIsModalOpen(true);
          loadBusinessData(businessId);
        }
        // const handleBusinessFromUrl = async () => {
        //   const businessId = searchParams.get('businessId');
        //   if (!businessId) return;
        //
        //   const business = await loadBusinessData(businessId);
        //   if (business) {
        //     setBusinessData(business);
        //     setIsModalOpen(true);
        //   }
        // };
        //
        // handleBusinessFromUrl();
      }, [searchParams.get('businessId')]);

      const handleEditBusiness = (business) => {
        if (!business) {
          setBusinessData(null);
          setIsModalOpen(true);
          return;
        }

        setIsModalOpen(true);
        updateSearchParams({ businessId: business.id.toString() });
        loadBusinessData(business.id);
      };

      const handleCloseModal = () => {
        setBusinessData(null);
        setIsLoading(false);
        setIsModalOpen(false);
        updateSearchParams({ businessId: null });
        setRestParams({});
      };

      const handleCreateBusiness = (params) => {
        setBusinessData(null);
        setIsModalOpen(true);
        setRestParams(params);
      };

      return (
        <>
          <WrappedComponent
            {...props}
            deal={deal}
            client={client}
            onEditBusiness={handleEditBusiness}
            onCreateBusiness={handleCreateBusiness}
          />
          {isModalOpen && (
            <CalendarModal
              businessId={searchParams.get('businessId')}
              isLoading={isLoading}
              data={calendarStore.getById(searchParams.get('businessId'))}
              onClose={handleCloseModal}
              deal={deal}
              dealApi={dealApi}
              dealStore={dealStore}
              client={client}
              clientApi={clientApi}
              clientStore={clientStore}
              calendarStore={calendarStore}
              calendarApi={calendarApi}
              {...restParams}
            />
          )}
        </>
      );
    },
  );
};

export default withBusinessModalHandler;
