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
 * Очищает элемент от мусорных атрибутов Jodit
 */
function cleanJoditAttributes(element) {
  const joditAttributes = ['data-start', 'data-end', 'data-is-last-node'];
  joditAttributes.forEach(attr => {
    if (element.hasAttribute(attr)) {
      element.removeAttribute(attr);
    }
  });

  // Рекурсивно очищаем дочерние элементы
  Array.from(element.children).forEach(child => cleanJoditAttributes(child));
}

/**
 * Извлекает текстовое содержимое из начала LI (до первого блочного элемента)
 */
function extractLiText(li) {
  const textParts = [];
  let node = li.firstChild;

  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) textParts.push(text);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      // Если это инлайн элемент (a, span, strong, em, br и т.д.)
      if (['a', 'span', 'strong', 'b', 'em', 'i', 'u', 's', 'br', 'code'].includes(tag)) {
        textParts.push(node.outerHTML);
      } else {
        // Встретили блочный элемент - останавливаемся
        break;
      }
    }
    node = node.nextSibling;
  }

  return textParts.join(' ').trim();
}

/**
 * Извлекает вложенные блочные элементы из LI
 */
function extractNestedBlocks(li) {
  const blocks = [];
  let node = li.firstChild;
  let skipInitialInline = true;

  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      // Пропускаем начальные инлайн элементы и текст
      if (skipInitialInline && ['a', 'span', 'strong', 'b', 'em', 'i', 'u', 's', 'br', 'code'].includes(tag)) {
        node = node.nextSibling;
        continue;
      }
      // Встретили первый блочный элемент
      skipInitialInline = false;

      // Добавляем блочный элемент
      if (!['a', 'span', 'strong', 'b', 'em', 'i', 'u', 's', 'br', 'code'].includes(tag)) {
        blocks.push(node.cloneNode(true));
      }
    } else if (node.nodeType === Node.TEXT_NODE && !skipInitialInline) {
      const text = node.textContent.trim();
      if (text) {
        // Создаем параграф для текста
        const p = document.createElement('p');
        p.textContent = text;
        blocks.push(p);
      }
    }
    node = node.nextSibling;
  }

  return blocks;
}

/**
 * Разворачивает (flatten) структуру списков, извлекая вложенные элементы
 */
function flattenListStructure(elements) {
  console.log('[PDF Optimizer] Разворачиваю структуру списков');

  const flattened = [];

  elements.forEach((el, index) => {
    if (el.tagName === 'OL' || el.tagName === 'UL') {
      console.log(`[PDF Optimizer] Обрабатываю список ${el.tagName}`, el);

      const listItems = Array.from(el.children).filter(child => child.tagName === 'LI');

      listItems.forEach((li, liIndex) => {
        cleanJoditAttributes(li);

        // Извлекаем текст заголовка LI
        const liText = extractLiText(li);

        // Извлекаем вложенные блоки
        const nestedBlocks = extractNestedBlocks(li);

        console.log(`[PDF Optimizer]   LI #${liIndex}: текст="${liText}", вложенных блоков=${nestedBlocks.length}`);

        // Создаем новый "чистый" список с одним элементом
        const newList = el.cloneNode(false);
        const newLi = document.createElement('li');

        // Копируем только текстовое содержимое (без вложенных блоков)
        if (liText) {
          newLi.innerHTML = liText;
        } else {
          newLi.textContent = li.textContent.split('\n')[0].trim();
        }

        newList.appendChild(newLi);

        // Копируем атрибуты списка
        Array.from(el.attributes).forEach(attr => {
          newList.setAttribute(attr.name, attr.value);
        });

        // Для OL корректируем нумерацию
        if (el.tagName === 'OL') {
          const startNumber = parseInt(el.getAttribute('start') || '1', 10);
          newList.setAttribute('start', startNumber + liIndex);
        }

        flattened.push(newList);

        // Добавляем вложенные блоки как отдельные элементы
        nestedBlocks.forEach(block => {
          cleanJoditAttributes(block);
          flattened.push(block);
        });
      });
    } else {
      cleanJoditAttributes(el);
      flattened.push(el);
    }
  });

  console.log(`[PDF Optimizer] Развернуто: ${elements.length} -> ${flattened.length} элементов`);
  return flattened;
}

/**
 * Разбивает список (OL/UL) на части по элементам LI
 * @param {HTMLElement} listElement - элемент списка (OL или UL)
 * @param {number} pageLimit - лимит высоты страницы
 * @param {HTMLElement} measureContainer - контейнер для измерений
 * @param {number} availableHeight - доступная высота на текущей странице
 * @returns {Array<HTMLElement>} - массив новых списков
 */
