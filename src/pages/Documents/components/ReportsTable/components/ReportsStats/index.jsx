import useStore from '../../../../../../hooks/useStore';
import StatsWidget from '../../../../../../shared/Widget';
import styles from './styles.module.sass';

const ReportsStats = () => {
  const { reportsStore } = useStore();
  if (!reportsStore.stats) return <></>;

  const { total, viewed, agreed } = reportsStore.stats;

  return (
    <div className={styles.container}>
      <StatsWidget
        title="Создано отчетов"
        value={total || 0}
        showChart={true}
        icon={'/reports-created.svg'}
        customColor="#2A85FF"
        borderColor="#2A85FF"
        percent={100}
      />
      <StatsWidget
        title="Просмотрено отчетов"
        value={viewed?.amount || 0}
        percent={viewed?.percent || 0}
        showChart={true}
        icon={'/reports-viewed.svg'}
        customColor="#FF6A55"
        customPercentColor="#FF6A55"
        borderColor="#FF6A55"
      />
      <StatsWidget
        title="Согласовано отчетов"
        value={agreed?.amount || 0}
        percent={agreed?.percent || 0}
        showChart={true}
        icon={'/reports-agreed.svg'}
        customColor="#83BF6E"
        customPercentColor="#83BF6E"
        borderColor="#83BF6E"
      />
    </div>
  );
};

export default ReportsStats;