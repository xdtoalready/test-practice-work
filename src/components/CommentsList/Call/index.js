import React from 'react';
import styles from './Call.module.sass';
import Badge from '../../../shared/Badge';
import { colorDirectionTypes } from '../../../pages/Calls/calls.types';
import CallAudioPlayer from '../../../pages/Calls/components/CallAudioPlayer';
const Call = ({
call,
hours
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.sender}>
        <img src={call?.manager.image} alt={call?.manager.name} />
      </div>
      <div className={styles.call}>
        <span>
          {call?.manager?.lastName ?? ''} {call?.manager?.name ?? ''}
        </span>
        <div className={styles.record}>
          <Badge
            statusType={colorDirectionTypes}
            status={call.callType}
          />
          <CallAudioPlayer src={call.record}/>
        </div>
       
      </div>
      <div className={styles.rightSide}>
        <div className={styles.hours}>{hours}</div>
      </div>
    </div>
  );
};

export default Call;
