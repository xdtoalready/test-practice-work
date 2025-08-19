import { useEffect } from 'react';
import { useNotificationContext } from '../providers/NotificationProvider';
import notification from '../shared/Header/Notification';

export const useNotifications = () => {
  const { addNotification } = useNotificationContext();

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    if (window.Notification.permission !== 'granted' &&
      window.Notification.permission !== 'denied') {
      window.Notification.requestPermission().catch(console.error);
    }
  }, []);

  const showNotification = (title, options = {}) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    addNotification({
      id: options.id,
      title,
      message: options.origin,
      logo: options.icon
    });

    if (window.Notification.permission === 'granted') {
      new window.Notification(title, options);
    }
  };

  return {
    showNotification,
  };
};