import React from 'react';
import styles from './HeightIndicator.module.sass';

/**
 * Компонент индикатора высоты контента для PDF
 * Показывает текущую высоту, количество страниц и прогресс-бар
 */
const HeightIndicator = ({ height = 0, pagesCount = 1, pageHeight = 1350 }) => {
  // Вычисляем процент заполнения текущей страницы
  const currentPageHeight = height % pageHeight || height;
  const percentage = Math.min((currentPageHeight / pageHeight) * 100, 100);

  // Определяем цвет индикатора
  let statusColor = '#52c41a'; // зеленый
  let statusText = 'Норма';

  if (percentage > 95 || pagesCount > 1) {
    statusColor = '#faad14'; // желтый
    statusText = 'Близко к переполнению';
  }

  if (pagesCount > 3) {
    statusColor = '#ff4d4f'; // красный
    statusText = 'Много страниц';
  }

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.stats}>
          <span className={styles.label}>Высота контента:</span>
          <span className={styles.value}>{height}px</span>
          <span className={styles.separator}>•</span>
          <span className={styles.pages} style={{ color: statusColor }}>
            ~{pagesCount} {pagesCount === 1 ? 'страница' : pagesCount < 5 ? 'страницы' : 'страниц'}
          </span>
        </div>
        <div className={styles.status} style={{ color: statusColor }}>
          {statusText}
        </div>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{
            width: `${percentage}%`,
            backgroundColor: statusColor,
          }}
        />
      </div>

      <div className={styles.hint}>
        💡 Совет: Используйте кнопку "Оптимизировать для PDF" в панели инструментов для автоматической разбивки контента на страницы
      </div>
    </div>
  );
};

export default HeightIndicator;