function splitListElement(listElement, pageLimit, measureContainer, availableHeight = pageLimit) {
  console.log(`[PDF Optimizer] Разбиваю список ${listElement.tagName}, доступная высота: ${availableHeight}px`);

  // Получаем все direct children LI
  const listItems = Array.from(listElement.children).filter(el => el.tagName === 'LI');

  if (listItems.length === 0) {
    return [listElement];
  }

  // Разбиваем на группы, которые помещаются на страницу
  const groups = [];
  let currentGroup = [];
  let currentHeight = 0;
  let isFirstGroup = true;

  listItems.forEach((li, index) => {
    // Измеряем высоту LI
    measureContainer.innerHTML = '';
    const tempList = listElement.cloneNode(false);
    tempList.appendChild(li.cloneNode(true));
    measureContainer.appendChild(tempList);
    const liHeight = measureContainer.offsetHeight;

    console.log(`[PDF Optimizer]   LI #${index}: ${liHeight}px, текущая высота: ${currentHeight}px`);

    // Для первой группы используем availableHeight, для остальных - pageLimit
    const currentLimit = isFirstGroup ? availableHeight : pageLimit;

    if (currentHeight + liHeight > currentLimit && currentGroup.length > 0) {
      // Не влезает - создаем новую группу
      console.log(`[PDF Optimizer]   LI не влез, создаю новую группу (элементов: ${currentGroup.length})`);
      groups.push([...currentGroup]);
      currentGroup = [li];
      currentHeight = liHeight;
      isFirstGroup = false;
    } else {
      // Влезает - добавляем в текущую группу
      currentGroup.push(li);
      currentHeight += liHeight;
    }
  });

  // Добавляем последнюю группу
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  console.log(`[PDF Optimizer] Список разбит на ${groups.length} частей`);

  // Если список не нужно разбивать, возвращаем оригинал
  if (groups.length === 1) {
    return [listElement];
  }

  // Создаем новые списки для каждой группы
  let startNumber = 1;
  if (listElement.tagName === 'OL' && listElement.hasAttribute('start')) {
    startNumber = parseInt(listElement.getAttribute('start'), 10) || 1;
  }

  return groups.map((items, groupIndex) => {
    const newList = listElement.cloneNode(false); // Копируем только тег, без детей

    // Копируем все атрибуты
    Array.from(listElement.attributes).forEach(attr => {
      newList.setAttribute(attr.name, attr.value);
    });

    // Добавляем элементы LI
    items.forEach(li => newList.appendChild(li.cloneNode(true)));

    // Для OL сохраняем нумерацию
    if (listElement.tagName === 'OL' && groupIndex > 0) {
      const itemsBeforeCount = groups.slice(0, groupIndex).reduce((sum, g) => sum + g.length, 0);
      newList.setAttribute('start', startNumber + itemsBeforeCount);
      console.log(`[PDF Optimizer]   OL часть #${groupIndex + 1} начинается с ${startNumber + itemsBeforeCount}`);
    }

    return newList;
  });
}

/**
 * Оптимизирует контент для PDF - автоматически расставляет разрывы страниц
 * ВАЖНО: Разбивает большие списки (OL/UL) на части, чтобы они влезали на страницы
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
  let elements = Array.from(editorElement.children).filter(
    el => !el.classList.contains('pdf-page-break')
  );

  console.log('[PDF Optimizer] Найдено top-level элементов:', elements.length);
  console.log('[PDF Optimizer] Типы элементов:', elements.map(el => el.tagName).join(', '));

  // НОВОЕ: Разворачиваем вложенные структуры списков
  elements = flattenListStructure(elements);

  console.log('[PDF Optimizer] После разворачивания элементов:', elements.length);
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

    // Если элемент - список и он слишком большой, разбиваем его
    if ((el.tagName === 'OL' || el.tagName === 'UL') && elHeight > pageLimit) {
      console.log(`[PDF Optimizer] Элемент ${el.tagName} слишком большой (${elHeight}px > ${pageLimit}px), разбиваю на части`);

      // Рассчитываем доступную высоту на текущей странице
      const availableHeight = pageLimit - currentHeight;

      // Разбиваем список на части
      const listParts = splitListElement(el, pageLimit, measureContainer, availableHeight);

      console.log(`[PDF Optimizer] Список разбит на ${listParts.length} частей`);

      // Обрабатываем каждую часть списка
      listParts.forEach((listPart, partIndex) => {
        measureContainer.innerHTML = '';
        measureContainer.appendChild(listPart.cloneNode(true));
        const partHeight = measureContainer.offsetHeight;

        console.log(`[PDF Optimizer]   Часть #${partIndex + 1}: ${partHeight}px`);

        // Если это первая часть и она влезает на текущую страницу
        if (partIndex === 0 && currentHeight + partHeight <= pageLimit) {
          currentFragment.push(listPart);
          currentHeight += partHeight;
        } else {
          // Создаем новую страницу
          if (currentFragment.length > 0) {
            fragments.push({
              elements: [...currentFragment],
              pageNumber: pageNumber++,
            });
            console.log(`[PDF Optimizer]   Создана страница #${pageNumber - 1}`);
          }

          currentFragment = [listPart];
          currentHeight = partHeight;
        }
      });

      return; // Пропускаем обычную обработку
    }

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

  // Теперь нужно ЗАМЕНИТЬ исходные элементы на новые (разбитые)
  // Очищаем редактор и заполняем заново
  editorElement.innerHTML = '';

  fragments.forEach((fragment, fragIndex) => {
    // Добавляем элементы фрагмента
    fragment.elements.forEach(el => {
      editorElement.appendChild(el);
    });

    // Добавляем разрыв страницы после фрагмента (кроме последнего)
    if (fragIndex < fragments.length - 1) {
      const pageBreakEl = document.createElement('div');
      pageBreakEl.innerHTML = createPageBreakHTML(fragment.pageNumber + 1);
      const pageBreak = pageBreakEl.firstElementChild;
      editorElement.appendChild(pageBreak);

      console.log(`[PDF Optimizer] Вставлен разрыв перед страницей #${fragment.pageNumber + 1}`);
    }
  });

  // Синхронизируем значение
  editor.synchronizeValues();

  console.log('[PDF Optimizer] Оптимизация завершена, страниц:', fragments.length);
  return fragments.length;
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
