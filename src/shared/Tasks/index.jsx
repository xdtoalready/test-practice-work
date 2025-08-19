import React, { useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import TaskList from './List';
import { useDndScrolling } from 'react-dnd-scrolling';
import DragPreview from './Preview';
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
const Backend = isMobile ? TouchBackend : HTML5Backend;

const TasksManager = ({ data, handleChange, counts,onClick }) => {
  return (
    <DndProvider
      backend={Backend}
      options={
        isMobile
          ? { enableMouseEvents: true, delayTouchStart: 0, delayMouseStart: 0 }
          : undefined
      }
    >
      <TaskList data={{ data, counts }} onClick={onClick} onChange={handleChange} />
      {isMobile && <DragPreview values={data} />}
    </DndProvider>
  );
};
export default TasksManager;
