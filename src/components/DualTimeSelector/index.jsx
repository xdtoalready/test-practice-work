import React, { useCallback, useMemo, useState } from 'react';
import cn from "classnames";
import styles from '../../pages/Services/components/ServicesTable/components/EditModal/Modal.module.sass';
import Dropdown from "../../shared/Dropdown/Default";
import useUnits from "../../hooks/useUnits";
import {formatDuration, formatUnts} from "../../utils/format.string";
import TextInput from "../../shared/TextInput";

const Index =({onChange, timeValue, timeType}) => {
    const units = useUnits();
    const unitsRU = units.map((el, idx) => formatDuration(timeValue, el).split(' ')[1]);

    return (
        <div>
            <div className={cn(styles.dualTime, styles.flex)}>
                <TextInput
                    onChange={({ target }) =>onChange(target.name, target.value)}
                    name={'budgetTimeValue'}
                    value={timeValue}
                    edited={true}
                    className={styles.input}
                    noMinWidth={true}
                />

                <Dropdown
                    setValue={(e)=>onChange('budgetTimeType', formatUnts(e))}
                    value={formatDuration(timeValue, timeType).split(' ')[1]}
                    classNameContainer={styles.input}
                    options={unitsRU}
                    noMinWidth={true}
                />
            </div>
        </div>
    );
};

export default Index;
