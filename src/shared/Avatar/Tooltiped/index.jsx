import React from 'react';
import Tooltip from "../../Tooltip";
import Avatar from "../index";
import styles from "../../../pages/Clients/components/ClientPage/Activities/AdaptiveCard/Card.module.sass";

const TooltipedAvatar = ({title,imageSrc}) => {
    return (
        <div>
            <Tooltip title={title}>
                <div>
                    <Avatar className={styles.avatar} imageSrc={imageSrc}/>
                </div>
            </Tooltip>
        </div>
    );
};

export default TooltipedAvatar;