import React from 'react';
import styles from './Activity.module.sass'
import {Link} from "react-router-dom";
const Index = ({title,startTime,endTime}) => {
    return (
        <div className={styles.container}>
            <Link>
                <div>{title}</div>
            </Link>
            <div>{startTime} - {endTime}</div>
        </div>
    );
};

export default Index;