import React, { useState } from 'react';
import styles from './Sidebar.module.sass';
import { Link, NavLink } from 'react-router-dom';
import cn from 'classnames';
import Icon from '../Icon';
import Theme from '../Theme';
import Dropdown from './Dropdown';
import Help from './Help';
import Image from '../Image';
import OutsideClickLayout from '../Layouts/outsideClickLayout';
import TextLink from '../Table/TextLink';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import ConfirmationModal from '../../components/ConfirmationModal';

const Sidebar = ({ className, onClose, sideVisible, sideSetVisible }) => {
  const [visibleHelp, setVisibleHelp] = useState(false);
  const [visible, setVisible] = [sideVisible, sideSetVisible];
  const { navigation, isLogoutModalOpen, setIsLogoutModalOpen, handleLogout } =
    useAppNavigation();

  const handleCLose = () => {
    setVisible(false);
    setVisibleHelp(false);
    onClose();
  };

  return (
    <>
      {/*// <OutsideClickLayout onClick={handleCLose} >*/}
      <div
        className={cn(styles.sidebar, className, { [styles.active]: visible })}
      >
        <button className={styles.close} onClick={handleCLose}>
          <Icon name="close" size="24" />
        </button>
        <div className={styles.menu}>
          {navigation.map((x, index) =>
            x.url ? (
              <NavLink
                  target={"_blank"}
                className={styles.item}
                activeClassName={styles.active}
                to={x.url}
                key={index}
                onClick={onClose}
              >
                {x?.icon}
                {x.title}
              </NavLink>
            ) : x?.button ? (
              <TextLink
                className={cn(styles.button, styles.item)}
                onClick={x.action}
              >
                <div className={styles.title}>{x.title}</div>
              </TextLink>
            ) : (
              <Dropdown
                className={styles.dropdown}
                visibleSidebar={visible}
                setValue={setVisible}
                key={index}
                item={x}
                onClose={onClose}
              />
            ),
          )}
        </div>
        <button className={styles.toggle}>
          <Icon
            onClick={() => setVisible(!visible)}
            name="arrow-right"
            size="24"
          />
          <Icon onClick={handleCLose} name="close" size="24" />
        </button>
        <div className={styles.foot}>
          <button className={styles.link} onClick={() => setVisibleHelp(true)}>
            {/*<Icon name="help" size="24" />*/}
            {/*Help & getting started*/}
            {/*<div className={styles.counter}>8</div>*/}
          </button>
          {/*<Theme className={styles.theme} visibleSidebar={visible} />*/}
        </div>
      </div>
      {/*<Help*/}
      {/*  visible={visibleHelp}*/}
      {/*  setVisible={setVisibleHelp}*/}
      {/*  onClose={onClose}*/}
      {/*/>*/}
      {/*<div*/}
      {/*  className={cn(styles.overlay, { [styles.active]: visible })}*/}
      {/*  onClick={() => setVisible(false)}*/}
      {/*></div>*/}
      {/*// </OutsideClickLayout>*/}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          handleLogout();
          setIsLogoutModalOpen(false);
        }}
        label="Вы уверены, что хотите выйти?"
      />
    </>
  );
};

export default Sidebar;
