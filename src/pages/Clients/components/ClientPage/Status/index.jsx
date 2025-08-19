import React, { useEffect, useMemo, useState } from 'react';
import styles from './Status.module.sass';
import ManagerCell from '../../../../../components/ManagerCell';
import Badge, { statusTypes } from '../../../../../shared/Badge';
import Card from '../../../../../shared/Card';
import cn from 'classnames';
import StatusDropdown from '../../../../../components/StatusDropdown';
import { colorStatusTypes } from '../../../clients.types';

const ClientStatus = ({ client, className, handleChange }) => {
  return (
    <Card className={cn(styles.card, className)}>
      <div className={styles.adaptive}>
        <div className={styles.container_adaptive}>
          <ManagerCell manager={client?.manager} />
          <div className={cn(styles.clientId, styles.clientId_adaptive)}>
            <span>{client?.id}</span>
            <span>ID клиента</span>
          </div>
        </div>
        <div className={styles.adaptive_badge}>
          <Badge status={client?.status} statusType={statusTypes?.clients} />
        </div>
      </div>
      <div className={styles.container}>
        <ManagerCell manager={client?.manager} />
        {/*<StatusDropdown*/}
        {/*  statuses={colorStatusTypes}*/}
        {/*  value={selectedStatus}*/}
        {/*  onChange={handleChangeSelectedStatus}*/}
        {/*/>*/}
        <StatusDropdown
          statuses={colorStatusTypes}
          value={colorStatusTypes[client?.status]}
          onChange={(option) => handleChange('status', option.key)}
        />
        {/*<Badge status={client?.status} statusType={statusTypes?.clients} />*/}
      </div>
      <div>
        <div className={styles.right}>
          {/*<ManagerCell manager={{...client?.manager,role:'Создатель'}} />*/}
          <div className={styles.clientId}>
            <span>{client?.id}</span>
            <span>ID клиента</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ClientStatus;
