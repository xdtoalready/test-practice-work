import useStore from "../../../hooks/useStore";
import useServiceApi from "../services.api";
import {useEffect} from "react";
import {statusTypes, statusTypesRu} from "../services.types";

const useServiceStatuses = () => {
    const types = statusTypesRu
    return Object.entries(types)
};

export default useServiceStatuses