import React from 'react';
import styles from "../TextInput.module.sass";
import Icon from "../../Icon";

const Call = ({setClose,label,actions,inputRef}) => {
    return (
        <div
            onClick={() => {
                setClose && setClose()
                actions?.call(inputRef.current.value)
            }} className={styles.add}>
            <Icon fill={'#6F767E'} size={22} viewBox={'0 0 30 30'} name={'call'}/>
            <p>{label}</p>
        </div>
    );
};

export default Call;