// NotificationToast.js
import React, { useCallback, useEffect } from 'react';
import cn from 'classnames';
import styles from './NotificationToast.module.sass';
import DOMPurify from 'dompurify';
import { observer } from 'mobx-react';
import Item from '../Header/Notification/Item';
import useStore from '../../hooks/useStore';
import { useNavigate } from 'react-router-dom';

const NotificationToast = observer(({ notification, onClose,delay=5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, delay);

    return () => clearTimeout(timer);
  }, [onClose]);

  const { notificationsStore } = useStore();
  const navigate = useNavigate();

  const removeDescription = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const description = doc.querySelector('.notification-description');
    if (description) {
      description.remove();
    }

    return doc.body.innerHTML;
  };

  const toastItem = {
    ...notification,
    content: removeDescription(notification.message),
    time: '',
    new: false
  };

  const handleContainerClick = useCallback((e) => {
    // Ищем ближайшую ссылку (работает даже при клике на дочерние элементы внутри <a>)
    const link = e.target.closest('a');
    if (link) {
      e.preventDefault();
      const href = link.getAttribute('href');

      // Помечаем уведомление как прочитанное
      notificationsStore.markAsRead(toastItem.id);

      // Закрываем панель уведомлений
      onClose?.();

      // Обрабатываем переход
      if (href) {
        if (href.startsWith('/')) {
          // Внутренняя ссылка - используем React Router
          navigate(href);
        } else {
          // Внешняя ссылка - открываем в новой вкладке
          window.open(href, '_blank', 'noopener noreferrer');
        }
      }
    } else {
      // Клик вне ссылки - просто помечаем как прочитанное и закрываем
      debugger
      notificationsStore.markAsRead(notification.id);
      onClose?.();
    }
  }, [toastItem.id, notificationsStore, onClose, navigate]);

  return (
    <div onClick={handleContainerClick} className={cn(styles.toast)}>
      <Item
        item={toastItem}
        className={styles.toastItem}
        onClose={onClose}
      />
      <button className={styles.close} onClick={onClose}>×</button>
    </div>
  );
});

export default NotificationToast;