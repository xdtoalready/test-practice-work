import React from 'react';
import Icon from "../../Icon";

const CardLabel = ({label,onAdd}) => {
    return (
        <div>
            {label}
            <Icon onClick={onAdd} fill={'#6F767E'} size={10} name={'plus'}/>
        </div>
    );
};

export default CardLabel;