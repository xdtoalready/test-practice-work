import useStore from '../../../../../../hooks/useStore';
import BillStatsWidget from '../../../../../../shared/Widget';
import styles from './styles.module.sass';
import StatsWidget from '../../../../../../shared/Widget';

const BillStats = () => {
  const { billsStore } = useStore();
  if (!billsStore.stats) return <></>;
  const { total, paid, expired } = billsStore.stats;

  return (
    <div className={styles.container}>
      <StatsWidget
        title="Всего счетов на сумму"
        sum={total}
        showChart={false}
        icon={'/coins.svg'}
      />
      <StatsWidget
        type={'accept'}
        title="Оплачено счетов на сумму"
        sum={paid.sum}
        percent={paid.percent}
        showChart={true}
        icon={'/credit-check.png'}
      />
      <StatsWidget
        type={'reject'}
        title="Просрочено счетов на сумму"
        sum={expired.sum}
        percent={expired.percent}
        showChart={true}
        icon={'/credit-x.png'}
      />
    </div>
  );
};
export default BillStats;
