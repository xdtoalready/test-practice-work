import React from 'react';
import cn from "classnames";
import styles from "./Arrow.module.sass";
import Icon from "../../Icon";

const SortingArrow = ({isSortedDesc}) => {
    return (
        <span className={styles.margin}>
        <div className={styles.flex}>
            <Icon fill={'#6F767E'}
                  name={'sort-arrow'} viewBox={'0 0 8 17'} size={24}/>
            <div className={cn(styles.component, {[styles.active]: isSortedDesc})}>

                <span/>
                <span/>
                <span/>
            </div>
        </div>
            </span>

    );
};

export default SortingArrow;