import React from 'react';
import cn from "classnames";
import styles from "../TextInput.module.sass";
import Icon from "../../Icon";

const Index = ({props,actions,label,inputRef,setClose}) => {
    return (
        <div onClick={() => {

            actions?.onEdit ? actions?.onEdit() : props?.onEdit()
            inputRef && setTimeout(()=>  inputRef?.current?.focus(),100)
        }} className={cn(styles.edit, {[styles.edit_active]: props?.edited})}>
            <Icon name={'edit'} size="20"/>{" "}
            <p>{label}</p>
        </div>
    );
};

export default Index;