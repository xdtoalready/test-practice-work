import { useDragLayer } from 'react-dnd';
import DealCard from '../DealCard';
import styles from './Preview.module.sass';

const DealDragPreview = ({ values }) => {
    const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }));

    const draggedDeal = item && values.reduce((acc, column) => {
        return acc || column.values.find((deal) => deal.id === item.id);
    }, null);

    if (!isDragging || !item) {
        return null;
    }

    return (
        <div
            className={styles.preview}
            style={{
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: 100,
                left: 0,
                top: 0,
                transform: `translate(${currentOffset?.x}px, ${currentOffset?.y}px)`,
            }}
        >
            <DealCard deal={draggedDeal} />
        </div>
    );
};

export default DealDragPreview;