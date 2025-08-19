import React, { useContext, useState } from 'react';
import { Navigate, withRouter } from 'react-router-dom';
import cn from 'classnames';
import styles from './Page.module.sass';
import Sidebar from '../Sidebar';
import Header from '../Header';
import '../../styles/app.sass';
import { Outlet, useLocation } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import 'simplebar-react/dist/simplebar.min.css';
import SimpleBar from "simplebar-react";
import { AuthContext } from '../../providers/AuthProvider';

const Page = ({ wide, children, title, titleAfter, stylesInner }) => {
  // const { authToken } = useContext(AuthContext);
  // const location = useLocation();



  const [visible, setVisible] = useState(false);

  // if (!authToken) {
  //   return <Navigate to="/login" state={{ from: location }} />;
  // }
  return (
    <>
      <div className={styles.page}>
        {/*<div className={cn(!visible && styles.disabled)}>*/}
        <Sidebar
          sideVisible={visible}
          sideSetVisible={setVisible}
          className={cn(styles.sidebar, {
            [styles.visible]: visible,
            [styles.disabled]: !visible,
          })}
          onClose={() => setVisible(false)}
        />
        {/*</div>*/}
        <Header onOpen={() => setVisible(true)} />
        <div style={stylesInner} className={styles.inner}>
          <div
            className={cn(styles.container, {
              [styles.wide]: wide,
            })}
          >
            {title && (
              <div className={cn('h4', styles.title)}>
                {title}
                {titleAfter}
              </div>
            )}

            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
