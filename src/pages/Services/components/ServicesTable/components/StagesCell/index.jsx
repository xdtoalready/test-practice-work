import React, { useState } from 'react';
import styles from './stages.module.sass';
import { Link } from 'react-router-dom';
import HiddenCount from '../../../../../../components/HiddenCount';
import { truncateString } from '../../../../../../utils/format.string';
import TextLink from '../../../../../../shared/Table/TextLink';

const StagesCell = ({ stages, maxCellLength = -1, serviceId }) => {
  const [showAll, setShowAll] = useState(false);
  const stageList = Array.isArray(stages)
    ? [stages[stages.length - 1]]
    : [stages?.last];
  const totalStages = Array.isArray(stages)
    ? stages.length
    : stages?.total || 0;
  const hiddenCount = totalStages - 1;

  return (
    <div className={styles.stagesCell}>
      {stageList.map((stage, index) => (
        <div className={styles.stage} key={index}>
          <div className={styles.name}>
            {stage && (
              <TextLink to={`/services/${serviceId}/stages/${stage?.id}`}>
                {stage?.title}
              </TextLink>
            )}
          </div>
        </div>
      ))}
      {/*<HiddenCount*/}
      {/*  cls={styles.moreCount}*/}
      {/*  hiddenCount={hiddenCount}*/}
      {/*  show={hiddenCount > 0 && !showAll}*/}
      {/*/>*/}
    </div>
  );
};

export default StagesCell;
