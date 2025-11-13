import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Title from '../../shared/Title';
import { observer } from 'mobx-react';
import useStore from '../../hooks/useStore';
import { LoadingProvider } from '../../providers/LoadingProvider';
import { calendarViewTypes, calendarViewTypesRu } from './calendar.types';
import MonthView from './components/MonthView';
import styles from './Calendar.module.sass';
import useCalendarApi from './calendar.api';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import Selector from './components/Selector';
import WeekView from './components/WeekView';
import useAppApi from '../../api';
import { FiltersProvider } from '../../providers/FilterProvider';
import { createCalendarFilters } from './calendar.filters';
import { useSearchParams } from 'react-router-dom';
import withBusinessModalHandler from '../../components/CalendarModal/HocHandler';

const CalendarContent = observer(({ onEditBusiness, onCreateBusiness }) => {
  const api = useCalendarApi();
  const { calendarStore } = useStore();
  const appApi = useAppApi();
  const currentView = calendarStore.currentView;
  const currentDate = calendarStore.currentDate;
  const [currentFilters, setCurrentFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  // Определяем диапазон дат в зависимости от текущего представления
  const getCurrentDateRange = () => {
    let startDate, endDate;

    if (currentView === calendarViewTypes.month) {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      );
    } else if (currentView === calendarViewTypes.week) {
      startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
      endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
    } else if (currentView === calendarViewTypes.day) {
      startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(currentDate);
      endDate.setHours(23, 59, 59, 999);
    }

    return { startDate, endDate };
  };

  // Загрузка данных с учетом текущего представления и фильтров
  const loadData = () => {
    const { startDate, endDate } = getCurrentDateRange();

    // Комбинируем диапазон дат с текущими фильтрами
    api.getBusinesses(
      startDate.toISOString(),
      endDate.toISOString(),
      currentFilters,
    );
  };

  useEffect(() => {
    loadData();
  }, [calendarStore.currentDate, currentView, currentFilters]);

  const handleViewChange = (view) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('view', view);
    setSearchParams(newSearchParams, { replace: true });
    calendarStore.setCurrentView(view);
  };

  const handleFilterChange = async (filters) => {
    setCurrentFilters(filters);
  };

  const handleDateUpdate = (newDate) => {
    calendarStore.setCurrentDate(newDate);
  };

  const handleOpenModalViaDayCell = (data) => {
    if (currentView === calendarViewTypes.month)
      onCreateBusiness({
        startDate: data,
        endDate: data,
      });
    else if (currentView === calendarViewTypes.week)
      onCreateBusiness({
        startDate: data.day,
        endDate: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
      });
  };

  const renderView = () => {
    switch (currentView) {
      case calendarViewTypes.month:
        return (
          <MonthView
            onCreateBusiness={handleOpenModalViaDayCell}
            onEditBusiness={onEditBusiness}
          />
        );
      case calendarViewTypes.week:
        return (
          <WeekView
            onCreateBusiness={handleOpenModalViaDayCell}
            onEditBusiness={onEditBusiness}
          />
        );
      default:
        return (
          <MonthView
            onCreateBusiness={onCreateBusiness}
            onEditBusiness={onEditBusiness}
          />
        );
    }
  };

  // Получаем текущий диапазон дат для инициализации фильтров
  const { startDate, endDate } = getCurrentDateRange();

  useEffect(() => {
    return () => {
      searchParams.delete('view');
    };
  }, []);

  return (
    <FiltersProvider>
      <LoadingProvider isLoading={api.isLoading}>
        <div className={styles.container}>
          <Title
            title="Календарь дел"
            actions={{
              add: {
                action: onCreateBusiness,
                title: 'Создать дело',
              },
              filter: {
                title: 'Фильтр',
                config: createCalendarFilters(appApi),
                onChange: handleFilterChange,
                initialValues: {
                  date_from: format(startDate, 'yyyy-MM-dd'),
                  date_to: format(endDate, 'yyyy-MM-dd'),
                },
              },
            }}
          />
          <div className={styles.header}>
            <div className={styles.viewSelector}>
              {Object.entries(calendarViewTypesRu).map(([type, label]) => (
                <button
                  key={type}
                  className={`${currentView === type ? styles.active : ''}`}
                  onClick={() => handleViewChange(type)}
                >
                  {label}
                </button>
              ))}
            </div>
            <Selector
              handleUpdate={handleDateUpdate}
              currentDate={currentDate}
              type={currentView}
            />
          </div>

          <div className={styles.calendar}>{renderView()}</div>
        </div>
      </LoadingProvider>
    </FiltersProvider>
  );
});

const Calendar = ({ onCreateBusiness, onEditBusiness }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <CalendarContent
        onCreateBusiness={onCreateBusiness}
        onEditBusiness={onEditBusiness}
      />
    </DndProvider>
  );
};
const CalendarWithHoc = withBusinessModalHandler(Calendar);

const CalendarWithQuery = () => {
  const api = useCalendarApi();
  const { calendarStore } = useStore();
  return <CalendarWithHoc calendarApi={api} calendarStore={calendarStore} />;
};

export default CalendarWithQuery;
