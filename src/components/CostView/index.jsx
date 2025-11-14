import styles from '../../pages/Services/components/ServicePage/components/Hours/Hours.module.sass';

const CostView = ({ cost }) => {
  return (
    <div className={styles.hoursView}>
      <img src={'/images/content/notes.svg'} />
      <p className={styles.hoursView_text}>
        <span>{Number(cost).toFixed(2)} ₽</span>
      </p>
    </div>
  );
};
export default CostView;
