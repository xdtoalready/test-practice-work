import React from 'react';
import Card from '../../../../../../shared/Card';
import styles from '../../page.module.sass';
import cn from 'classnames';
import LabeledParagraph from '../../../../../../shared/LabeledParagraph';
import { serviceTypeEnumRu, statusTypes, statusTypesRu } from '../../../../services.types';
import ManagerCell from '../../../../../../components/ManagerCell';
import { formatDateWithDateAndYear } from '../../../../../../utils/formate.date';
import PasswordsDisplay from '../PasswordsDisplay';
import ContractCard from '../ContractCard';

const Index = ({ service, passwords }) => {
  return (
    <div className={styles.infoCards}>
      <Card
        classCardHead={styles.card_title}
        className={cn(styles.card, styles.infoCard)}
        title={'Информация об услуге'}
      >
        {Boolean(service.type) && (
          <LabeledParagraph
            label={'Тип услуги'}
            text={serviceTypeEnumRu[service.type]}
          />
        )}
        {Boolean(service.status) && (
          <LabeledParagraph
            textClass={
              service.status === statusTypes.inProgress
                ? styles.inProgress
                : styles.closed
            }
            label={'Статус'}
            text={statusTypesRu[service.status]}
          />
        )}
        {!!service.manager && (
          <LabeledParagraph
            label={'Менеджер'}
            text={<ManagerCell manager={service.manager} />}
          />
        )}
        {!!service.command.length && (
          <LabeledParagraph
            label={'Участники'}
            text={service.command.map((el) => (
              <ManagerCell manager={el} />
            ))}
          />
        )}

        <LabeledParagraph
          label={'Дедлайн'}
          text={formatDateWithDateAndYear(service.deadline)}
        />

        {!!service.client && (
          <LabeledParagraph
            label={'Клиент'}
            text={service.client.title}
            to={`/clients/${service.client.id}`}
          />
        )}

        {Boolean(service.contractNumber) && (
          <LabeledParagraph
            label={'Номер договора'}
            text={service.contractNumber}
          />
        )}
      </Card>
      {passwords && Object.keys(passwords).length > 0 && (
        <PasswordsDisplay passwordsData={passwords} />
      )}
      {service.contractModule && (
        <ContractCard
          contract={service.contract}
          serviceId={service.id}
          clientLegalType={service.client?.legalType}
          serviceType={service.type}
        />
      )}
    </div>
  );
};
export default Index;
