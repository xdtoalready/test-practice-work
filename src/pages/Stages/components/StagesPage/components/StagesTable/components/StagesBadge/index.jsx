import React from 'react';
import cn from 'classnames';

import {
  colorStatusTaskTypesForTaskList,
  colorStatusTaskTypes as taskTypes,
} from '../../../../../../stages.types';
import Badge from '../../../../../../../../shared/Badge';
import styles from './Badge.module.sass';

export const StageStatuses = {
  tasks: taskTypes,
};

const StageBadge = ({ statusType, status, cls }) => {
  return (
    <Badge
      status={status}
      classname={cn(styles.status, cls)}
      statusType={statusType}
    />
  );
};

export default StageBadge;
