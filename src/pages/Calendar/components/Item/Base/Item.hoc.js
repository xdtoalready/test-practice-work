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
          console.log(props, 'item');
          props?.onDrag && props?.onDrag(props.dayIndex);

          const dragItem = {
            id: Number(business.id),
            type: business.type,
            startDate: business.startDate,
            endDate: business.endDate,
            dayIndex: props.dayIndex,
            ...customDragProps,
          };

          return dragItem;
        },
        // canDrag: () => true,
        // end: (item, monitor) => {
        //   if (props.onDragEnd) {
        //     props.onDragEnd();
        //   }
        // },
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
      // if (dragRef.current) {
      drag(dragRef.current);
      // if (typeof externalRef === 'function') {
      //   externalRef(dragRef.current);
      // } else if (externalRef) {
      //   externalRef.current = dragRef.current;
      // }
      // }
      console.log(dragRef, externalRef, 'refs');
    }, [drag, externalRef]);
    console.log(isDragging, 'isDragging');
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
