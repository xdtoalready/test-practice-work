import { useDragLayer } from 'react-dnd';
import Task from '../Task';
import { useDropTarget } from 'react-dnd/lib/hooks/useDrop/useDropTarget';
import styles from './Preview.module.sass'
const DragPreview = ({ values }) => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));
  const draggedTask =
    item &&
    values.reduce((acc, column) => {
      return acc || column.values.find((task) => task.id === item.id);
    }, null);
  console.log(
    item,
    'item',
    values,
    values.find((el) => el.values.find((task) => task.id === item?.id)),
    draggedTask,
  );

  return isDragging
    ? item && (
        <div
          className={styles.preview}
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            left: 0,
            transform: `translate(${currentOffset?.x}px, ${currentOffset?.y}px)`,
            top: 0,
          }}
        >
          <Task task={draggedTask} />
        </div>
      )
    : null;
};

export default DragPreview;
