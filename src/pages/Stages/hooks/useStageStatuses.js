import {stageStatusTypesRu} from "../stages.types";

const useStageStatuses = () => {
    const types = stageStatusTypesRu
    return Object.entries(types)
};

export default useStageStatuses