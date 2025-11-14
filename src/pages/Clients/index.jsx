import React from 'react';
import styles from './clients.module.sass';
import ClientsTable from './components/ClientsTable';
import { observer } from 'mobx-react';
import { motion } from 'framer-motion';
import { opacityTransition } from '../../utils/motion.variants';

const Clients = observer(() => {
  return (
    <motion.div
      variants={opacityTransition}
      initial="hidden"
      animate="show"
      className={styles.container}
    >
      <ClientsTable />
    </motion.div>
  );
});

export default Clients;
