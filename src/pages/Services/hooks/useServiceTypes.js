import React, {useEffect} from 'react';
import useStore from "../../../hooks/useStore";
import useClientsApi from "../../Clients/clients.api";
import useServiceApi from "../services.api";
import useMappedObj from "../../../hooks/useMappedObj";
import {serviceTypeEnum} from "../services.types";

const UseServiceTypes = () => {
    const mappedService = useMappedObj(serviceTypeEnum)
    // const {servicesStore} = useStore()
    // const api = useServiceApi()
    // useEffect(() => {
    //     async function getServiceTypes(){
    //         if(!servicesStore.serviceTypes.length)
    //             return api.getServiceTypes()
    //     }
    //     getServiceTypes().catch(console.error)
    // }, [servicesStore.serviceTypes,servicesStore.drafts,api]);
    //
    // return servicesStore.serviceTypes;
    return mappedService
};

export default UseServiceTypes;