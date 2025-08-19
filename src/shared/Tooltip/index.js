import React, {useRef} from "react";
import cn from "classnames";
import styles from "./Tooltip.module.sass";
import Icon from "../Icon";
import useTooltip from "../../hooks/useTooltip";
import 'react-tooltip/dist/react-tooltip.css'
import {Tooltip as ReactTooltip} from "react-tooltip";
import uuid from "draft-js/lib/uuid";

interface IProps{
    className?:string,
    title?:string,
    place?:string,
    children:React.ReactNode
}
const Tooltip = ({ className, setClose, title, place='top', children, id=uuid(),event='hover',close=false }) => {
    const hasChildren = !!React.Children.count(children);
    const ref = useRef(null)
    const childrenWithProps = hasChildren &&  React.Children?.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                'data-tooltip-id': id,
            });
        }
        return child;
    });
    if(close === true){

        ref?.current?.close()
        setClose(false)
    }

    return (
        <>
        {childrenWithProps}
        <ReactTooltip ref={ref} place={place} clickable={true} events={[event]} className={styles.tooltip_container} id = {id}>
        <div onClick={()=>{
            // setClose && setClose()
        }}
            className={cn(styles.tooltip, className)}
        >
            {title}
        </div>
        </ReactTooltip>
        </>);
};
export default Tooltip;
