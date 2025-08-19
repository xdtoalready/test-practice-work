import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { formatDateWithDateAndYear } from '../utils/formate.date';

const UseGroupByDate = (sourceArr, filterFunc = () => true) => {
  const isRendered = useRef(false); // Отслеживание первичной загрузки
  const [isLoading, setIsLoading] = useState(true); // Маркер загрузки массива

  const sortedAndFiltered = useMemo(() => {
    return (
      Object.entries(sourceArr)
        // Преобразуем строковые даты в объекты Date для корректной сортировки
        .map(([id, value]) => ({
          id,
          ...value,
          date: value.date,
        }))
        // Сортируем по убыванию (новые сверху)
        .sort((a, b) => a.date - b.date)
        // Фильтруем комментарии согласно условиям
        .filter(filterFunc)
    );
  }, [sourceArr, filterFunc]);

  const groupedByDate = useMemo(() => {
    const groups = {};

    sortedAndFiltered.forEach((item) => {
      const dateKey = formatDateWithDateAndYear(item.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });

    return groups;
  }, [sortedAndFiltered]);

  useLayoutEffect(() => {
    setTimeout(() => {
      if (!isRendered.current) {
        isRendered.current = true;
        setIsLoading(false);
      }
    }, 0);
  }, [sourceArr]);

  return { groupedByDate, isLoading };
};

export default UseGroupByDate;
