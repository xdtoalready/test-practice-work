import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import useStore from '../../../../hooks/useStore';
import { observer } from 'mobx-react';
import styles from './Client.module.sass';
import Title from '../../../../shared/Title';
import ClientStatus from './Status';
import cn from 'classnames';
import ClientService from './Services';
import ClientDeals from './Deals';
import ClientActivities from './Activities';
import ClientDescription from './Description';
import useClientsApi from '../../clients.api';
import ClientPersons from './Persons';
import { deepObserve } from 'mobx-utils';
import { reaction } from 'mobx';
import ClientsContacts from './Contacts';
import ClientPasswords from './Passwords';
import ClientComments from '../../../../components/Comments';
import CardDropdown from '../../../../shared/Dropdown/Card';
import { AnimatePresence } from 'framer-motion';
import {
  opacityTransition,
  TranslateYTransition,
} from '../../../../utils/motion.variants';
import { motion } from 'framer-motion';
import useClients from '../../hooks/useClients';
import ClientTokens from './Tokens';
import CreateModal from './Passwords/Modals/CreateModal';
import CreatePassModal from './Passwords/Modals/CreateModal';
import { LoadingProvider } from '../../../../providers/LoadingProvider';
import {
  handleError,
  handleSubmit as handleSubmitSnackbar,
} from '../../../../utils/snackbar';
import CreateClientsModal from './Persons/Modals/CreateClientsModal';
import Comments from '../../../../components/Comments';
import useParamSearch from '../../../../hooks/useParamSearch';
import ClientMembers from './ClientMembers';
import CallButton from '../../../Calls/components/CallButton';
import CallModal from '../../../Calls/components/CallModal';
import { CallsProvider } from '../../../../providers/CallsProvider';
import CompanyCallsSmall from '../../../../components/CompanyCallsSmall';
import CreateSiteModal from './Tokens/Modals';

