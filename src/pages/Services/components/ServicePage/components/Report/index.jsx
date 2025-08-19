import React from 'react';
import styles from "./Report.module.sass";
import Icon from "../../../../../../shared/Icon";
import {formatDateWithOnlyDigits} from "../../../../../../utils/formate.date";
import ServiceBadge, {serviceStatuses} from "../Statuses";
import CardField from "../CardField";
import Button from "../../../../../../shared/Button";
import Basis from "../../../../../../shared/Basis";

const Report = () => {
    return (
        <div>
            {/*<CardField label={'Отчет'}>*/}
            {/*    <Basis className={styles.report_container}>*/}
            {/*    </Basis>*/}
            {/*    <Button isSmallButton={true} adaptiveIcon={<Icon size={16} viewBox={'0 0 20 20'}  name={'add'}/>} classname={styles.button} name={'Создать отчет'}/>*/}

            {/*</CardField>*/}
        </div>
    );
};

export default Report;