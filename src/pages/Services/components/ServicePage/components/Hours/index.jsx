import styles from './Hours.module.sass';
import CardField from '../CardField';
import Basis from '../../../../../../shared/Basis';
import { getFormattedTimeType } from '../../../../../../utils/format.time';
import HoursComponent from '../../../../../../components/HoursComponent';
import CostView from '../../../../../../components/CostView';

const Hours = ({ time, actSum }) => {
  return (
    <div className="hours">
      <CardField labelCls={styles.labelPlanned} label={'Время по ТЗ'}>
        <HoursView
          basis={292}
          type={getFormattedTimeType(time.planned.type)}
          time={time.planned.planned}
          label={'плановое время'}
        ></HoursView>
        <HoursView
          basis={292}
          type={getFormattedTimeType(time.extra.type)}
          time={time.extra.actual}
          label={'фактическое время'}
        ></HoursView>
        <Basis basis={900} className={styles.costs}>
          {actSum !== null && <CostView cost={actSum}></CostView>}
        </Basis>
      </CardField>
    </div>
  );
};

const HoursView = ({ time, type, label, basis }) => {
  return (
    <Basis basis={basis} className={styles.hoursView}>
      <HoursComponent label={label} type={type} time={time} />
    </Basis>
  );
};

export default Hours;
