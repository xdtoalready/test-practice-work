import React, { useRef, useState } from 'react';
import styles from './Task.module.sass';
import { formatDateWithOnlyDigits } from '../../../../../../utils/formate.date';
import CardField from '../CardField';
import Icon from '../../../../../../shared/Icon';
import TextLink from '../../../../../../shared/Table/TextLink';
import Basis from '../../../../../../shared/Basis';
import { declineWord } from '../../../../../../utils/format.string';
import DescriptionModal from '../../../../../../components/DescriptionModal';

const Task = ({ stage, task, taskName, ...rest }) => {
  useRef();
  const [isDescriptionOpen, setDescriptionOpen] = useState(false);
  return (
    <div key={rest?.key} className={styles.task_container}>
      <div>
        <CardField label={'Сроки'}>
          <Basis className={styles.taskDatesAndStatus}>
            <Icon size={20} name={'calendar'} />
            <span>
              {formatDateWithOnlyDigits(stage.startDate)} -{' '}
              {formatDateWithOnlyDigits(stage.endDate)}
            </span>
          </Basis>
        </CardField>
        {stage?.description && stage?.description !== ' ' && <CardField label={'ТЗ'}>
          <Basis className={styles.taskName}>
            <TextLink className={styles.taskName_primary} onClick={() => setDescriptionOpen(true)}>Подробнее...</TextLink>
          </Basis>
        </CardField>}
        <CardField label={'Задачи'}>
          <Basis className={styles.taskName}>
            <div>
              <span className={styles.taskName_primary}>
                <span>
                  {stage.taskCount}{' '}
                  {`${declineWord('задача', stage.taskCount)}`}
                </span>
              </span>
            </div>
          </Basis>
        </CardField>
      </div>
      {isDescriptionOpen &&
        <DescriptionModal label={'ТЗ'} description={stage.description} onClose={() => setDescriptionOpen(false)} />}
    </div>
  );
};

export default Task;
