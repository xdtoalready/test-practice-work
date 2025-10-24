import React, { useMemo, useState } from 'react';
import { opacityTransition } from '../../../../utils/motion.variants';
import { motion } from 'framer-motion';
import Title from '../../../../shared/Title';
import { useParams } from 'react-router';
import useClientsApi from '../../../Clients/clients.api';
import useServices from '../../hooks/useServices';
import useServiceApi from '../../services.api';
import Card from '../../../../shared/Card';
import styles from './page.module.sass';
import Task from './components/Task';
import Hours from './components/Hours';
import Act from './components/Act';
import Bills from './components/Bills';
import Reports from './components/Reports';
import TextLink from '../../../../shared/Table/TextLink';
import { observer } from 'mobx-react';
import AdaptiveStages from './components/AdaptiveCard';
import Agreement from './components/Agreement';
import AdditionalAgreement from './components/AdditionalAgreement';
import Icon from '../../../../shared/Icon';
import Button from '../../../../shared/Button';
import cn from 'classnames';
import Loader from '../../../../shared/Loader';
import EditModal from '../ServicesTable/components/EditModal';
import DocumentsCard from './components/DocumentsCard';
import ServiceInfoCard from './components/ServiceInfoCard';
import EditStage from '../../../../components/EditStage';
import { LoadingProvider } from '../../../../providers/LoadingProvider';
import { usePermissions } from '../../../../providers/PermissionProvider';
import Acts from './components/Acts';

const withDocuments = false;

const ServicePage = observer(() => {
  let { id } = useParams();
  const {
    data: service,
    store: services,
    isLoading,
  } = useServices(Number(id), true);
  const { hasPermission } = usePermissions();
  const api = useServiceApi();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createEtapModal, setCreateEtapModal] = useState(false);

  if (!service) return <Loader />;
  // const service = useMemo(
  //   () => services.getById(+id),
  //   [id, services, services.services, services.drafts],
  // );
  return (
    <LoadingProvider isLoading={isLoading}>
      <motion.div
        initial={'hidden'}
        animate={'show'}
        variants={`opacityTransition`}
      >
        <div className={styles.header}>
          <div>
            {service.title}
            <Icon
              className={styles.edit}
              onClick={() => setEditModalOpen(true)}
              size={24}
              name={'edit'}
            />
          </div>
          <Button
            onClick={() => setCreateEtapModal(true)}
            type={'primary'}
            name={'Создать Этап'}
          />
        </div>
        <div className={!withDocuments ? styles.gridContainer : ''}>
          <div>
            {service?.stages.map((el) => (
              <div className={styles.cards} key={el.id}>
                <Card
                  classCardHead={styles.card_title}
                  className={styles.card}
                  classCardHead={styles.head}
                  classTitle={styles.card_title}
                  // head={
                  //     <TextLink to={`stages/${el.id}`} className={styles.etap}>
                  //         Этап №{el.id + 1}
                  //     </TextLink>
                  // }
                  title={<TextLink to={`stages/${el.id}`}>{el.title}</TextLink>}
                >
                  <Task
                    key={el.id}
                    stage={el}
                    taskName={service.title}
                    task={service.tasks}
                  />
                  <Hours actSum={el.cost} time={el.time} el={el} />
                  <Reports
                    company={{
                      ...service?.client,
                      name: service?.client?.title,
                    }}
                    service={{ id: service?.id, name: service?.title }}
                    stage={{ id: el.id, name: el.title }}
                    reports={el.report ? [el.report] : []} 
                    onReportGenerated={() => {
                      api.getServiceById(service.id, true);
                    }}
                  />
                  {/*<Act act={el.act} />*/}
                  {/*<Agreement/>*/}
                  {/*<AdditionalAgreement/>*/}
                  {
                    <Bills
                      company={{
                        ...service?.client,
                        name: service?.client?.title,
                      }}
                      service={{ id: service?.id, name: service?.title }}
                      stage={{ id: el.id, name: el.title }}
                      bills={el.bills ?? []}
                    />
                  }
                  {
                    <Acts
                      company={{
                        ...service?.client,
                        name: service?.client?.title,
                      }}
                      service={{ id: service?.id, name: service?.title }}
                      stage={{ id: el.id, name: el.title }}
                      acts={el.acts ?? []}
                    />
                  }
                </Card>
                {withDocuments && <DocumentsCard service={service} />}
                {/*<AdaptiveStages data={service.tasks} />*/}
              </div>
            ))}
          </div>
          {!withDocuments && (
            <ServiceInfoCard
              passwords={service?.passwords ?? {}}
              service={service}
            />
          )}
        </div>
      </motion.div>
      {editModalOpen && (
        <EditModal
          serviceId={service.id}
          onClose={() => setEditModalOpen(false)}
        />
      )}
      {createEtapModal && (
        <EditStage handleClose={() => setCreateEtapModal(false)} />
      )}
    </LoadingProvider>
  );
});

export default ServicePage;
