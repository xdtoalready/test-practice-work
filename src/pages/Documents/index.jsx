import React, {useEffect, useMemo, useRef} from 'react';
import {motion} from "framer-motion";
import {opacityTransition} from "../../utils/motion.variants";
import useTableSwitherKey from '../../hooks/useTableSwitherKey';
import BillsTable from './components/BillsTable';
import ActsTable from './components/ActsTable';
import ReportsTable from './components/ReportsTable';

const DocumentsPage = () => {
  const currentSwitcher = useTableSwitherKey('filter', 'bill');
  
  // Заменил тернарный оператор на switch для поддержки 3х вариантов
  const renderTable = () => {
    switch (currentSwitcher) {
      case 'bill':
        return <BillsTable currentSwitcher={currentSwitcher} />;
      case 'act':
        return <ActsTable currentSwitcher={currentSwitcher} />;
      case 'report':
        return <ReportsTable currentSwitcher={currentSwitcher} />;
      default:
        return <BillsTable currentSwitcher={currentSwitcher} />;
    }
  };

  return (
    <motion.div
      variants={opacityTransition}
      initial="hidden"
      animate="show"
    >
      {renderTable()}
    </motion.div>
  );
};

export default DocumentsPage;