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
                         value
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

        if (value!==null) {
            elements.push(
                <span key="value">{value}</span>
            );
        }

        if (percent) {
            elements.push(
                <span key="percent" className={cn(styles.percent, styles[type])}>
          {percent}%
        </span>
            );
        }

        return elements;
    };

    return (
        <div className={styles.widget}>
            <div className={styles.icon}>
                {showChart ? (
                    <CircularProgressbarWithChildren
                        value={percent}
                        strokeWidth={2}
                        styles={buildStyles({
                            textColor: '#ffffff',
                            pathTransitionDuration: 0.5,
                            pathColor: type === 'accept' ? '#83BF6E' : '#C31212',
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