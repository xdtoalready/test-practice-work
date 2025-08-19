import React from 'react';
import Icon from "../../Icon";
import styles from "../TextInput.module.sass";

const Add = ({inputRef,actions,label,setClose,props}) => {
    return (
        <div
            onClick={() => {
                // console.log(inputRef.current,'curr')
                setClose && setClose()
                actions?.add()
            }} className={styles.add}>
            <Icon fill={'#6F767E'} size={12} name={'plus'}/>
            <p>{label}</p>
        </div>
    );
};

export default Add;