import React from 'react';
import styles from './HiddenCount.module.sass';
import cn from 'classnames';

const HiddenCount = ({ hiddenCount, show, onClick, cls }) => {
  if (!show) {
    return null; // Если нет скрытых элементов или все элементы отображены, не рендерим ничего
  }

  return (
    <div className={cn(styles.moreActivities, cls)} onClick={onClick}>
      +{hiddenCount}
    </div>
  );
};

export default HiddenCount;
