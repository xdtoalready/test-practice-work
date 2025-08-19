import React from 'react';
import { motion } from 'framer-motion';
import styles from './calls.module.sass';
import { opacityTransition } from '../../utils/motion.variants';
import CallsTable from './components/CallsTable';

const Calls = () => {
  return (
    <motion.div
      variants={opacityTransition}
      initial="hidden"
      animate="show"
      className={styles.container}
    >
      <CallsTable />
    </motion.div>
  );
};

export default Calls;
