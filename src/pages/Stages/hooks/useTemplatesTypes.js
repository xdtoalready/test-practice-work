import React, { useEffect } from 'react';
import useStore from '../../../hooks/useStore';
import useStageApi from '../stages.api';

const UseTemplatesTypes = () => {
  const { stagesStore } = useStore();
  const api = useStageApi();
  useEffect(() => {
    async function getStageTemplates() {
      if (!stagesStore.templateTypes.length) return api.getTemplateTypes();
    }
    getStageTemplates().catch(console.error);
  }, [stagesStore.templateTypes, stagesStore.drafts, api]);

  return stagesStore.templateTypes;
};

export default UseTemplatesTypes;
