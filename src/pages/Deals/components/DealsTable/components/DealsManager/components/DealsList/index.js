import React from 'react';
import { useDrop } from 'react-dnd';
import styles from './List.module.sass';
import cn from 'classnames';
import withScrolling, { createHorizontalStrength } from 'react-dnd-scrolling';
import DealCard from "../DealCard";

const horizontalStrength = createHorizontalStrength(100);
const ScrollingComponent = withScrolling('div', {
    strengthMultiplier: 1000000,
    horizontalStrength,
});

const DealsList = ({ data, onChange, onClick }) => {
    const handleDrop = (dealId, newStatus) => {
        onChange(dealId, newStatus);
    };

    return (
        <ScrollingComponent className={styles.dealList}>
            {data.map((column) => (
                <Column
                    key={column.type}
                    type={column.type}
                    typeRu={column.typeRu}
                    values={column.values}
                    color={column.color.color}
                    sumPrice={column.sumPrice}
                    onDrop={handleDrop}
                    onClick={onClick}
                />
            ))}
        </ScrollingComponent>
    );
};

const Column = ({ type, typeRu, values, color, sumPrice, onDrop, onClick }) => {
    const [, drop] = useDrop({
        accept: 'DEAL',
        drop: (item) => {
            onDrop(item.id, type);
        },
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div ref={drop} className={styles.dealColumn} style={{ borderColor: color }}>
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    {typeRu} <span className={styles.counts}>{values.length}</span>
                </div>
                <div className={styles.headerSum}>{formatPrice(sumPrice)}</div>
            </div>
            <div className={cn(color, styles.divider)}></div>
            <div className={styles.scroll}>
                {values.map((deal) => (
                    <div key={deal.id} onClick={(e) => onClick(e,deal)}>
                        <DealCard deal={deal} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DealsList;