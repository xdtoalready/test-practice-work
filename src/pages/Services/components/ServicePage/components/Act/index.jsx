import styles from './Act.module.sass';
import Button from '../../../../../../shared/Button';
import CardField from '../CardField';
import React from 'react';
import Icon from '../../../../../../shared/Icon';
import ServiceBadge, { serviceStatuses } from '../Statuses';
import BasisComponent from '../../../../../../shared/Basis';
const Act = ({ act }) => {
  const downloadAct = (url) => {
    window.open(url, '_blank');
  };
  return (
    <div className={styles.act_main}>
      {(act.unstampedAct || act.stampedAct) && <CardField labelCls={styles.label} label={'Акт'}>
        <BasisComponent className={styles.button_container} basis={275}>
          {act.stampedAct && <Button
            onClick={() => downloadAct(act.stampedAct)}
            type={'secondary'}
            after={<Icon size={24} name={'download'} />}
            classname={styles.button}
            name={'Акт с печатью'}
          />}
        </BasisComponent>
        <BasisComponent className={styles.button_container} basis={270}>
          {act.unstampedAct && <Button
            onClick={() => downloadAct(act.unstampedAct)}
            type={'secondary'}
            after={<Icon size={24} name={'download'} />}
            classname={styles.button}
            name={'Акт без печати'}
          />}
        </BasisComponent>
        <BasisComponent basis={960} className={styles.statusContainer}>
          {/*<ServiceBadge statusType={serviceStatuses.act} status={act.scanStatus}/>*/}
          {/*<ServiceBadge statusType={serviceStatuses.act} status={act.originalStatus}/>*/}
        </BasisComponent>
      </CardField>}
    </div>
  );
};

export default Act;
