import { useEffect, useState } from 'react';

const useFaviconNotification = (hasUnread) => {
  const [isTabActive, setIsTabActive] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) return;

    if (hasUnread && !isTabActive) {
      // Добавляем красную точку к favicon
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');

      const img = new Image();
      img.src = favicon.href;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 32, 32);

        // Рисуем красную точку
        ctx.fillStyle = '#FF6A55';
        ctx.beginPath();
        ctx.arc(24, 8, 8, 0, 2 * Math.PI);
        ctx.fill();

        favicon.href = canvas.toDataURL('image/png');
      };
    } else {
      favicon.href = '/favicon.png'; // Укажите путь к оригинальной иконке
    }
  }, [hasUnread, isTabActive]);
};

export default useFaviconNotification;