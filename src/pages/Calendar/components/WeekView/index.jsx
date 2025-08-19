import React, { useEffect, useRef, useState } from 'react';
import { observer } from "mobx-react";
import useStore from "../../../../hooks/useStore";
import { eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns";
import styles from './View.module.sass';
import WeekHeader from "./components/WeekHeader/WeekHeader";
import useCalendarApi from "../../calendar.api";
import WeekGrid from "./components/WeekGrid/WeekGrid";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 9);
const TIME_SLOTS = [0, 15, 30, 45];

const WeekView = observer(({ onCreateBusiness, onEditBusiness }) => {
    const calendarApi = useCalendarApi();
    const { calendarStore } = useStore();
    const currentDate = calendarStore.currentDate;

    const weekDays = eachDayOfInterval({
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 })
    });

    const [currentTime, setCurrentTime] = useState(new Date());
    const gridRef = useRef(null);
    const [gridHeight, setGridHeight] = useState(0);

    useEffect(() => {
        const updateGridHeight = () => {
            if (gridRef.current) {
                setGridHeight(gridRef.current.offsetHeight);
            }
        };

        updateGridHeight();
        window.addEventListener('resize', updateGridHeight);
        return () => window.removeEventListener('resize', updateGridHeight);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60 * 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={styles.weekView}>
            <WeekHeader weekDays={weekDays} />
            <WeekGrid
                onCreateBusiness={onCreateBusiness}
                onEditBusiness={onEditBusiness}
                ref={gridRef}
                weekDays={weekDays}
                hours={HOURS}
                timeSlots={TIME_SLOTS}
            />
        </div>
    );
});

export default WeekView;