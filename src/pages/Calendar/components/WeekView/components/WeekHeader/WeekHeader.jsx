import React from 'react';
import {format, isSameDay} from "date-fns";
import {ru} from "date-fns/locale/ru";
import styles from './Header.module.sass'
import useStore from "../../../../../../hooks/useStore";
import {useBusinessLayout} from "../../../../hooks/useBusinessLayout";
import {useBusinessEvents} from "../../../../hooks/useBussinessEvent";
import WeekBusinessItem from "../../../Item/Week/WeekBusiness";
import cn from "classnames";

const WeekHeader = ({weekDays,hours,timeSlots}) => {
    const { calendarStore } = useStore();
    const currentDate = calendarStore.currentDate;
    const businesses = calendarStore.getBusinesses();
    const businessesByDay = useBusinessEvents(businesses, currentDate, 'week');
    const layout = useBusinessLayout(businesses, 'week', currentDate);

    const allDayEvents = React.useMemo(() => {
        const result = {};
        weekDays.forEach(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayEvents = businessesByDay[dateKey] || [];
            result[dateKey] = dayEvents.filter(business => layout[business.id]?.isAllDay);
        });
        return result;
    }, [businessesByDay, weekDays, layout]);

    return (
        <div className={styles.weekHeader}>
            {/*<div className={styles.timeGutter}/>*/}
            {weekDays.map(day => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const dayAllDayEvents = allDayEvents[dateKey] || [];
                const isCurrDay = isSameDay(new Date(),day)
                return (
                    <div key={day.toISOString()} className={styles.dayColumn}>
                        <div className={styles.dayHeader}>
                                {format(day, 'cccccc', { locale: ru }).toUpperCase()}
                                <span className={cn(styles.dayNumber,{[styles.isCurrentDay]:isCurrDay})}>
                                    {format(day, 'd')}
                                </span>
                        </div>
                        <div className={styles.allDayEvents}>
                            {dayAllDayEvents.map(business => (
                                <WeekBusinessItem
                                    key={business.id}
                                    business={business}
                                    isAllDay
                                    customDragProps={{
                                        isAllDay: true,
                                        dayIso: dateKey
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default WeekHeader;