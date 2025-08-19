import React, { useMemo } from 'react';
import styles from '../../pages/Services/components/ServicesTable/components/EditModal/Modal.module.sass';
import Switch from '../../shared/Switch';
import { inject } from 'mobx-react';
import DurationSelector from '../DurationSelector';
import useStages from '../../pages/Stages/hooks/useStages';

const Index = ({ onChange, stageId }) => {
  const { store: stagesStore } = useStages(stageId);
  const stage = useMemo(
    () => stagesStore.getById(+stageId),
    [stageId, stagesStore, stagesStore.stages, stagesStore.drafts],
  );

  return (
    <div>
      <div className={styles.name}>Обновления PDF-документов</div>
      <div>
        <Switch
          className={styles.switch}
          name={'sumByHand'}
          label={'Обновление ТЗ'}
          value={stage?.sumByHand}
          onChange={onChange}
        />
      </div>

      <div>
        <Switch
          className={styles.switch}
          name={'sumByHand'}
          label={'Обновление PDF акта'}
          value={stage?.sumByHand}
          onChange={onChange}
        />
      </div>

      <div className={styles.name}>Время</div>
      <div>
        <DurationSelector
          onChange={onChange}
          stageId={stageId}
          label={'Бюджет планируемого времени'}
        />
        <DurationSelector
          className={styles.flex__lowerGap}
          onChange={onChange}
          stageId={stageId}
          label={'Фактическое время'}
        />
      </div>
    </div>
  );
};

export default Index;
