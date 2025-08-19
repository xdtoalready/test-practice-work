import React from 'react';
import cn from "classnames";
import styles from "../TextInput.module.sass";
import Icon from "../../Icon";

const See = ({props,inputRef,label}) => {
    const makeInputVisible = () => {
        inputRef.current.type = 'text'
    }
    const makeInputPassword = () => {
        inputRef.current.type = 'password'
    }
    return (
        <div onClick={() => {
            props?.onSee()
            props?.seen ? makeInputPassword() : makeInputVisible()
        }} className={cn(styles.see, {[styles.see_active]: props?.seen})}>
            <Icon name={'show'} viewBox={'0 0 18 18'} size="20"/>{" "}
            <p>{label}</p>
        </div>
    );
};

export default See;