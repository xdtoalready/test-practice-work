import React, {useMemo, useRef, useState} from 'react';
import Tooltip from "../../Tooltip";
import ActionList from "../Actions/ActionList";
import useOutsideClick from "../../../hooks/useOutsideClick";
import uuid from "draft-js/lib/uuid";

const Index = ({className,classNameDot,actions,props,inputRef,classNameActions,classNameDotsContainer}) => {
    const [close,setCloseState] = useState(false)
    const ref = useRef(null)
    useOutsideClick(ref,()=>setCloseState(true))
    const currentId = useMemo(()=>uuid(),[])
    return (
        <div ref={ref}    className={classNameDotsContainer}>
            <Tooltip setClose={setCloseState} id={currentId} place={'bottom-start'} close={close}  event={'click'} title={<ActionList setClose={()=>{
                setCloseState(true)
            }} withLabels={true} actions={actions} props={props} inputRef={inputRef} classNameActions={classNameActions}/>}>
                <div  className={className}>
                    <div  className={classNameDot}></div>
                    <div className={classNameDot}></div>
                    <div className={classNameDot}></div>
                </div>
            </Tooltip>

        </div>
    );
};

export default Index;