const ClientPage = observer(() => {
  let { id } = useParams();
  const { isLoading } = useClients(+id);
  const {clientsStore:clients} = useStore()
  const api = useClientsApi();
  const [dropDownClicked, setDropDownCLicked] = useState(true);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [personModalValue, setPersonModalValue] = useState(null);
  const client = clients.getById(id);
  const [siteModalValue, setSiteModalValue] = useState(null);

  const handleChange = (name, payload, withId = true) => {
    clients.changeById(client?.id ?? +id, name, payload, withId);
  };
  const handleReset = (path) => {
    clients.resetDraft(client.id, path);
  };

  const handleRemove = (path) => {
    clients.removeById(client.id, path);
  };
  const handleRemovePass = (path, passId) => {
    api.deletePassword(client.id, passId);

    handleRemove(path);
  };
  const handleSubmit = async (path, submitText) => {
    try {
      await api.updateCompany(Number(id), {}, submitText);
      clients.submitDraft(Number(id));
      // api.setClients(clients);
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      clients.resetDraft(Number(id), path);
    }
  };

  const handleSubmitPersons = async (clientId, submitText, path) => {
    try {
      await api.updateClient(clients, Number(id), clientId, submitText);
      clients.submitDraft(Number(id));
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      clients.resetDraft(Number(id), path);
    }
  };

  const handleSubmitPasswords = (path, passId, submitText) => {
    try {
      setPassModalOpen(false);
      api
        .updatePasswords(Number(id), passId)
        .then(() => handleSubmitSnackbar(submitText));
      clients.submitDraft(Number(id));
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      clients.resetDraft(Number(id), path);
    }
  };

  const handleSubmitSite = async (path, siteId, submitText) => {
    try {

      if (siteId!==null) {
        await api.updateSite(client.id, siteId, { });
      } else {
        await api.createSite(client.id);
      }
      handleSubmitSnackbar(submitText);
      clients.submitDraft(client.id);
    } catch (error) {
      console.error('Ошибка при сохранении сайта:', error);
      clients.resetDraft(client.id, path);
    }
  };

  const handleChangeStatus = (name, value) => {
    handleChange(name, value);
    handleSubmit(name, 'Статус успешно изменен!');
  };

  const handleCreateLkUser = async () => {

    if (!client?.account?.can_be_activated) {
      handleError(
        'Личный кабинет уже активирован или не может быть активирован',
      );
      return;
    }


    try {
      await api.createAccount(client.id);
    } catch (error) {
      console.error('Ошибка при активации ЛК:', error);
    }
  };


  const isLkButtonDisabled = !client?.account?.can_be_activated

  console.log(client?.account,isLkButtonDisabled,'account')

  return (
    <motion.div
      initial={'hidden'}
      animate={'show'}
      variants={opacityTransition}
    >
      <LoadingProvider isLoading={isLoading || api.isLoading}>
        <Title rightButtonName={'Создать аккаунт ЛК'} onRightButtonClick={!isLkButtonDisabled && handleCreateLkUser} title={client?.title} />
        <div className={styles.dropdown}>
          <CardDropdown
            onClick={() => setDropDownCLicked(!dropDownClicked)}
            size={16}
            className={styles.dropdown_inner}
            text={<b>Информация о клиенте</b>}
          />
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <ClientStatus
              className={cn(styles.card, styles.card_status)}
              client={client}
              handleChange={handleChangeStatus}
            />

            <ClientService
              currentClient={client}
              className={cn(styles.card, styles.card_status)}
              services={
                client?.services && !client?.services?.total
                  ? client?.services
                  : null
              }
            />
            <ClientDeals
              currentClient={client}
              className={cn(styles.card, styles.card_status)}
              deals={client?.deals}
            />
            {/*<CompanyCallsSmall calls={client?.calls} />*/}

            <ClientActivities
              client={client}
              clientApi={api}
              clientStore={clients}
              activities={client?.businesses}
            />
            <Comments
              onDelete={() =>
                api
                  .getClientById(client.id, false)
                  .then(() => clients?.resetDraft(client?.id, 'comments'))
              }
              onChange={handleChange}
              comments={client?.comments}
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
                <ClientDescription
                  clientId={client?.id}
                  onChange={handleChange}
                  onReset={handleReset}
                  onSubmit={handleSubmit}
                  description={client?.description}
                />

                <ClientPersons
                  setClientModalData={(val) => setPersonModalValue(val)}
                  companyId={client?.id}
                  onAdd={() => setPersonModalValue(true)}
                  onChange={handleChange}
                  onReset={handleReset}
                  onSubmit={handleSubmitPersons}
                  persons={client?.contactPersons}
                />
                {client?.contactData && (
                  <ClientsContacts
                    onAdd={(name, payload) => handleChange(name, payload ?? '')}
                    onRemove={handleRemove}
                    onChange={handleChange}
                    onReset={handleReset}
                    onSubmit={handleSubmit}
                    contactData={client?.contactData}
                  />
                )}
                <ClientTokens
                  onAdd={() => setSiteModalValue(true)}
                  onChange={handleChange}
                  onReset={handleReset}
                  onSubmit={handleSubmitSite}
                  setSiteModalData={(val) => setSiteModalValue(val)}
                  sites={client?.sites}
                />
                <ClientPasswords
                  onAdd={() => setPassModalOpen(true)}
                  onRemove={handleRemovePass}
                  onChange={handleChange}
                  onReset={handleReset}
                  onSubmit={handleSubmitPasswords}
                  passwordsData={client?.passwords}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {passModalOpen && client && (
          <CreatePassModal
            onClose={() => setPassModalOpen(false)}
            companyId={client?.id}
          />
        )}
      </LoadingProvider>
      {personModalValue !== null && client && (
        <CreateClientsModal
          store={clients}
          api={api}
          entityId={client?.id}
          clientId={personModalValue ?? null}
          onClose={() => setPersonModalValue(null)}
          companyId={client?.id}
        />
      )}
      {siteModalValue !== null && (
        <CreateSiteModal
          store={clients}
          api={api}
          companyId={client?.id}
          siteId={typeof siteModalValue === 'number' ? siteModalValue : null}
          onClose={() => setSiteModalValue(null)}
        />
      )}
    </motion.div>
  );
});

// console.log('1:'+ setPassModalOpen);
// console.log('2:'+ setPersonModalOpen);

export default ClientPage;
