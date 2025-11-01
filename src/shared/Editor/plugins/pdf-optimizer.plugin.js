/**
 * Плагин для оптимизации контента под PDF
 * - Измеряет высоту контента
 * - Автоматически разбивает на страницы
 * - Вставляет маркеры page-break
 */

import { Jodit } from 'jodit';

const PAGE_HEIGHT = 900; // px - высота страницы PDF (с запасом для футера)
const PAGE_WIDTH = 1920; // px - ширина страницы PDF
const CONTENT_PADDING = 50; // px - отступы контента

/**
 * Создает HTML маркера разрыва страницы
 */
export function createPageBreakHTML(pageNumber) {
  return `
    <div class="pdf-page-break" contenteditable="false" style="
      page-break-after: always;
      break-after: page;
      margin: 20px 0;
      padding: 10px;
      background: #e6f7ff;
      border: 2px dashed #1890ff;
      border-radius: 4px;
      text-align: center;
      color: #1890ff;
      font-size: 12px;
      font-weight: 600;
      cursor: default;
      user-select: none;
    ">
      📄 Разрыв страницы (Страница ${pageNumber})
    </div>
  `.trim();
}

/**
 * Удаляет все существующие маркеры разрыва страниц
 */
export function removeAllPageBreaks(editor) {
  const pageBreaks = editor.editor.querySelectorAll('.pdf-page-break');
  pageBreaks.forEach((el) => el.remove());
}

/**
 * Вычисляет высоту контента в редакторе
 */
export function calculateContentHeight(editor) {
  const editorElement = editor.editor;
  if (!editorElement) return 0;

  // Создаем временный контейнер для измерения
  const tempContainer = document.createElement('div');
  tempContainer.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    width: ${PAGE_WIDTH - CONTENT_PADDING * 2}px;
    visibility: hidden;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  `;

  // Копируем контент (без page-breaks)
  const contentClone = editorElement.cloneNode(true);
  const pageBreaks = contentClone.querySelectorAll('.pdf-page-break');
  pageBreaks.forEach((el) => el.remove());

  tempContainer.innerHTML = contentClone.innerHTML;
  document.body.appendChild(tempContainer);

  const height = tempContainer.offsetHeight;
  document.body.removeChild(tempContainer);

  return height;
}

/**
 * Оптимизирует контент для PDF - автоматически расставляет разрывы страниц
 * ВАЖНО: Работает только с top-level элементами чтобы не ломать структуру списков
 */
export function optimizeForPDF(editor) {
  console.log('[PDF Optimizer] Начало оптимизации');

  // Удаляем старые разрывы
  removeAllPageBreaks(editor);

  const editorElement = editor.editor;
  if (!editorElement) {
    console.error('[PDF Optimizer] editorElement не найден');
    return 1;
  }

  // Получаем ТОЛЬКО top-level элементы (не трогаем вложенные!)
  const elements = Array.from(editorElement.children).filter(
    el => !el.classList.contains('pdf-page-break')
  );

  console.log('[PDF Optimizer] Найдено top-level элементов:', elements.length);
  console.log('[PDF Optimizer] Типы элементов:', elements.map(el => el.tagName).join(', '));

  if (elements.length === 0) {
    console.error('[PDF Optimizer] Нет элементов для обработки');
    return 1;
  }

  // Создаем измерительный контейнер с правильными стилями
  const measureContainer = document.createElement('div');
  measureContainer.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    width: ${PAGE_WIDTH - CONTENT_PADDING * 2}px;
    visibility: hidden;
  `;

  // Копируем стили из редактора
  const editorStyles = window.getComputedStyle(editorElement);
  measureContainer.style.fontFamily = editorStyles.fontFamily;
  measureContainer.style.fontSize = editorStyles.fontSize;
  measureContainer.style.lineHeight = editorStyles.lineHeight;

  document.body.appendChild(measureContainer);

  const fragments = [];
  let currentFragment = [];
  let currentHeight = 0;
  let pageNumber = 1;
  const pageLimit = PAGE_HEIGHT - CONTENT_PADDING * 2;

  console.log('[PDF Optimizer] Лимит высоты страницы:', pageLimit, 'px');

  elements.forEach((el, index) => {
    // Измеряем ПОЛНУЮ высоту элемента (включая вложенные элементы)
    const clone = el.cloneNode(true);
    measureContainer.innerHTML = '';
    measureContainer.appendChild(clone);
    const elHeight = measureContainer.offsetHeight;

    console.log(`[PDF Optimizer] Элемент #${index} (${el.tagName}): ${elHeight}px, текущая высота: ${currentHeight}px`);

    // Проверяем, влезет ли элемент на текущую страницу
    if (currentHeight + elHeight > pageLimit && currentFragment.length > 0) {
      // Не влезает - создаем новую страницу
      console.log(`[PDF Optimizer] Элемент не влез, создаю страницу #${pageNumber}`);

      fragments.push({
        elements: [...currentFragment],
        pageNumber: pageNumber++,
      });

      currentFragment = [el];
      currentHeight = elHeight;
    } else {
      // Влезает - добавляем в текущий фрагмент
      currentFragment.push(el);
      currentHeight += elHeight;
    }
  });

  // Добавляем последний фрагмент
  if (currentFragment.length > 0) {
    fragments.push({
      elements: currentFragment,
      pageNumber: pageNumber,
    });
    console.log(`[PDF Optimizer] Добавлена последняя страница #${pageNumber}`);
  }

  // Очищаем измерительный контейнер
  document.body.removeChild(measureContainer);

  console.log('[PDF Optimizer] Всего фрагментов (страниц):', fragments.length);

  // Вставляем разрывы между фрагментами
  if (fragments.length > 1) {
    console.log('[PDF Optimizer] Вставляю разрывы страниц');

    // ВАЖНО: Не очищаем innerHTML, а вставляем разрывы между существующими элементами
    // Это сохраняет структуру и ссылки на DOM элементы

    // Идем с конца чтобы не сбивать индексы при вставке
    for (let i = fragments.length - 1; i > 0; i--) {
      const fragment = fragments[i];
      const firstElementOfFragment = fragment.elements[0];

      // Создаем маркер разрыва
      const pageBreakEl = document.createElement('div');
      pageBreakEl.innerHTML = createPageBreakHTML(fragment.pageNumber);
      const pageBreak = pageBreakEl.firstElementChild;

      // Вставляем ПЕРЕД первым элементом фрагмента
      editorElement.insertBefore(pageBreak, firstElementOfFragment);

      console.log(`[PDF Optimizer] Вставлен разрыв перед страницей #${fragment.pageNumber}`);
    }

    // Синхронизируем значение
    editor.synchronizeValues();

    console.log('[PDF Optimizer] Оптимизация завершена, страниц:', fragments.length);
    return fragments.length;
  }

  console.log('[PDF Optimizer] Разбивка не требуется (всё влезло на 1 страницу)');
  return 1;
}

