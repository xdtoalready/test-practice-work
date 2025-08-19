import React, { useState } from 'react';
import styles from './ActivitieslCell.module.sass';
import {
  formatDateWithoutHours,
  formatHours,
} from '../../../../../../utils/formate.date';
import { Link } from 'react-router-dom';
import HiddenCount from '../../../../../../components/HiddenCount';

const ActivitiesCell = ({ activities }) => {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll((prevShowAll) => !prevShowAll);
  };

  const visibleActivities = showAll ? activities : activities.slice(0, 1);
  const hiddenCount = activities.length - 1;

  return (
    <div className={styles.activitiesCell}>
      {visibleActivities.map((el, index) => (
        <React.Fragment key={index}>
          {
            <div className={styles.activity}>
              <div className={styles.name}>
                <Link className={styles.link}>{el.description}</Link>
                {/*{hiddenCount > 0 && !showAll && (*/}
                {/*  <div*/}
                {/*    className={styles.moreActivities}*/}
                {/*    onClick={toggleShowAll}*/}
                {/*  >*/}
                {/*    +{hiddenCount}*/}
                {/*  </div>*/}
                {/*)}*/}
                <HiddenCount
                  cls={styles.moreCount}
                  hiddenCount={hiddenCount}
                  show={hiddenCount > 0 && !showAll}
                  onClick={toggleShowAll}
                />
              </div>
              <div className={styles.deadline}>
                {formatDateWithoutHours(el.date)}, {formatHours(el.time)}
              </div>
            </div>
          }
        </React.Fragment>
      ))}
    </div>
  );
};

export default ActivitiesCell;
