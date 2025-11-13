import React from 'react';

import styles from './Table.module.sass';
import useStore from '../../../../hooks/useStore';
import StatsWidget from '../../../../shared/Widget';
import Icon from '../../../../shared/Icon';
import { formatSeconds } from '../../../../utils/format.time';

const CallsStats = () => {
  const { callsStore } = useStore();
  if (!callsStore.stats) return <></>;

  const { total, incoming, outgoing, duration } = callsStore.stats;

  return (
    <div className={styles.container}>
      <StatsWidget
        title="Всего звонков"
        value={total ?? '0'}
        showChart={false}
        icon={<Icon name={'phone'} size={36} />}
      />
      <StatsWidget
        type={'accept'}
        title="Входящих звонков"
        value={incoming ?? '0'}
        iconStyles={styles.icon}
        icon={'/leadbro/phone-incoming.svg'}
      />
      <StatsWidget
        type={'info'}
        title="Исходящих звонков"
        value={outgoing ?? '0'}
        iconStyles={styles.icon}
        icon={'/leadbro/phone-outgoing.svg'}
      />
      <StatsWidget
        type={'info'}
        title="Длительность"
        value={!Number.isNaN(duration) && formatSeconds(duration)}
        iconStyles={styles.icon}
        icon={<Icon name={'clock'} size={36} />}
      />
    </div>
  );
};

export default CallsStats;
