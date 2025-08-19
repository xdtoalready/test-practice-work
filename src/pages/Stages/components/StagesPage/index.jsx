import React, { useEffect, useMemo } from 'react';
import useClients from '../../../Clients/hooks/useClients';
import ClientInfo from './components/ClientInfo';
import useParamSearch from '../../../../hooks/useParamSearch';
import { useParams } from 'react-router';
import useStages from '../../hooks/useStages';
import {
  StagesTable,
  StagesTableWithTasksQuery,
} from './components/StagesTable';
import styles from './stages.module.sass';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react';
import useStore from '../../../../hooks/useStore';
import useStageApi from '../../stages.api';
import useTasksApi from '../../../Tasks/tasks.api';
import { LoadingProvider } from '../../../../providers/LoadingProvider';

const StagesPage = observer(() => {
  const { stagesStore } = useStore();
  const { tasksStore } = useStore();
  const api = useStageApi();
  const taskApi = useTasksApi();

  const { stageId } = useParams();

  let { data: stage, isLoading } = useStages(Number(stageId));

  // useEffect(() => {
  //   return () => {
  //     stage = null;
  //     stagesStore.clearCurrentStage();
  //   };
  // }, []);
  return (
    <LoadingProvider isLoading={isLoading}>
      <motion.div className={styles.container}>
        {stage && (
          <StagesTableWithTasksQuery
            stage={stage}
            stagesStore={stagesStore}
            stageApi={api}
            taskStore={tasksStore}
            taskApi={taskApi}
          />
        )}
      </motion.div>
    </LoadingProvider>
  );
});

export default StagesPage;
