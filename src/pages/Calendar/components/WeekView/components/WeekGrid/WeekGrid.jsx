import React, { forwardRef, useState, useMemo } from 'react';
import styles from './Grid.module.sass';
import { observer } from 'mobx-react';
import { format, differenceInMinutes, addMinutes } from 'date-fns';
import cn from 'classnames';
import { useDrop } from 'react-dnd';
import WeekBusinessItem from '../../../Item/Week/WeekBusiness';
import useStore from '../../../../../../hooks/useStore';
import useCalendarApi from '../../../../calendar.api';

const WeekGrid = observer(
  forwardRef(
    (
      {
        onCreateBusiness,
        hours,
        weekDays,
        onEditBusiness,
        children,
        onOpenModal,
      },
      ref,
    ) => {
      const { calendarStore } = useStore();
      const calendarApi = useCalendarApi();
      const currentDate = calendarStore.currentDate;
      const businesses = calendarStore.getBusinesses();
      // const [hoveredDay, setHoveredDay] = useState(null);
      const [tempHover, setTempHover] = useState(null);
      const [hoveredBusinessId, setHoveredBusinessId] = useState(null);

      // Группируем события по дням и сортируем по времени начала
      const businessesByDay = useMemo(() => {
        const result = {};

        weekDays.forEach((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');

          // Фильтруем события для текущего дня
          const dayEvents = businesses.filter(
            (business) => format(business.startDate, 'yyyy-MM-dd') === dateKey,
          );

          // Сортируем по времени начала
          const sortedEvents = [...dayEvents].sort((a, b) => {
            // Сначала сортируем по часам
            const hourDiff = a.startDate.getHours() - b.startDate.getHours();
            if (hourDiff !== 0) return hourDiff;

            // Если часы совпадают, сортируем по минутам
            return a.startDate.getMinutes() - b.startDate.getMinutes();
          });

          result[dateKey] = sortedEvents;
        });

        return result;
      }, [businesses, weekDays]);

      // Группируем события, которые начинаются в одно и то же время
      const businessesGroupedByStartTime = useMemo(() => {
        const result = {};

        Object.entries(businessesByDay).forEach(([dateKey, events]) => {
          result[dateKey] = {};

          events.forEach((event) => {
            const startTimeKey = `${event.startDate.getHours()}:${event.startDate.getMinutes()}`;

            if (!result[dateKey][startTimeKey]) {
              result[dateKey][startTimeKey] = [];
            }

            result[dateKey][startTimeKey].push(event);
          });
        });

        return result;
      }, [businessesByDay]);

      // const handleDayHover = (dayIndex) => {
      //   setHoveredDay(dayIndex);
      // };

      const handleCreateBusiness = (date) => {
        const startDate = date;
        const tempDate = new Date();
        debugger;
        const startTime = format(
          new Date().setHours(tempDate.getHours() - 1, 0, 0, 0),
          'HH:mm',
        );
        const endTime = format(
          new Date().setHours(tempDate.getHours(), 0, 0, 0),
          'HH:mm',
        );

        onCreateBusiness({
          day: startDate,
          startTime,
          endTime,
        });
      };

      const DayColumn = ({ day, dayIndex, onDayClick }) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const dayEvents = businessesByDay[dateKey] || [];
        // const shouldShiftRight =
        //   hoveredDay === dayIndex || tempHover === dayIndex;

        const [{ isOver, canDrop }, drop] = useDrop(
          () => ({
            accept: 'week-business',
            drop: (item, monitor) => {
              // Проверка наличия id
              if (!item.id) {
                return;
              }

              // Получаем бизнес из хранилища
              const businessItem = calendarStore.getById(item.id);

              if (!businessItem) {
                return;
              }

              // Создаем новую дату, явно клонируя исходный день
              const newStartDate = new Date(day.getTime());

              // Устанавливаем часы и минуты
              const hours = businessItem.startDate.getHours();
              const minutes = businessItem.startDate.getMinutes();

              newStartDate.setHours(hours, minutes, 0, 0);

              const duration = differenceInMinutes(
                businessItem.endDate,
                businessItem.startDate,
              );
              const newEndDate = addMinutes(newStartDate, duration);

              try {
                calendarStore.createDraft(item.id);

                calendarStore.changeById(item.id, 'startDate', newStartDate);
                calendarStore.changeById(item.id, 'endDate', newEndDate);
                debugger;
                calendarApi
                  .updateBusiness(
                    item.id,
                    calendarStore.drafts[item.id],
                    calendarStore.changedProps,
                  )
                  .then(() => {
                    debugger;
                    const businesses = calendarStore.getBusinesses();
                    const updatedBusinesses = businesses.map((business) =>
                      business.id === item.id
                        ? {
                            ...business,
                            startDate: newStartDate,
                            endDate: newEndDate,
                          }
                        : business,
                    );
                    calendarStore.setBusinesses(updatedBusinesses);
                  })
                  .catch((err) =>
                    console.error('Error updating business:', err),
                  );

                return { moved: true, id: item.id, target: dayIndex };
              } catch (error) {}
            },
            hover: (item, monitor) => {},
            collect: (monitor) => ({
              isOver: monitor.isOver(),
              canDrop: monitor.canDrop(),
            }),
          }),
          [dayIndex, day, calendarStore, calendarApi],
        );

        return (
          <div
            onClick={onDayClick}
            key={dateKey}
            ref={drop}
            className={cn(styles.dayColumn, { [styles.dropTarget]: isOver })}
            style={{
              left: `calc((100%) * ${dayIndex} / ${weekDays.length})`,
              width: `calc((100%) / ${weekDays.length})`,
            }}
          >
            {/* Рендерим события по стартовому времени */}
            {Object.entries(businessesGroupedByStartTime[dateKey] || {}).map(
              ([startTimeKey, events]) => (
                <div key={startTimeKey} className={styles.timeGroup}>
                  {events.map((business, index) => (
                    <WeekBusinessItem
                      key={business.id}
                      dayIndex={dayIndex}
                      // shouldShiftRight={shouldShiftRight}
                      onModalOpen={onEditBusiness}
                      business={business}
                      allItems={dayEvents}
                      // onHoverStart={(index) => setTempHover(index)}
                      // onHoverEnd={() =>
                      //   tempHover !== hoveredDay && setTempHover(false)
                      // }
                      // onDrag={(index) => handleDayHover(index)}
                      // onDragEnd={() => handleDayHover(null)}
                      // style={{
                      //   // Стиль для элементов в одной группе
                      //   marginTop:
                      //     index === 0
                      //       ? // Рассчитываем отступ сверху для первого элемента группы
                      //         `calc(${(business.startDate.getHours() - 8) * 60 + business.startDate.getMinutes()}px * 0.75)`
                      //       : '4px', // Отступ между элементами в группе
                      // }}
                      customDragProps={{
                        id: business.id,
                        dayIndex,
                        hour: business.startDate.getHours(),
                        dayIso: dateKey,
                        endDate: business.endDate,
                        startDate: business.startDate,
                      }}
                    />
                  ))}
                </div>
              ),
            )}
          </div>
        );
      };

      return (
        <div ref={ref} className={styles.timeGrid}>
          <div className={styles.gridStructure}>
            {hours.map((hour, index) => {
              const isLastHour = index === hours.length - 1;
              return (
                <div
                  key={hour}
                  className={cn(styles.hourRow, {
                    [styles.lastRow]: isLastHour,
                  })}
                >
                  {weekDays.map((day, dayIndex) => (
                    <div
                      onClick={() => handleCreateBusiness(day, hour)}
                      data-day={format(day, 'yyyy-MM-dd')}
                      key={format(day, 'yyyy-MM-dd')}
                      className={styles.timeCell}
                    >
                      <div onClick={() => handleCreateBusiness(day, hour)} />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div className={styles.eventsContainer}>
            {weekDays.map((day, dayIndex) => (
              <DayColumn
                onDayClick={() => handleCreateBusiness(day)}
                key={format(day, 'yyyy-MM-dd')}
                day={day}
                dayIndex={dayIndex}
              />
            ))}
          </div>
          {children}
        </div>
      );
    },
  ),
);

export default WeekGrid;
