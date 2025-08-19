import styles from './Hours.module.sass';
import CardField from '../CardField';
import Icon from '../../../../../../shared/Icon';
import Button from '../../../../../../shared/Button';
import Basis from '../../../../../../shared/Basis';
import cn from 'classnames';
import { getFormattedTimeType } from '../../../../../../utils/format.time';
import HoursComponent from '../../../../../../components/HoursComponent';
import CostView from '../../../../../../components/CostView';
const Hours = ({ time, actSum, el }) => {
  console.log(time, actSum, el, 'sum');
  return (
    <div className="hours">
      {/*<div>*/}
      {/*    <strong>Planned:</strong>*/}
      {/*    <span>{hours.planned.planned}h planned</span>*/}
      {/*    <span>{hours.planned.actual}h actual</span>*/}
      {/*</div>*/}
      {/*<div>*/}
      {/*    <strong>Extra:</strong>*/}
      {/*    <span>{hours.extra.planned}h planned</span>*/}
      {/*    <span>{hours.extra.actual}h actual</span>*/}
      {/*    <span>{hours.extra.cost}₽</span>*/}
      {/*</div>*/}
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
            {actSum!==null && <CostView cost={actSum}></CostView>}
        </Basis>
      </CardField>
      {/*<CardField*/}
      {/*  labelCls={styles.labelExtra}*/}
      {/*  cls={cn(styles.hoursView_container)}*/}
      {/*  label={'Время сверх ТЗ'}*/}
      {/*>*/}
      {/*  <HoursView*/}
      {/*    basis={282}*/}
      {/*    type={getFormattedTimeType(time.extra.type)}*/}
      {/*    time={time.extra.planned}*/}
      {/*    label={'плановое время'}*/}
      {/*  ></HoursView>*/}
      {/*  <HoursView*/}
      {/*    basis={400}*/}
      {/*    type={getFormattedTimeType(time.extra.type)}*/}
      {/*    time={time.extra.actual}*/}
      {/*    label={'фактическое время'}*/}
      {/*  ></HoursView>*/}
      {/*  <Basis basis={740} className={styles.costs}>*/}
      {/*    <CostView cost={time.extra.cost}></CostView>*/}
      {/*    <Button*/}
      {/*      classname={styles.add_button}*/}
      {/*      type={'secondary'}*/}
      {/*      name={'Добавить счет'}*/}
      {/*    />*/}
      {/*  </Basis>*/}
      {/*</CardField>*/}
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
