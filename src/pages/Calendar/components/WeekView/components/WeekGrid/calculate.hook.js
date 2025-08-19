import React, {useCallback} from 'react';

const useCalculate = (layout) => {
    const calculateTimePosition = useCallback((time) => {
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const totalMinutes = (hours - 8) * 60 + minutes;
        return (totalMinutes / (16 * 60)) * 100; // 15 часов (с 9 до 23)
    },[]);
    const calculateEventHeight = useCallback((business) => {
        const startMinutes = business.startDate.getHours() * 60 + business.startDate.getMinutes();
        const endMinutes = business.endDate.getHours() * 60 + business.endDate.getMinutes();
        const duration = endMinutes - startMinutes;
        return (duration / (16 * 60)) * 100; // как процент от общей высоты сетки
    },[]);
    const calculateEventWidth = useCallback((business) => {
        const eventLayout = layout[business.id];
        if (!eventLayout) return '100%';
        // Вычисляем ширину в зависимости от количества событий в том же временном слоте
        const eventsInSlot = Object.values(layout).filter(l => l.column === eventLayout.column).length;
        return `${100 / eventsInSlot}%`;
    },[]);
    const calculateEventLeft = useCallback((business) => {
        const eventLayout = layout[business.id];
        if (!eventLayout) return '0%';
        return `${(eventLayout.column * 100)}%`;
    },[]);
    return {calculateEventHeight,calculateEventWidth,calculateTimePosition,calculateEventLeft};
};

export default useCalculate;