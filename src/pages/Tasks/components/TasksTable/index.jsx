import React from 'react';
import TasksManager from "../../../../shared/Tasks";
import useTasksByStatus from "../../hooks/useTasksByStatus";
import useStore from "../../../../hooks/useStore";
import {observer, Observer} from "mobx-react";

const Index = observer(({data, handleChange,counts,onClick}) => {


    return <TasksManager counts={counts} onClick={onClick} data={data} handleChange={handleChange}/>
});

export default Index;