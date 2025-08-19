import React from 'react';
import styles from "../TextInput.module.sass";
import Icon from "../../Icon";

const Delete = ({actions,props,inputRef,label,setClose}) => {
    return (
        <div onClick={(e) => {
            setClose && setClose()

            actions.delete(inputRef.current)
            props?.onEdit()
        }} className={styles.trash}>
            <Icon name={'trash'} size="20"/>{" "}
            <p>{label}</p>
        </div>
    );
};

export default Delete;