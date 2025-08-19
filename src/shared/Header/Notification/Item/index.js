import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import styles from "./Item.module.sass";
import '../Item.sass'
import useStore from '../../../../hooks/useStore';
import DOMPurify from 'dompurify';
import { loadAvatar } from '../../../../utils/create.utils';
import Avatar from '../../../Avatar';
import { observer } from 'mobx-react';
import { formatNotificationDate } from '../../../../utils/formate.date';

const Item = observer(({ className, item, onClose }) => {
  const { notificationsStore } = useStore();
  const navigate = useNavigate();

  // Обработчик клика по контейнеру
  const handleContainerClick = useCallback((e) => {
    // Ищем ближайшую ссылку (работает даже при клике на дочерние элементы внутри <a>)
    const link = e.target.closest('a');

    if (link) {
      e.preventDefault();
      const href = link.getAttribute('href');

      // Помечаем уведомление как прочитанное
      notificationsStore.markAsRead(item.id);

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
      notificationsStore.markAsRead(item.id);
      onClose?.();
    }
  }, [item.id, notificationsStore, onClose, navigate]);

  // Санитизация HTML для предотвращения XSS-атак
  const cleanHTML = DOMPurify.sanitize(item.content, {
    ALLOWED_TAGS: ['div', 'p', 'span', 'a', 'b', 'strong', 'em', 'br'],
    ALLOWED_ATTR: ['class', 'href', 'style']
  });
  return (
    <div className={styles.notification}>
      <Avatar
        className={styles.avatar}
        imageSrc={item.logo}
        size={32}
      />
      <div className={styles.content}>
        <div
          className={cn(styles.item, className, {[styles.new]:item.new})}
          onClick={handleContainerClick}
          dangerouslySetInnerHTML={{ __html: cleanHTML }}
        />
        <div className={styles.time}>{item.time}</div>
      </div>

    </div>
  );
});

export default Item;