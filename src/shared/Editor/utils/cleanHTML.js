/**
 * Очищает HTML от лишнего экранирования и HTML entities
 *
 * Проблема: при сохранении/загрузке контента появляются экранированные кавычки:
 * - start="\&quot;1\&quot;" вместо start="1"
 * - href="\\\&quot;https://...\\\&quot;" вместо href="https://..."
 *
 * Решение: используем браузерный парсер для правильной обработки HTML
 */

/**
 * Декодирует HTML entities используя браузерный механизм
 * @param {string} text - Текст с HTML entities
 * @returns {string} - Декодированный текст
 */
function decodeHTMLEntities(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }

  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

/**
 * Очищает значение атрибута от экранирования
 * @param {string} value - Значение атрибута
 * @returns {string} - Очищенное значение
 */
function cleanAttributeValue(value) {
  if (!value) return value;

  let cleaned = value;

  // Убираем обратные слеши перед &quot;
  // \&quot; -> &quot;
  // \\&quot; -> &quot;
  // \\\&quot; -> &quot;
  cleaned = cleaned.replace(/\\+&quot;/g, '&quot;');

  // Убираем обратные слеши перед обычными кавычками
  // \" -> "
  cleaned = cleaned.replace(/\\+"/g, '"');

  // Декодируем HTML entities
  cleaned = decodeHTMLEntities(cleaned);

  // Убираем оставшиеся кавычки в начале и конце (если они есть)
  cleaned = cleaned.replace(/^["']+|["']+$/g, '');

  return cleaned;
}

/**
 * Очищает HTML используя DOMParser
 * @param {string} html - HTML строка
 * @returns {string} - Очищенная HTML строка
 */
export function sanitizeHTML(html) {
  if (!html || typeof html !== 'string') {
    return html;
  }

  console.log('[cleanHTML] Начинаем очистку HTML');

  // Сначала делаем предварительную очистку строки
  let cleaned = html;

  // Убираем множественные обратные слеши перед &quot;
  cleaned = cleaned.replace(/\\+&quot;/g, '&quot;');

  // Создаем временный div для парсинга HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = cleaned;

  // Проходим по всем элементам и очищаем атрибуты
  const allElements = tempDiv.querySelectorAll('*');

  allElements.forEach((element) => {
    // Очищаем атрибут start для списков (ol/ul)
    if (element.hasAttribute('start')) {
      const startValue = element.getAttribute('start');
      const cleanedStart = cleanAttributeValue(startValue);

      // Если значение не является числом, удаляем атрибут
      const numValue = parseInt(cleanedStart, 10);
      if (!isNaN(numValue)) {
        element.setAttribute('start', numValue.toString());
      } else {
        element.removeAttribute('start');
      }
    }

    // Очищаем атрибут href для ссылок
    if (element.hasAttribute('href')) {
      const hrefValue = element.getAttribute('href');
      const cleanedHref = cleanAttributeValue(hrefValue);
      element.setAttribute('href', cleanedHref);
    }

    // Очищаем атрибут src для изображений
    if (element.hasAttribute('src')) {
      const srcValue = element.getAttribute('src');
      const cleanedSrc = cleanAttributeValue(srcValue);
      element.setAttribute('src', cleanedSrc);
    }

    // Удаляем инлайн стили letter-spacing (это мусор от Word)
    if (element.hasAttribute('style')) {
      const style = element.getAttribute('style');
      if (style.includes('letter-spacing')) {
        // Убираем letter-spacing из стилей
        const cleanedStyle = style
          .split(';')
          .filter(s => !s.trim().startsWith('letter-spacing'))
          .join(';')
          .trim();

        if (cleanedStyle) {
          element.setAttribute('style', cleanedStyle);
        } else {
          element.removeAttribute('style');
        }
      }
    }
  });

  const result = tempDiv.innerHTML;
  console.log('[cleanHTML] Очистка завершена');

  return result;
}

/**
 * Для обратной совместимости
 */
export function cleanHTML(html) {
  return sanitizeHTML(html);
}

export function deepCleanHTML(html) {
  return sanitizeHTML(html);
}
