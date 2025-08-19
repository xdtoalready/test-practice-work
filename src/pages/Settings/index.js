import React, {useEffect, useMemo, useRef} from 'react';
import {motion} from "framer-motion";
import {opacityTransition} from "../../utils/motion.variants";
import styles from "./settings.module.sass";
import {useLocation} from "react-router";
import EmployesTable from "./components/EmployesTable";
import LegalsTable from "./components/LegalsTable";
import useTableSwitherKey from '../../hooks/useTableSwitherKey';

const SettingsPage = () => {
    const currentSwitcher = useTableSwitherKey('filter','employers')
    return(
        <motion.div
            variants={opacityTransition}
            initial="hidden"
            animate="show" className={styles.container}>

            {currentSwitcher === 'employers' ? <EmployesTable currentSwitcher={currentSwitcher}/> : <LegalsTable currentSwitcher={currentSwitcher}/> }
        </motion.div>
    );
};

export default SettingsPage;