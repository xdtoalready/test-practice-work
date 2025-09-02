import React from 'react';
import styles from './Badge.module.sass';
import cn from 'classnames';
import { colorStatusTypes as clientStatuses } from '../../pages/Clients/clients.types';
import { colorStatusTypes as servicesStatuses } from '../../pages/Services/services.types';
import { colorTasksTypes as tasksStatuses } from '../../pages/Tasks/tasks.types';
import { colorEmployersTypeEnum as employersStatuses } from '../../pages/Settings/settings.types';
import { colorBillStatusTypes as billsStatuses } from '../../pages/Documents/types/bills.types';
import { coloractSigneStatusTypes as actStatuses  } from '../../pages/Documents/types/acts.types';
import { colorReportStatusTypes as reportsStatuses } from '../../pages/Documents/types/reports.types';
import { colorStatusDealTypes as dealsStatuses } from '../../pages/Deals/deals.types';
import { colorDirectionTypes as callsStatuses } from '../../pages/Calls/calls.types';

export const statusTypes = {
  clients: clientStatuses,
  services: servicesStatuses,
  tasks: tasksStatuses,
  employes: employersStatuses,
  bills: billsStatuses,
  acts: actStatuses,
  reports: reportsStatuses,
  deals: dealsStatuses,
  calls: callsStatuses,
};

const Badge = ({ statusType, status, classname }) => {
  return (
    <div className={styles.container}>
      <div
        className={cn(`${statusType[status]?.class}`, styles.status, classname)}
      >
        {statusType[status]?.status}
      </div>
    </div>
  );
};

export default Badge;
