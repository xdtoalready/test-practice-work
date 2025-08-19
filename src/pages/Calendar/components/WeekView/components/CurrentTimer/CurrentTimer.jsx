import React, {useCallback, useEffect, useMemo} from 'react';
import styles from './Timer.module.sass';
import {isSameDay} from "date-fns";
const CurrentTimer = ({currentTime,weekDays,gridHeight}) => {
    const currentDayIndex = weekDays.findIndex(day =>
        isSameDay(day, currentTime)
    );





    const topPos = useMemo(() => {

        if (!gridHeight) return 0; // Default to 0 if height isn’t available yet

        // Workday starts at 9:00 (9 AM) and ends at 23:00 (11 PM)
        const startHour = 9;
        const endHour = 24;
        const totalWorkHours = endHour - startHour; // 14 hours

        // Current time in hours and minutes
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();

        // Convert current time to minutes since 9 AM
        const currentMinutesSinceStart = (hours - startHour) * 60 + minutes;

        // Total minutes in the workday
        const totalWorkMinutes = totalWorkHours * 60; // 840 minutes (14 hours)

        // Calculate the position as a fraction of the grid height
        const positionInPixels = (currentMinutesSinceStart / totalWorkMinutes) * gridHeight;

        return positionInPixels;
    }, [currentTime, gridHeight]);

    return (
        <div
            className={styles.timerContainer}
            style={{
                left: `calc(28px + (100% - 46px) * ${currentDayIndex} / ${weekDays.length})`,
                width: `calc((100% - 112px) / ${weekDays.length})`,
                top: `${topPos}px`, // Use pixel value instead of percentage
            }}
        >
            <div className={styles.timeMarker} />
            <div className={styles.timeLine} />
        </div>
    );
};

export default CurrentTimer;