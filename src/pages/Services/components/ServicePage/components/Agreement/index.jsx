import styles from '../Agreement/Agreement.module.sass'
import Button from "../../../../../../shared/Button";
import CardField from "../CardField";
import React from "react";
import Icon from "../../../../../../shared/Icon";
import ServiceBadge, {serviceStatuses} from "../Statuses";
import BasisComponent from "../../../../../../shared/Basis";
import cn from "classnames";
const Agreement = ({ agreement }) => {
    return (
        <div className={styles.agreement_main}>
            <CardField labelCls={styles.label}  label={'Договор'}>
                <BasisComponent className={styles.button_container}  basis={1530}>
                    <Button type={'secondary'} after={<Icon size={24} name={'download'}/>} classname={styles.button}
                            name={'Договор на сайт'}/>

                </BasisComponent>
                <Button isSmallButton={true} adaptiveIcon={<Icon size={16} viewBox={'0 0 20 20'}  name={'add'}/>} classname={cn(styles.addButton)} name={'Создать отчет'}/>

            </CardField>
        </div>
    );
};

export default Agreement;