import React from 'react';
import styles from './Filter.module.sass';
import Radio from "../../../../shared/Radio";

const TaskFilter = ({ filters, selectedFilter, onChange, taskCounts }) => {
    return (
        <div>
            {filters.map(({ label, value }) => (
                <Radio
                    className={styles.container}
                    key={value}
                    name="taskFilter"
                    content={`${label}</span>`}
                    value={selectedFilter === value}
                    onChange={() => onChange(value)}
                />
            ))}
        </div>
    );
};

export default TaskFilter;
