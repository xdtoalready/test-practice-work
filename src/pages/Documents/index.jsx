import React, {useEffect, useMemo, useRef} from 'react';
import {motion} from "framer-motion";
import {opacityTransition} from "../../utils/motion.variants";
import useTableSwitherKey from '../../hooks/useTableSwitherKey';
import BillsTable from './components/BillsTable';
import ActsTable from './components/ActsTable';

const DocumentsPage = () => {
  const currentSwitcher = useTableSwitherKey('filter','bill')
  return(
    <motion.div
      variants={opacityTransition}
      initial="hidden"
      animate="show" >

      {currentSwitcher === 'bill' ? <BillsTable currentSwitcher={currentSwitcher}/> : <ActsTable currentSwitcher={currentSwitcher}/> }
    </motion.div>
  );
};

export default DocumentsPage;