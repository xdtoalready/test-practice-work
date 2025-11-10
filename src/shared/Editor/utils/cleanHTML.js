/**
 * Очищает HTML от лишнего экранирования
 *
 * Проблема: при сохранении/загрузке контента могут появляться множественные экранирования:
 * - \\\&quot; вместо "
 * - \&quot; вместо "
 * - start="\&quot;1\&quot;" вместо start="1"
 *
 * Эта функция рекурсивно очищает все такие экранирования
 */

/**
 * Декодирует HTML entities и убирает лишнее экранирование
 * @param {string} html - HTML строка с возможным экранированием
 * @returns {string} - Очищенная HTML строка
 */
export function cleanHTML(html) {
  if (!html || typeof html !== 'string') {
    return html;
  }

  let cleaned = html;

  // Убираем множественное экранирование обратных слешей перед &quot;
  // \\\&quot; -> &quot;
  // \\&quot; -> &quot;
  // \&quot; -> &quot;
  cleaned = cleaned.replace(/\\+&quot;/g, '&quot;');

  // Убираем обратные слеши перед кавычками
  // \" -> "
  cleaned = cleaned.replace(/\\"/g, '"');

  // Декодируем HTML entities
  // &quot; -> "
  // &amp; -> &
  // &lt; -> <
  // &gt; -> >
  cleaned = cleaned.replace(/&quot;/g, '"');
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  cleaned = cleaned.replace(/&nbsp;/g, ' ');

  // Очищаем атрибуты с экранированными значениями
  // Например: start="\&quot;1\&quot;" -> start="1"
  // href="\&quot;http://...\&quot;" -> href="http://..."
  cleaned = cleaned.replace(/(\w+)=["']\\*&quot;(.+?)\\*&quot;["']/g, '$1="$2"');

  // Убираем экранированные кавычки в атрибутах
  // start="\"1\"" -> start="1"
  cleaned = cleaned.replace(/(\w+)=["']\\"(.+?)\\"["']/g, '$1="$2"');

  return cleaned;
}

/**
 * Рекурсивно очищает HTML до тех пор, пока не останется экранирования
 * @param {string} html - HTML строка
 * @param {number} maxIterations - Максимальное количество итераций (защита от бесконечного цикла)
 * @returns {string} - Полностью очищенная HTML строка
 */
export function deepCleanHTML(html, maxIterations = 10) {
  if (!html || typeof html !== 'string') {
    return html;
  }

  let cleaned = html;
  let previousCleaned = '';
  let iterations = 0;

  // Повторяем очистку пока есть изменения
  while (cleaned !== previousCleaned && iterations < maxIterations) {
    previousCleaned = cleaned;
    cleaned = cleanHTML(cleaned);
    iterations++;
  }

  console.log(`[cleanHTML] Очищено за ${iterations} итераций`);

  return cleaned;
}

/**
 * Очищает HTML и исправляет распространенные проблемы
 * @param {string} html - HTML строка
 * @returns {string} - Очищенная и исправленная HTML строка
 */
export function sanitizeHTML(html) {
  if (!html || typeof html !== 'string') {
    return html;
  }

  let sanitized = deepCleanHTML(html);

  // Исправляем атрибуты списков с неправильными значениями
  // <ol start="1"> вместо <ol start="\&quot;1\&quot;">
  sanitized = sanitized.replace(/<(ol|ul)([^>]*)start=["']([^"']+)["']/gi, (match, tag, attrs, value) => {
    // Убираем все экранирования из значения start
    const cleanValue = value.replace(/["'\\]/g, '');
    return `<${tag}${attrs}start="${cleanValue}"`;
  });

  // Исправляем URL в атрибутах href и src
  // Убираем лишние кавычки и экранирование
  sanitized = sanitized.replace(/(href|src)=["']([^"']+)["']/gi, (match, attr, url) => {
    // Убираем экранированные кавычки из URL
    const cleanUrl = url.replace(/["'\\]/g, '');
    return `${attr}="${cleanUrl}"`;
  });

  return sanitized;
}
