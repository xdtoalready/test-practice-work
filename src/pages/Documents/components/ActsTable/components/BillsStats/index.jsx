import useStore from '../../../../../../hooks/useStore';
import BillStatsWidget from '../../../../../../shared/Widget';
import styles from './styles.module.sass';
import StatsWidget from "../../../../../../shared/Widget";
const ActStats = () => {
  const { actsStore } = useStore();
  if (!actsStore.stats) return <></>;
  const { total, signed_sum, signed_percent,unsigned_sum,unsigned_percent } = actsStore.stats;

  return (
    <div className={styles.container}>
      <StatsWidget
        title="Всего актов на сумму"
        sum={total}
        showChart={false}
        icon={'/coins.svg'}
      />
      <StatsWidget
        type={'accept'}
        title="Оплачено актов на сумму"
        sum={signed_sum}
        percent={signed_percent}
        showChart={true}
        icon={'/credit-check.png'}
      />
      <StatsWidget
        type={'reject'}
        title="Просрочено актов на сумму"
        sum={unsigned_sum}
        percent={unsigned_percent}
        showChart={true}
        icon={'/credit-x.png'}
      />
    </div>
  );
};
export default ActStats;
