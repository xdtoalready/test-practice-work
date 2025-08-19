import React, { useCallback, useMemo, useState } from 'react';
import DualTimeSelector from '../DualTimeSelector';
import useStages from '../../pages/Stages/hooks/useStages';
import styles from '../../pages/Services/components/ServicesTable/components/EditModal/Modal.module.sass';
import cn from 'classnames';

const Index = ({ onChange, label, stageId, ...rest }) => {
  const { store: stagesStore } = useStages(stageId);
  const stage = useMemo(
    () => stagesStore.getById(+stageId),
    [stageId, stagesStore, stagesStore.stages, stagesStore.drafts],
  );

  return (
    <div>
      <div className={styles.label}>{label}</div>
      <div className={cn(styles.dualTimeWrap, styles.flex, rest?.className)}>
        <DualTimeSelector
          onChange={onChange}
          timeValue={stage?.budgetTimeValue}
          timeType={stage?.budgetTimeType}
        />
        <DualTimeSelector
          onChange={onChange}
          timeValue={stage?.budgetTimeValue}
          timeType={stage?.budgetTimeType}
        />
      </div>
    </div>
  );
};

export default Index;
