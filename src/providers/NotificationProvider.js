import React, { createContext, useContext, useState, useCallback } from 'react';
import NotificationToast from '../shared/Notification/Toast';
import './NotificationProviderStyles.scss'

const NotificationContext = createContext();
export const REMOVE_DELAY = 500000;
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [visibleMenu,setVisibleMenu] = useState(false);

  const addNotification = useCallback((notification,setVisible=()=>null) => {
    const timestamp = Date.now();
    setNotifications(prev => [...prev, { ...notification, timestamp }]);

    // Автоматическое удаление через 5 секунд
    setTimeout(() => {
      removeNotification(timestamp);
    }, REMOVE_DELAY);
  }, []);

  const removeNotification = useCallback((id) => {
    setVisibleMenu(true)

    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification,visibleMenu,setVisibleMenu }}>
      {children}
      <div className="notification-toast-container">
        {notifications.map((notification) => (
          <NotificationToast
            delay={REMOVE_DELAY}
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};