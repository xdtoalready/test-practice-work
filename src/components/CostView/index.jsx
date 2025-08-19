import styles from '../../pages/Services/components/ServicePage/components/Hours/Hours.module.sass';
import Icon from '../../shared/Icon';
// import * from '/images/content/notes.svg';

const CostView = ({ cost }) => {
    console.log('cost',cost)
  return (
    <div className={styles.hoursView}>
      {/*<svg width={16} height={16} viewBox={'0 0 16 16'}>*/}
      {/*  <use href={'/images/content/notes.svg'} />*/}
      {/*</svg>*/}
      <img src={'/images/content/notes.svg'} />
      <p className={styles.hoursView_text}>
        <span>{Number(cost).toFixed(2)} ₽</span>
      </p>
    </div>
  );
};
export default CostView;
