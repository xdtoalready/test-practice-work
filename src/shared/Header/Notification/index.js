import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import cn from 'classnames';
import styles from './Notification.module.sass';
import Icon from '../../Icon';
import Actions from '../../Actions';
import Item from './Item';
import useStore from '../../../hooks/useStore';
import { observer } from 'mobx-react';
import Button from '../../Button';
import useOutsideClick from '../../../hooks/useOutsideClick';
import echo from '../../../echo';
import useUser from '../../../hooks/useUser';
import notificationSound from './notification.mp3';
import useFaviconNotification from '../../../hooks/useFaviconNotification';
import { useNotifications } from '../../../hooks/useNotifications';
import Chip from '../../Chip';
import { loadAvatar } from '../../../utils/create.utils';
import { useNotificationContext } from '../../../providers/NotificationProvider';

const actions = [
  {
    title: 'Mark as read',
    icon: 'check',
    action: () => console.log('Mark as read'),
  },
  {
    title: 'Delete notifications',
    icon: 'trash',
    action: () => console.log('Delete notifications'),
  },
];

const Notification = observer(({ className }) => {
  const {visibleMenu:visible,setVisibleMenu:setVisible} = useNotificationContext()
  const ref = useRef(null);
  const {user} = useUser()
  const { notificationsStore } = useStore();
  useOutsideClick(ref, () => setVisible(false));
  useFaviconNotification(notificationsStore.unreadCount > 0);
  const { showNotification } = useNotifications();


  useLayoutEffect(() => {
    const userId = user?.user_id;

    if (!userId) return;

    const playSound = () => {
      const audio = new Audio(notificationSound);
      audio.play().catch(e => console.log('Audio play failed:', e));
    };

    const channel = echo.channel(`Public.User.${userId}`)
      .listen('EventNotification', (data) => {
        console.log('Новое уведомление:', data.message);
        notificationsStore.addNotification({...data, is_read: false});
        playSound();
        showNotification('Получено уведомление ✉️',{
          body: data.message.replace(/<[^>]+>/g, ''),
          origin:data.message,
          id:data.id,
          icon: loadAvatar(data.logo)})
      });

    return () => {
      channel.stopListening('.notification');
    };
  }, [user]);
  return (
    <>
      <div
        ref={ref}
        className={cn(styles.notification, className, {
          [styles.active]: visible,
        })}
      >
        <button
          className={cn(styles.head, {[styles.active]:notificationsStore.unreadCount>0})}
          onClick={() => setVisible(!visible)}
        >
          <Icon name="notification" size="24" />
          {Boolean(notificationsStore.unreadCount>0) && <span
            className={cn(styles.notificationLength)}
          >{notificationsStore.notifications.filter(el=>el.new).length}</span>}
        </button>
        <div className={styles.body}>
          <div className={styles.top}>
            <div className={styles.title}>Уведомления</div>
            <div className={styles.filters}>
              <div className={styles.chips}>
                <Chip
                  active={!notificationsStore.showOnlyUnread}
                  onClick={() => notificationsStore.setShowOnlyUnread(false)}
                >
                  Все
                </Chip>
                <Chip
                  active={notificationsStore.showOnlyUnread}
                  onClick={() => notificationsStore.setShowOnlyUnread(true)}
                >
                  Непрочитанные
                </Chip>
              </div>
              <button
                className={styles.markAll}
                onClick={() => notificationsStore.markAllAsRead()}
                disabled={notificationsStore.unreadCount === 0}
              >
                Прочитать все
              </button>
            </div>
          </div>
          <NotificationList className={className} />
          {/*<Button*/}
          {/*  classname={cn('button', styles.button)}*/}
          {/*  to="/notification"*/}
          {/*  onClick={() => setVisible(false)}*/}
          {/*  name={'Посмотреть уведомления'}*/}
          {/*/>*/}
        </div>
      </div>
    </>
  );
});

export const NotificationList = observer(({ className }) => {
  const { notificationsStore } = useStore();
  const notifications = notificationsStore.getNotifications();
  const [visible, setVisible] = useState(false);


  return (
    <div className={styles.list}>
      {notifications?.map((x, index) => (
        <Item
          className={cn(styles.item, className)}
          item={x}
          key={index}
          onClose={() => setVisible(false)}
        />
      ))}
    </div>
  );
});

export default Notification;
