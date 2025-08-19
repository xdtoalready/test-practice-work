import useStore from "../../../hooks/useStore";
import useMembersApi from "../../Members/members.api";
import {useEffect} from "react";

const useMembers = () => {
    const {membersStore} = useStore()
    const api = useMembersApi()
    useEffect(() => {
        async function getMembers(){
            if(!membersStore.members.length)
                api.getMembers()
        }
        getMembers().catch(console.error)
    }, [membersStore,api]);
    return membersStore;
};

export default useMembers;