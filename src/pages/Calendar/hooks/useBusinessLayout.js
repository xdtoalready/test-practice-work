import {useMemo} from "react";
import {
    areIntervalsOverlapping,
    differenceInHours,
    differenceInMinutes,
    format,
    isSameDay,
    isWithinInterval
} from "date-fns";

export const useBusinessLayout = (businesses, view, date = null) => {
    return useMemo(() => {
        if (!businesses) return {};
        const layout = {};
        let eventsToProcess = [...businesses];

        // Логика для day view остается прежней
        if (view === 'day' && date) {
            eventsToProcess = businesses.filter(business =>
                isSameDay(business.startDate, date)
            );
        }

        const eventsByDay = eventsToProcess.reduce((acc, business) => {
            const dateKey = format(business.startDate, 'yyyy-MM-dd');
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(business);
            return acc;
        }, {});


        const hasCloseStart = (event1, event2) => {
            const diff = Math.abs(differenceInMinutes(event1.startDate, event2.startDate));
            return diff <= 30;
        };

        const getOverlapType = (event, otherEvents) => {
            for (const other of otherEvents) {
                if (other.id === event.id) continue;

                const isOverlapping = areIntervalsOverlapping(
                    { start: event.startDate, end: event.endDate },
                    { start: other.startDate, end: other.endDate }
                );

                if (!isOverlapping) continue;

                // Проверяем тип наложения
                if (hasCloseStart(event, other)) {
                    return 'parallel'; // Параллельные события
                }

                if (isWithinInterval(event.startDate, { start: other.startDate, end: other.endDate }) &&
                    isWithinInterval(event.endDate, { start: other.startDate, end: other.endDate })) {
                    return 'inside'; // Событие внутри другого
                }

                if (differenceInMinutes(event.startDate, other.endDate) < 0 &&
                    differenceInMinutes(event.startDate, other.startDate) > 0) {
                    return 'overlapTop'; // Наложение сверху
                }

                if (differenceInMinutes(event.endDate, other.startDate) > 0 &&
                    differenceInMinutes(event.endDate, other.endDate) < 0) {
                    return 'overlapBottom'; // Наложение снизу
                }
            }

            return 'noOverlap'; // Без наложения
        };

        Object.entries(eventsByDay).forEach(([dateKey, dayEvents]) => {
            // Сортируем события по времени начала и длительности для недельного вида
            const sortedEvents = [...dayEvents].sort((a, b) => {
                if (view === 'week') {
                    const startDiff = differenceInMinutes(a.startDate, b.startDate);
                    if (startDiff === 0) {
                        return differenceInMinutes(b.endDate, b.startDate) - differenceInMinutes(a.endDate, a.startDate);
                    }
                    return startDiff;
                }
                return differenceInMinutes(a.startDate, b.startDate);
            });

            const columnsInUse = new Map();

            sortedEvents.forEach(event => {
                const startHour = event.startDate.getHours();
                const duration = differenceInHours(event.endDate, event.startDate);
                const isAllDay = false

                if (isAllDay) {
                    layout[event.id] = {
                        isAllDay: true,
                        column: 0,
                        columnSpan: 1,
                        dateKey,
                        zIndex: 0
                    };
                    return;
                }

                const eventInterval = {
                    start: event.startDate,
                    end: event.endDate
                };

                const overlappingEvents = sortedEvents.filter(otherEvent =>
                    otherEvent.id !== event.id &&
                    !otherEvent.isAllDay &&
                    areIntervalsOverlapping(
                        eventInterval,
                        { start: otherEvent.startDate, end: otherEvent.endDate }
                    )
                );

                if (view === 'week') {
                    // Определяем тип наложения для недельного вида
                    const hasOverlappingBefore = overlappingEvents.some(overlap =>
                        differenceInMinutes(overlap.startDate, event.startDate) < 0
                    );
                    const hasOverlappingAfter = overlappingEvents.some(overlap =>
                        differenceInMinutes(event.endDate, overlap.endDate) < 0
                    );

                    let column = 0;
                    let found = false;

                    while (!found) {
                        const timeKey = `${dateKey}-${column}`;
                        const columnEvents = columnsInUse.get(timeKey) || [];

                        const isColumnFree = !columnEvents.some(existingEvent =>
                            areIntervalsOverlapping(
                                eventInterval,
                                { start: existingEvent.startDate, end: existingEvent.endDate }
                            )
                        );

                        if (isColumnFree) {
                            found = true;
                            if (!columnsInUse.has(timeKey)) {
                                columnsInUse.set(timeKey, []);
                            }
                            columnsInUse.get(timeKey).push(event);
                        } else {
                            column++;
                        }
                    }

                    const maxColumn = Math.max(
                        column,
                        ...overlappingEvents.map(e => (layout[e.id]?.column || 0))
                    );

                    layout[event.id] = {
                        column,
                        columnCount: maxColumn + 1,
                        overlappingEvents: overlappingEvents.length,
                        duration: differenceInMinutes(event.endDate, event.startDate),
                        dateKey,
                        isAllDay: false,
                        zIndex: column + 1,
                        hasOverlappingBefore,
                        hasOverlappingAfter,
                        // Добавляем смещение для визуального отображения наложений
                        offset: hasOverlappingBefore ? 8 : 0
                    };
                } else {
                    // Оригинальная логика для других видов
                    let column = 0;
                    let found = false;

                    while (!found) {
                        const timeKey = `${dateKey}-${column}`;
                        const columnEvents = columnsInUse.get(timeKey) || [];

                        const isColumnFree = !columnEvents.some(existingEvent =>
                            areIntervalsOverlapping(
                                eventInterval,
                                { start: existingEvent.startDate, end: existingEvent.endDate }
                            )
                        );

                        if (isColumnFree) {
                            found = true;
                            if (!columnsInUse.has(timeKey)) {
                                columnsInUse.set(timeKey, []);
                            }
                            columnsInUse.get(timeKey).push(event);
                        } else {
                            column++;
                        }
                    }

                    const maxColumn = Math.max(
                        column,
                        ...overlappingEvents.map(e => (layout[e.id]?.column || 0))
                    );

                    layout[event.id] = {
                        column,
                        columnCount: maxColumn + 1,
                        overlappingEvents: overlappingEvents.length,
                        duration: differenceInMinutes(event.endDate, event.startDate),
                        dateKey,
                        isAllDay: false,
                        zIndex: column + 1
                    };
                }
            });
        });

        return layout;
    }, [businesses, view, date]);
};
