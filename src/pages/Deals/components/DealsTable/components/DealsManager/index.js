import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import DealsList from "./components/DealsList";
import DealDragPreview from "./components/Preview";


const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
);
const Backend = isMobile ? TouchBackend : HTML5Backend;

const DealsManager = ({ data, handleChange, onClick }) => {
    return (
        <DndProvider
            backend={Backend}
            options={
                isMobile
                    ? { enableMouseEvents: true, delayTouchStart: 0, delayMouseStart: 0 }
                    : undefined
            }
        >
            <DealsList data={data} onChange={handleChange} onClick={onClick} />
            {isMobile && <DealDragPreview values={data} />}
        </DndProvider>
    );
};

export default DealsManager;