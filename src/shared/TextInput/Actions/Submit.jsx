import React from 'react';
import styles from "../TextInput.module.sass";
import Icon from "../../Icon";

const Submit = ({props,actions,label,setClose}) => {
    return (
        <div className={styles.submit} onClick={() => {
            setClose && setClose()

            actions.submit()
            props?.onEdit()
        }}><Icon fill={'#FF6A55'} size={20} name={'check-circle'}/>
            <p>{label}</p>
        </div>
    );
};

export default Submit;