/**
 * Плагин для оптимизации контента под PDF
 * - Измеряет высоту контента
 * - Автоматически разбивает на страницы
 * - Вставляет маркеры page-break
 */

const PAGE_HEIGHT = 1350; // px - высота страницы PDF
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
 */
export function optimizeForPDF(editor) {
  // Удаляем старые разрывы
  removeAllPageBreaks(editor);

  const editorElement = editor.editor;
  if (!editorElement) return;

  // Создаем измерительный iframe
  const iframe = document.createElement('iframe');
  iframe.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    width: ${PAGE_WIDTH}px;
    height: ${PAGE_HEIGHT * 10}px;
    visibility: hidden;
    border: none;
  `;
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          padding: ${CONTENT_PADDING}px;
          width: ${PAGE_WIDTH}px;
        }
        p { margin-bottom: 1em; }
        ul, ol { margin-bottom: 1em; padding-left: 2em; }
        li { margin-bottom: 0.5em; }
        h1, h2, h3, h4, h5, h6 { margin-bottom: 0.5em; margin-top: 1em; }
        table { margin-bottom: 1em; width: 100%; border-collapse: collapse; }
        img { max-width: 100%; height: auto; }
      </style>
    </head>
    <body id="content"></body>
    </html>
  `);
  iframeDoc.close();

  const contentContainer = iframeDoc.getElementById('content');

  // Копируем элементы из редактора
  const elements = Array.from(editorElement.children);
  const fragments = [];
  let currentHeight = 0;
  let currentFragment = [];
  let pageNumber = 1;

  elements.forEach((el) => {
    // Пропускаем старые page-breaks
    if (el.classList.contains('pdf-page-break')) {
      return;
    }

    // Клонируем элемент для измерения
    const clone = el.cloneNode(true);
    contentContainer.appendChild(clone);
    const elHeight = clone.offsetHeight;

    // Проверяем, влезет ли элемент на текущую страницу
    if (currentHeight + elHeight > PAGE_HEIGHT - CONTENT_PADDING * 2) {
      // Не влезает - сохраняем текущий фрагмент и начинаем новый
      if (currentFragment.length > 0) {
        fragments.push({
          elements: currentFragment,
          pageNumber: pageNumber++,
        });
      }
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
  }

  // Очищаем iframe
  document.body.removeChild(iframe);

  // Вставляем разрывы между фрагментами
  if (fragments.length > 1) {
    // Строим новый контент с разрывами
    editorElement.innerHTML = '';

    fragments.forEach((fragment, index) => {
      // Добавляем элементы фрагмента
      fragment.elements.forEach((el) => {
        editorElement.appendChild(el);
      });

      // Добавляем разрыв страницы (кроме последнего фрагмента)
      if (index < fragments.length - 1) {
        const pageBreakEl = document.createElement('div');
        pageBreakEl.innerHTML = createPageBreakHTML(fragment.pageNumber + 1);
        const pageBreak = pageBreakEl.firstElementChild;
        editorElement.appendChild(pageBreak);
      }
    });

    // Синхронизируем значение
    editor.synchronizeValues();

    return fragments.length;
  }

  return 1;
}

/**
 * Добавляет кнопку "Оптимизировать для PDF" в toolbar
 */
export default function addPdfOptimizerPlugin(editor, onHeightChange) {
  // Добавляем кнопку в toolbar
  editor.registerButton({
    name: 'pdfOptimize',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tooltip: 'Оптимизировать для PDF (авто-разбивка на страницы)',
    exec: (editor) => {
      const pagesCount = optimizeForPDF(editor);
      editor.alert(`Контент разбит на ${pagesCount} страниц(ы)`);

      // Обновляем высоту
      if (onHeightChange) {
        updateHeight(editor, onHeightChange);
      }
    },
  });

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
