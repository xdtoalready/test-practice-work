import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import cn from 'classnames';
import styles from './styles.module.sass';
import useDeals from '../../hooks/useDeals';
import useDealsApi from '../../deals.api';
import { LoadingProvider } from '../../../../providers/LoadingProvider';
import Title from '../../../../shared/Title';
import CardDropdown from '../../../../shared/Dropdown/Card';
import Comments from '../../../../components/Comments';
import DealDescription from './components/DealDescription';
import { opacityTransition, TranslateYTransition } from '../../../../utils/motion.variants';
import { DealsTaskWithQueryTask } from './components/DealTasks';
import DealStatus from './components/DealStatus';
import DealInfo from './components/DealInfo';
import { serviceTypeEnumRu } from '../../../Services/services.types';
import DealMembers from './components/DealMembers';
import { handleSubmit as handleSubmitSnackbar } from '../../../../utils/snackbar';
import useStore from '../../../../hooks/useStore';
import useTasksApi from '../../../Tasks/tasks.api';
import DealNote from './components/DealNote';
import ClientPersons from '../../../Clients/components/ClientPage/Persons';
import useClientsApi from '../../../Clients/clients.api';
import CreateClientsModal from '../../../Clients/components/ClientPage/Persons/Modals/CreateClientsModal';
import ClientActivities from '../../../Clients/components/ClientPage/Activities';

const DealPage = observer(() => {
  const { id } = useParams();
  const { store: deals } = useDeals(+id);
  const api = useDealsApi();
  const clientsApi = useClientsApi();
  const { dealsStore } = useStore();
  const { tasksStore } = useStore();
  const taskApi = useTasksApi();
  const deal = deals.getById(+id);
  const [dropDownClicked, setDropDownClicked] = useState(true);
  const [personModalValue, setPersonModalValue] = useState(null);

  const handleChange = (name, payload, withId = true) => {
    deals.changeById(deal?.id ?? +id, name, payload, withId);
  };

  const handleReset = (path) => {
    deals.resetDraft(deal.id, path);
  };

  const handleSubmit = async (path, submitText) => {
    try {
      await api.updateDeal(Number(id), {});
      handleSubmitSnackbar(submitText);
      deals.submitDraft();
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      deals.resetDraft(Number(id), path);
    }
  };

  const handleChangeStatus = (name, value) => {
    handleChange(name, value);
    handleSubmit(name, 'Статус успешно изменен!');
  };

  const handleSubmitPersons = async (clientId, submitText, path) => {
    try {
      clientsApi
        .updateClient(deals, Number(id), clientId, submitText)
        .then(() => api.getDealById(deal.id));
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      dealsStore.resetDraft(Number(id), path);
    }
  };

  useEffect(() => {
    return () => {
      dealsStore.setCurrentDeal(null);
    };
  }, []);
  return (
    <motion.div
      initial={'hidden'}
      animate={'show'}
      variants={opacityTransition}
    >
      <LoadingProvider isLoading={api.isLoading || dealsStore.isLoading}>
        <Title title={deal?.name} />
        <div className={styles.dropdown}>
          <CardDropdown
            onClick={() => setDropDownClicked(!dropDownClicked)}
            size={16}
            className={styles.dropdown_inner}
            text={<b>Информация о сделке</b>}
          />
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <DealStatus
              handleChange={handleChangeStatus}
              className={cn(styles.card, styles.card_status)}
              deal={deal}
            />
            <DealsTaskWithQueryTask
              className={cn(styles.card, styles.card_status)}
              deal={deal}
              dealApi={api}
              dealsStore={dealsStore}
              taskStore={tasksStore}
              taskApi={taskApi}
            />
            {/*<CompanyCallsSmall calls={deal?.calls}/>*/}
            <ClientActivities deal={deal} dealApi={api} activities={deal?.businesses} dealStore={dealsStore} />
            <Comments
              onDelete={() =>
                api
                  .getDealById(deal.id, false)
                  .then(() => deals?.resetDraft(deal?.id, 'comments'))
              }
              onChange={handleChange}
              comments={deal?.comments}
            />
          </div>
          <AnimatePresence>
            {dropDownClicked && (
              <motion.div
                animate={'show'}
                initial={'hidden'}
                exit={'hidden'}
                variants={TranslateYTransition}
                className={cn(styles.col, {
                  [styles.col_dropdowned]: dropDownClicked,
                })}
              >
                <DealDescription
                  dealId={deal?.id}
                  onChange={handleChange}
                  onReset={handleReset}
                  onSubmit={handleSubmit}
                  description={deal?.description}
                />
                <DealNote
                  onChange={handleChange}
                  onReset={handleReset}
                  onSubmit={handleSubmit}
                  onAdd={() => null}
                  data={deal}
                />
                <ClientPersons
                  setClientModalData={(val) => {
                    setPersonModalValue(val);
                  }}
                  companyId={deal?.company?.id}
                  onAdd={() => setPersonModalValue(true)}
                  onChange={handleChange}
                  onReset={handleReset}
                  onSubmit={handleSubmitPersons}
                  persons={deal?.contactPersons}
                />
                <DealInfo
                  price={deal?.price}
                  serviceType={serviceTypeEnumRu[deal?.serviceType]}
                  source={deal?.source}
                />
                <DealMembers
                  client={deal?.company}
                  creator={deal?.creator}
                  auditor={deal?.auditor}
                  manager={deal?.responsible}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </LoadingProvider>
      {personModalValue !== null && deal && (
        <CreateClientsModal
          onSubmit={() => api.getDealById(deal.id)}
          onClose={() => setPersonModalValue(null)}
          companyId={deal?.company?.id}
          entityId={deal?.id}
          clientId={personModalValue}
          store={deals} // Передаем стор сделок
          api={clientsApi} // Передаем API клиентов
        />
      )}
    </motion.div>
  );
});

export default DealPage;
