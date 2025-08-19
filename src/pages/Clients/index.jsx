import React, { useEffect } from 'react';
import styles from './clients.module.sass';
import ClientsTable from './components/ClientsTable';
import { observer } from 'mobx-react';
import useStore from '../../hooks/useStore';
import useClientsApi from './clients.api';
import { Outlet } from 'react-router';
import ClientActivities from './components/ClientPage/Deals';
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
