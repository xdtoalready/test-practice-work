import React, {useMemo} from 'react';
import styles from "./Card.module.sass";
import Card from "../../../../../../shared/Card";
import Badge from "../../../../../../shared/Badge";
import Avatar from "../../../../../../shared/Avatar";
import Button from "../../../../../../shared/Button";
import {formatDateWithoutHours, formatHours} from "../../../../../../utils/formate.date";
import Tooltip from "../../../../../../shared/Tooltip";
import ManagerCell from "../../../../../../components/ManagerCell";
import ActivityType from "../Type";
import TooltipedAvatar from "../../../../../../shared/Avatar/Tooltiped";

const AdaptiveCard = ({data, onPagination}) => {
    const groupByDate = (items) => {
        return items?.reduce((acc, item) => {
            const date = new Date(item.date);
            //TODO - убрать когда добавят бек
            date.setDate(date.getDate()+1)
            const dateString = date.toISOString().split('T')[0]; // Извлекаем YYYY-MM-DD

            if (!acc[dateString]) {
                acc[dateString] = [];
            }
            acc[dateString].push(item);

            return acc;
        }, {});
    };

    const groupedItems = useMemo(() => groupByDate(data), [data]);
    return (
        <Card className={styles.container}>
            {Object.keys(groupedItems).map((date) => {
                return <div className={styles.card}>
                    <div key={date}>
                        <p className={styles.date}>{formatDateWithoutHours(new Date(date))}</p>
                        {groupedItems[date].map((item, index) => (
                            <div className={styles.body} key={index}>
                                <div>
                                    <div>{item.description}</div>
                                    <div className={styles.time}>{formatHours(item.time)}</div>
                                </div>
                                <TooltipedAvatar title={item?.assignee.name} imageSrc={item?.assignee.image}/>
                                <div>
                                    <ActivityType className={styles.cell_manager} type={item.type} membersCount={item.members}/>
                                </div>
                                {/* Другие поля объекта */}
                            </div>
                        ))}
                    </div>
                </div>
            })}
            {onPagination && <Button classname={styles.button} isSmallButton={false} name={'Показать еще(10)'}/>}

        </Card>
    );
};

export default AdaptiveCard;