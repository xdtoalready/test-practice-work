import React, { useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { businessTypeStyles } from '../../../calendar.types';

const withBusinessItem = (WrappedComponent, dragType = 'business') => {
  return React.forwardRef(function BusinessItemWithDrag(
    { business, showTime = false, customDragProps = {}, ...props },
    externalRef,
  ) {
    const dragRef = useRef(null);
    const [{ isDragging }, drag] = useDrag(
      () => ({
        type: dragType,
        item: () => {
          props?.onDrag && props?.onDrag(props.dayIndex);

          return {
            id: Number(business.id),
            type: business.type,
            startDate: business.startDate,
            endDate: business.endDate,
            dayIndex: props.dayIndex,
            ...customDragProps,
          };
        },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
      }),
      [
        business,
        props.dayIndex,
        customDragProps,
        props.onDrag,
        props.onDragEnd,
      ],
    );

    // Объединяем refs
    useEffect(() => {
      drag(dragRef.current);
    }, [drag, externalRef]);
    return (
      <WrappedComponent
        ref={dragRef}
        business={business}
        isDragging={isDragging}
        showTime={showTime}
        businessTypeStyles={businessTypeStyles}
        {...props}
      />
    );
  });
};

export default withBusinessItem;
