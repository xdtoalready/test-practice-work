// src/components/CallHistory/index.jsx
import React from 'react';
import { observer } from 'mobx-react';
import styles from './CallHistory.module.sass';
import useStore from '../../../../hooks/useStore';
import Loader from '../../../../shared/Loader';
import Icon from '../../../../shared/Icon';
import {
  formatDateOnlyHours,
  formatDateWithToday,
  formatHours,
} from '../../../../utils/formate.date';
import { callDirectionTypes } from '../../calls.types';
import {useCallsContext} from "../../../../providers/CallsProvider";

const CallItem = ({ call }) => {
  const {setSelectedPhone} = useCallsContext()
  const getCurrentCallIcon = () => {
    switch (call.type) {
      case callDirectionTypes.INCOMING:
        return 'phone-incoming';
      case callDirectionTypes.MISSED:
        return 'phone-missed';
      case callDirectionTypes.OUTGOING:
        return 'phone-outgoing';
    }
  };

  const handleClickOnCallItem = (value) => {
    setSelectedPhone(value)
  }

  return (
    <div onClick={()=>handleClickOnCallItem(call.phone)} className={styles.callItem}>
      <div className={styles.callIcon}>
        <Icon
          name={getCurrentCallIcon()}
          size={24}
          viewBox={'0 0 24 24'}
          // fill={isIncoming ? '#83BF6E' : '#FF6A55'}
        />
      </div>
      <div className={styles.callInfo}>
        <div className={styles.callName}>
          {call.contactName || call.phone}({call.phone})
        </div>
        {call.contact_name && (
          <div className={styles.callCompany}>{call.company || ''}</div>
        )}
      </div>
      <div className={styles.callTime}>{formatHours(call.createdAt)}</div>
    </div>
  );
};

const CallHistory = observer(({isRendered}) => {
  const { callsStore } = useStore();
  if (!isRendered && callsStore.isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader />
      </div>
    );
  }

  if (callsStore.error) {
    return <div className={styles.error}>{callsStore.error}</div>;
  }

  const groupedCalls = callsStore?.groupedByDateCalls;
  const dates = Object.keys(groupedCalls);
  return (
    <div className={styles.callHistory}>
      <h3 className={styles.historyTitle}>История звонков</h3>

      {dates.length === 0 ? (
        <div className={styles.emptyState}>Нет данных о звонках</div>
      ) : (
        dates.map((date) => (
          <div key={date} className={styles.dateGroup}>
            <div className={styles.dateHeader}>{formatDateWithToday(date)}</div>
            {groupedCalls[date].map((call) => (
              <CallItem key={call.id} call={call} />
            ))}
          </div>
        ))
      )}
    </div>
  );
});

export default CallHistory;
