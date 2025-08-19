import React, { useState } from 'react';
import styles from '../TimeTracking.module.sass';
import Icon from '../../../shared/Icon';
import { formatDateOnlyHours, formatHours } from '../../../utils/formate.date';
import TableMenu from '../../TableMenu';
import useUser from '../../../hooks/useUser';

const Index = ({ timeTracking, actions }) => {
  const [tableMenuOpen, setTableMenuOpen] = useState(false);
  const { user } = useUser();
  ;
  const sender = timeTracking.employee;
  const employee = timeTracking.employee;
  const timeSpent = timeTracking.timeSpent;
  return (
    <div className={styles.container}>
      <div className={styles.sender}>
        <img src={employee?.avatar} alt={employee?.name} />
      </div>
      <div className={styles.details}>
        <span>
          {employee?.lastName} {employee?.name} {employee?.middleName}
        </span>
        <div className={styles.tracking_info}>
          <div className={styles.time}>
            <Icon name="clock" size={18} />
            <span>
              {timeSpent?.hours} ч {timeSpent?.minutes} мин.
            </span>
          </div>
          <div className={styles.cost}>
            <Icon name="ruble" size={18} />
            <span>{timeTracking?.cost?.toFixed(2) ?? 'Не указано'}</span>
          </div>
        </div>
      </div>
      <div className={styles.rightSide}>
        <div className={styles.hours}>
          {formatDateOnlyHours(timeTracking?.date)}
        </div>
        {user?.id === sender?.id && (
          <div className={styles.more} onClick={() => setTableMenuOpen(true)}>
            <Icon fill={'#6F767E'} name={'more-horizontal'} size={28} />
          </div>
        )}
        {tableMenuOpen && (
          <TableMenu
            actions={actions(timeTracking)}
            isVisible={true}
            onClose={() => setTableMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
