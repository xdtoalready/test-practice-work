import React from 'react';
import styles from './styles.module.sass';
import {
    CircularProgressbarWithChildren,
    buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import cn from 'classnames';

const StatsWidget = ({
                         title,
                         sum,
                         percent,
                         showChart,
                         color,
                         icon,
                         iconStyles={},
                         type,
                         value,
                         customColor,
                         customPercentColor,
                         borderColor,
                     }) => {
    const renderIcon = () => {
        if (typeof icon === 'string') {
            return <img className={cn(styles.icon_inner,iconStyles)} src={icon} alt={title} />;
        }
        return <div className={styles.icon_inner}>{icon}</div>;
    };

    const renderValue = () => {
        const elements = [];

        if (sum) {
            elements.push(
                <span key="sum">{sum.toLocaleString()} ₽</span>
            );
        }

        if (value!==null && value !== undefined) {
            elements.push(
                <span key="value">{value}</span>
            );
        }

        if (percent !== null && percent !== undefined) {
            const percentStyle = customPercentColor
                ? { color: customPercentColor }
                : {};
            elements.push(
                <span
                    key="percent"
                    className={cn(styles.percent, type && styles[type])}
                    style={percentStyle}
                >
                    {percent}%
                </span>
            );
        }

        return elements;
    };

    // Определяем цвет линии прогресса
    const getPathColor = () => {
        if (customColor) return customColor;
        if (type === 'accept') return '#83BF6E';
        if (type === 'reject') return '#C31212';
        return '#2A85FF';
    };

    const widgetStyle = borderColor
        ? { '--border-color': borderColor }
        : {};

    return (
        <div className={styles.widget} style={widgetStyle}>
            <div className={styles.icon}>
                {showChart ? (
                    <CircularProgressbarWithChildren
                        value={percent || 0}
                        strokeWidth={2}
                        styles={buildStyles({
                            textColor: '#ffffff',
                            pathTransitionDuration: 0.5,
                            pathColor: getPathColor(),
                            trailColor: '#EFEFEF',
                        })}
                    >
                        {renderIcon()}
                    </CircularProgressbarWithChildren>
                ) : (
                    renderIcon()
                )}
            </div>
            <div className={styles.content}>
                <div className={cn(styles.title)}>{title}</div>
                <div className={cn(styles.value)}>
                    {renderValue()}
                </div>
            </div>
        </div>
    );
};

export default StatsWidget;