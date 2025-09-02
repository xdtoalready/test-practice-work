import useStore from '../../../../../../hooks/useStore';
import StatsWidget from '../../../../../../shared/Widget';
import styles from './styles.module.sass';

const ReportsStats = () => {
  const { reportsStore } = useStore();
  if (!reportsStore.stats) return <></>;
  
  const { total, sent, approved } = reportsStore.stats;

  return (
    <div className={styles.container}>
      <StatsWidget
        title="Создано отчетов"
        sum={total}
        showChart={false}
        icon={'/coins.svg'}
      />
      <StatsWidget
        type={'accept'}
        title="Отправлено отчетов"
        sum={sent?.sum || 0}
        percent={sent?.percent || 0}
        showChart={true}
        icon={'/credit-check.png'}
      />
      <StatsWidget
        type={'reject'}
        title="Согласовано отчетов"
        sum={approved?.sum || 0}
        percent={approved?.percent || 0}
        showChart={true}
        icon={'/credit-x.png'}
      />
    </div>
  );
};

export default ReportsStats;