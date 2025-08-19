import React from 'react';
import styles from "./Adaptive.module.sass";
import Card from "../../../../../../shared/Card";
import ServiceBadge, {serviceStatuses} from "../Statuses";
import Basis from "../../../../../../shared/Basis";
import Icon from "../../../../../../shared/Icon";
import {formatDateWithOnlyDigits} from "../../../../../../utils/formate.date";
import CardField from "../CardField";

const AdaptiveStages = ({data}) => {
    
    return (
        <div className={styles.container}>

            <Card className={styles.card}>
                <div>
                        <p className={styles.etap}>Этап №{data.number}</p>
                        <div className={styles.header}><p>{data.title}</p></div>
                        <div className={styles.deadline}>
                                <Basis className={styles.taskDatesAndStatus}>
                                    <Icon size={20} name={'calendar'}/>
                                    <span>{formatDateWithOnlyDigits(data.task.startDate)} - {formatDateWithOnlyDigits(data.task.endDate)}</span>
                                </Basis>
                        </div>
                            <ServiceBadge cls={styles.status}  status={data.task.status} statusType={serviceStatuses.tasks}/>
                    </div>
            </Card>
        </div>)

};

export default AdaptiveStages;