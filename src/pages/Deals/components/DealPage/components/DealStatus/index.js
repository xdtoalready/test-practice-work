import React from 'react';
import cn from 'classnames';
import Card from '../../../../../../shared/Card';
import ManagerCell from '../../../../../../components/ManagerCell';
import styles from './DealStatus.module.sass';
import Badge, { statusTypes } from '../../../../../../shared/Badge';
import { formatDateWithOnlyDigits } from '../../../../../../utils/formate.date';
import {
  colorStatsuDealTypesForPage,
  colorStatusDealTypes,
} from '../../../../deals.types';
import StatusDropdown from '../../../../../../components/StatusDropdown';

const DealStatus = ({ deal, className, handleChange }) => {
  return (
    <Card className={cn(styles.card, className)}>
      <div className={styles.adaptive}>
        <div className={styles.container_adaptive}>
          <ManagerCell manager={deal?.manager} />
          <div className={cn(styles.dealId, styles.dealId_adaptive)}>
            <span>{deal?.id}</span>
            <span>ID сделки</span>
          </div>
        </div>
        <div className={styles.adaptive_badge}>
          <Badge status={deal?.status} statusType={statusTypes?.deals} />
        </div>
      </div>
      <div className={styles.container}>
        <ManagerCell manager={deal?.manager} />
        {/*<Badge status={deal?.status} statusType={colorStatsuDealTypesForPage}/>*/}
        <StatusDropdown
          statuses={colorStatusDealTypes}
          value={colorStatusDealTypes[deal?.status]}
          onChange={(option) => handleChange('status', option.key)}
        />
      </div>
      <div className={styles.deal_info}>
        <div className={styles.dealId}>
          <span>{formatDateWithOnlyDigits(deal?.createdAt)}</span>
          <span>Дата создания</span>
        </div>
        <div className={styles.dealId}>
          <span>{deal?.id}</span>
          <span>ID сделки</span>
        </div>
      </div>
    </Card>
  );
};

export default DealStatus;
