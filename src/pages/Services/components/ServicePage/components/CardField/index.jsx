import React from 'react';
import styles from './Field.module.sass'
import cn from "classnames";
const Index = ({label,children,cls,labelCls}) => {
    return (
        <div className={cn(styles.container, cls)}>
            <div className={styles.test}>
                <div className={cn(styles.label,labelCls)}>{label}</div>
                {children}
            </div>
        </div>
    );
};

export default Index;