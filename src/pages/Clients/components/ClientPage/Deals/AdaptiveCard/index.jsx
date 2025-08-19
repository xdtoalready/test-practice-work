import React from 'react';
import styles from "./Card.module.sass";
import Card from "../../../../../../shared/Card";
import Badge from "../../../../../../shared/Badge";
import Avatar from "../../../../../../shared/Avatar";
import Button from "../../../../../../shared/Button";
import Tooltip from "../../../../../../shared/Tooltip";
import cn from "classnames";

const AdaptiveCard = ({data, onPagination}) => {
    return (
        <div className={styles.container}>

                 <Card className={styles.card}>
                     {data.map((original) => {
                    return <div className={styles.card_inner}><div className={styles.header}>
                        <div className={styles.name}>{original?.description}</div>
                    </div>
                    <div className={styles.body}>
                        <div className={styles.status}>
                            <span>Статус</span>
                            <span>{original?.status}</span>
                        </div>
                        <div className={styles.sum}>
                            <span>Сумма</span>
                            <span>{original?.sum}</span>
                        </div>
                    </div>
                    <div className={styles.footer}>
                        <Tooltip title={original?.responsible?.name}>
                            <div className={cn(styles.avatar)}><Avatar imageSrc={original?.responsible?.image}/></div>
                        </Tooltip>
                    </div>
                     </div>})}

                    {onPagination && <Button classname={styles.button} isSmallButton={false} name={'Показать еще(10)'}/>}
                </Card>
        </div>
    );
};

export default AdaptiveCard;