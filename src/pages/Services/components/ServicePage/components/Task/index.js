import React, { useRef, useState } from 'react';
import styles from './Task.module.sass';
import {
  formatDateWithDateAndYear,
  formatDateWithOnlyDigits,
  formatDateWithoutHours,
} from '../../../../../../utils/formate.date';
import CardField from '../CardField';
import Button from '../../../../../../shared/Button';
import Badge from '../../../../../../shared/Badge';
import ServiceBadge, { serviceStatuses } from '../Statuses';
import Image from '../../../../../../shared/Image';
import Icon from '../../../../../../shared/Icon';
import TextLink from '../../../../../../shared/Table/TextLink';
import Basis from '../../../../../../shared/Basis';
import useOutsideClick from '../../../../../../hooks/useOutsideClick';
import { declineWord } from '../../../../../../utils/format.string';
import DescriptionModal from "../../../../../../components/DescriptionModal";

const Task = ({ stage, task, taskName, ...rest }) => {
  console.log(task,stage,'task')
  // const { last: localTask, total } = task;
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const [isDescriptionOpen,setDescriptionOpen] = useState(false)
  // useOutsideClick(ref, () => setIsOpen(false));
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
            {/*<ServiceBadge*/}
            {/*  statusType={serviceStatuses.tasks}*/}
            {/*  status={localTask.status}*/}
            {/*/>*/}
          </Basis>
          {/*<Button*/}
          {/*  classname={styles.button}*/}
          {/*  type={'primary'}*/}
          {/*  isSmallButton={true}*/}
          {/*  adaptiveIcon={<Icon size={16} viewBox={'0 0 20 20'} name={'add'} />}*/}
          {/*/>*/}
        </CardField>
        {stage?.description && stage?.description!==' ' && <CardField label={'ТЗ'}>
          <Basis className={styles.taskName}>
            <TextLink   className={styles.taskName_primary} onClick={()=>setDescriptionOpen(true)}>Подробнее...</TextLink>
          </Basis>
        </CardField>}
        <CardField label={'Задачи'}>
          <Basis className={styles.taskName}>
            <div>
              <span
                // onClick={() => setIsOpen(true)}
                className={styles.taskName_primary}
              >
                <span>
                  {stage.taskCount}{' '}
                  {`${declineWord('задача', stage.taskCount)}`}
                </span>
              </span>
            </div>
            {/*<div className={styles.dateDeadline}>*/}
            {/*  <Icon size={20} name={'calendar'} />*/}
            {/*  <span>{formatDateWithDateAndYear(localTask.startDate)}</span>*/}
            {/*  <span className={styles.taskName_secondary}>Дедлайн</span>*/}
            {/*</div>*/}
          </Basis>
        </CardField>
      </div>
      {isDescriptionOpen && <DescriptionModal label={'ТЗ'} description={stage.description} onClose={()=>setDescriptionOpen(false)}/>}
    </div>
  );
};

export default Task;
