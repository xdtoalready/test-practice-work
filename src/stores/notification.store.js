import { makeAutoObservable } from 'mobx';
import { handleHttpResponse, http } from '../shared/http';
import { handleError } from '../utils/snackbar';
import { formatNotificationDate } from '../utils/formate.date';
import { loadAvatar } from '../utils/create.utils';

class NotificationsStore {
  notifications = [];
  userId = null;
  showOnlyUnread=null

  constructor() {
    makeAutoObservable(this);
    this.loadInitialNotifications();
    this.showOnlyUnread = false;
  }

  async loadInitialNotifications() {
    const response = await http.get('/api/notifications').then(handleHttpResponse).catch(handleError)
    if (!response?.body) return

    this.notifications = response.body.notifications.map(notification => this.formatNotification(notification));
  }



  formatNotification(notification) {
    return {
      id: notification.id,
      title: notification.title,
      content: notification.message,
      time: notification.time ? formatNotificationDate(new Date(notification.time.replace(' ', 'T'))): notification.created_at ? formatNotificationDate(notification.created_at) : '',
      new: !Boolean(notification?.is_read),
      logo: loadAvatar(notification?.logo ? `/${notification.logo}` : null),
      // url: notification.url || '#',
      // avatar: notification.avatar || '/images/content/avatar-1.jpg',
      // icon: '/images/content/notification-bell.svg',
      // color: '#FF6A55',
    };
  }

  addNotification(notification) {
    this.notifications.unshift(this.formatNotification(notification));
  }

  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.new = false;
      const response = http.get(`/api/notifications/${id}/read`).then(handleHttpResponse).catch(handleError)
      if (response.status==='success') {
        const tempNotifications = this.notifications.filter(n => n.id !== id);
        this.notifications = [...tempNotifications,notification]
      }
    }
  }

  markAllAsRead() {
    const unreadNotifications = this.notifications.filter(n => n.new);
    if (unreadNotifications.length > 0) {
      http.get('/api/notifications/read_all')
        .then(handleHttpResponse)
        .then(() => {
          this.notifications = this.notifications.map(n => ({ ...n, new: false }));
        })
        .catch(handleError);
    }
  }


  setShowOnlyUnread(value) {
    this.showOnlyUnread = value;

  }


  get unreadCount() {
    return this.notifications.filter(n => n.new).length;
  }

  getNotifications() {
    return this.showOnlyUnread
      ? this.notifications.filter(n => n.new)
      : this.notifications;
  }
}

export default NotificationsStore;