/**
 * Добавляет кнопку "Оптимизировать для PDF" в toolbar
 */
export default function addPdfOptimizerPlugin(editor, onHeightChange) {
  // Регистрируем команду для кнопки (должно быть ДО инициализации)
  // Эта функция вызывается после afterInit, поэтому кнопка уже должна быть зарегистрирована

  // Слушаем изменения контента для обновления высоты
  editor.events.on('change', () => {
    if (onHeightChange) {
      updateHeight(editor, onHeightChange);
    }
  });

  // Инициализируем высоту при загрузке
  setTimeout(() => {
    if (onHeightChange) {
      updateHeight(editor, onHeightChange);
    }
  }, 300);
}

/**
 * Регистрирует кнопку в Jodit (нужно вызвать ДО создания редактора)
 */
export function registerPdfOptimizeButton() {
  if (!Jodit || !Jodit.defaultOptions) return;

  Jodit.defaultOptions.controls.pdfOptimize = {
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tooltip: 'Оптимизировать для PDF (авто-разбивка на страницы)',
    exec: function (editor) {
      try {
        const pagesCount = optimizeForPDF(editor);

        // Используем встроенный диалог Jodit
        editor.message.success(`Контент разбит на ${pagesCount} страниц(ы)`, 3000);

        // Триггерим событие change для обновления индикатора
        editor.events.fire('change', editor.value);
      } catch (error) {
        console.error('Ошибка при оптимизации PDF:', error);
        editor.message.error('Ошибка при оптимизации контента', 3000);
      }
    }
  };
}

/**
 * Обновляет информацию о высоте контента
 */
function updateHeight(editor, callback) {
  const height = calculateContentHeight(editor);
  const pagesCount = Math.ceil(height / (PAGE_HEIGHT - CONTENT_PADDING * 2));

  callback({
    height,
    pagesCount,
    pageHeight: PAGE_HEIGHT,
  });
}
