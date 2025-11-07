/**
 * Утилиты для разбивки HTML контента отчётов на страницы PDF
 */

const PAGE_HEIGHT_LIMIT = 900; // px - точный лимит высоты контента на странице
const PAGE_WIDTH = 1920; // px - ширина страницы PDF

/**
 * Предзагружает все изображения из HTML контента
 * Важно для правильного измерения высоты элементов с base64 картинками
 */
async function preloadImages(htmlContent) {
  console.log('[PDF Report] Начало предзагрузки изображений');

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  const images = tempDiv.querySelectorAll('img');

  console.log('[PDF Report] Найдено изображений:', images.length);

  if (images.length === 0) {
    console.log('[PDF Report] Изображений нет, пропускаем предзагрузку');
    return;
  }

  const loadPromises = Array.from(images).map((img, index) => {
    return new Promise((resolve) => {
      if (img.complete && img.naturalHeight !== 0) {
        console.log(`[PDF Report] Изображение #${index} уже загружено (${img.naturalWidth}x${img.naturalHeight})`);
        resolve();
      } else {
        img.onload = () => {
          console.log(`[PDF Report] Изображение #${index} загружено (${img.naturalWidth}x${img.naturalHeight})`);
          resolve();
        };
        img.onerror = () => {
          console.warn(`[PDF Report] Ошибка загрузки изображения #${index}`);
          resolve(); // Resolve даже при ошибке, чтобы не блокировать
        };

        // Устанавливаем таймаут на случай зависания
        setTimeout(() => {
          console.warn(`[PDF Report] Таймаут загрузки изображения #${index}`);
          resolve();
        }, 10000); // 10 секунд максимум на одно изображение
      }
    });
  });

  await Promise.all(loadPromises);
  console.log('[PDF Report] Все изображения загружены');
}

/**
 * Создает HTML маркера разрыва страницы
 */
function createPageBreakHTML(pageNumber) {
  return `<div class="pdf-page-break" contenteditable="false" style="page-break-after: always; break-after: page; margin: 20px 0; padding: 10px; background: #e6f7ff; border: 2px dashed #1890ff; border-radius: 4px; text-align: center; color: #1890ff; font-size: 12px; font-weight: 600; cursor: default; user-select: none;">📄 Разрыв страницы (Страница ${pageNumber})</div>`;
}

/**
 * Очищает HTML от экранированных кавычек в атрибутах
 */
function unescapeHtmlAttributes(html) {
  // Заменяем экранированные кавычки в атрибутах
  // start=\"1\" -> start="1"
  // href=\"...\" -> href="..."
  return html
    .replace(/(\w+)=\\"/g, '$1="')  // атрибут=\"  ->  атрибут="
    .replace(/\\"(\s|>)/g, '"$1');  // \"пробел/закрытие  ->  "пробел/закрытие
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
  console.log('[PDF Report] Разворачиваю структуру списков');

  const flattened = [];

  elements.forEach((el, index) => {
    if (el.tagName === 'OL' || el.tagName === 'UL') {
      console.log(`[PDF Report] Обрабатываю список ${el.tagName}`, el);

      const listItems = Array.from(el.children).filter(child => child.tagName === 'LI');

      listItems.forEach((li, liIndex) => {
        cleanJoditAttributes(li);

        // Извлекаем текст заголовка LI
        const liText = extractLiText(li);

        // Извлекаем вложенные блоки
        const nestedBlocks = extractNestedBlocks(li);

        console.log(`[PDF Report]   LI #${liIndex}: текст="${liText}", вложенных блоков=${nestedBlocks.length}`);

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

  console.log(`[PDF Report] Развернуто: ${elements.length} -> ${flattened.length} элементов`);
  return flattened;
}

/**
 * Разбивает список (OL/UL) на части по элементам LI
 * ВАЖНО: Теперь списки должны содержать только один LI (после flatten)
 */
function splitListElement(listElement, pageLimit, measureContainer, availableHeight = pageLimit) {
  console.log(`[PDF Report] Разбиваю список ${listElement.tagName}, доступная высота: ${availableHeight}px`);

  const listItems = Array.from(listElement.children).filter(el => el.tagName === 'LI');

  if (listItems.length === 0) {
    return [listElement];
  }

  const groups = [];
  let currentGroup = [];
  let currentHeight = 0;
  let isFirstGroup = true;

  listItems.forEach((li, index) => {
    measureContainer.innerHTML = '';
    const tempList = listElement.cloneNode(false);
    tempList.appendChild(li.cloneNode(true));
    measureContainer.appendChild(tempList);
    const liHeight = measureContainer.offsetHeight;

    console.log(`[PDF Report]   LI #${index}: ${liHeight}px, текущая высота: ${currentHeight}px`);

    const currentLimit = isFirstGroup ? availableHeight : pageLimit;

    if (currentHeight + liHeight > currentLimit && currentGroup.length > 0) {
      console.log(`[PDF Report]   LI не влез, создаю новую группу (элементов: ${currentGroup.length})`);
      groups.push([...currentGroup]);
      currentGroup = [li];
      currentHeight = liHeight;
      isFirstGroup = false;
    } else {
      currentGroup.push(li);
      currentHeight += liHeight;
    }
  });

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  console.log(`[PDF Report] Список разбит на ${groups.length} частей`);

  if (groups.length === 1) {
    return [listElement];
  }

  let startNumber = 1;
  if (listElement.tagName === 'OL' && listElement.hasAttribute('start')) {
    startNumber = parseInt(listElement.getAttribute('start'), 10) || 1;
  }

  return groups.map((items, groupIndex) => {
    const newList = listElement.cloneNode(false);

    Array.from(listElement.attributes).forEach(attr => {
      newList.setAttribute(attr.name, attr.value);
    });

    items.forEach(li => newList.appendChild(li.cloneNode(true)));

    if (listElement.tagName === 'OL' && groupIndex > 0) {
      const itemsBeforeCount = groups.slice(0, groupIndex).reduce((sum, g) => sum + g.length, 0);
      newList.setAttribute('start', startNumber + itemsBeforeCount);
      console.log(`[PDF Report]   OL часть #${groupIndex + 1} начинается с ${startNumber + itemsBeforeCount}`);
    }

    return newList;
  });
}

/**
 * Разбивает HTML контент на страницы с маркерами page-break
 * @param {string} htmlContent - HTML контент для разбивки
 * @returns {Promise<string>} - HTML с добавленными разрывами страниц
 */
export async function splitHtmlIntoPages(htmlContent) {
  console.log('[PDF Report] Начало разбивки HTML контента');
  console.log('[PDF Report] Входной HTML:', htmlContent);

  // ВАЖНО: Очищаем экранированные кавычки
  htmlContent = unescapeHtmlAttributes(htmlContent);
  console.log('[PDF Report] HTML после очистки кавычек:', htmlContent);

  // ВАЖНО: Сначала предзагружаем все изображения
  await preloadImages(htmlContent);

  // Создаем временный контейнер для парсинга HTML
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = htmlContent;

  // Получаем все top-level элементы
  let elements = Array.from(tempContainer.children).filter(
    el => !el.classList.contains('pdf-page-break')
  );

  console.log('[PDF Report] Найдено top-level элементов:', elements.length);
  console.log('[PDF Report] Типы элементов:', elements.map(el => el.tagName).join(', '));

  // Очищаем элементы от мусорных атрибутов Jodit
  elements.forEach(el => cleanJoditAttributes(el));

  if (elements.length === 0) {
    console.log('[PDF Report] Нет элементов для обработки');
    return htmlContent;
  }

  // Создаем измерительный контейнер с правильными стилями
  const measureContainer = document.createElement('div');
  measureContainer.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    width: ${PAGE_WIDTH}px;
    visibility: hidden;
    font-family: 'Times New Roman', Times, serif;
    font-size: 16px;
    line-height: 1.5;
  `;

  document.body.appendChild(measureContainer);

  const fragments = [];
  let currentFragment = [];
  let currentHeight = 0;
  let pageNumber = 1;

  console.log('[PDF Report] Лимит высоты страницы:', PAGE_HEIGHT_LIMIT, 'px');

  elements.forEach((el, index) => {
    // Клонируем элемент и измеряем его высоту
    const clone = el.cloneNode(true);
    measureContainer.innerHTML = '';
    measureContainer.appendChild(clone);

    // Добавляем небольшую задержку для рендеринга
    const elHeight = measureContainer.scrollHeight || measureContainer.offsetHeight;

    console.log(`[PDF Report] Элемент #${index} (${el.tagName}): ${elHeight}px, текущая высота: ${currentHeight}px`);

    // Обычная обработка элемента - просто проверяем, влезет ли на текущую страницу
    if (currentHeight + elHeight > PAGE_HEIGHT_LIMIT && currentFragment.length > 0) {
      console.log(`[PDF Report] Элемент не влез, создаю страницу #${pageNumber}`);

      fragments.push({
        elements: [...currentFragment],
        pageNumber: pageNumber++,
      });

      currentFragment = [el];
      currentHeight = elHeight;
    } else {
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
    console.log(`[PDF Report] Добавлена последняя страница #${pageNumber}`);
  }

  // Очищаем измерительный контейнер
  document.body.removeChild(measureContainer);

  console.log('[PDF Report] Всего фрагментов (страниц):', fragments.length);

  // Собираем результат
  const resultContainer = document.createElement('div');

  fragments.forEach((fragment, fragIndex) => {
    // Добавляем элементы фрагмента
    fragment.elements.forEach(el => {
      resultContainer.appendChild(el);
    });

    // Добавляем разрыв страницы после фрагмента (кроме последнего)
    if (fragIndex < fragments.length - 1) {
      const pageBreakEl = document.createElement('div');
      pageBreakEl.innerHTML = createPageBreakHTML(fragment.pageNumber + 1);
      const pageBreak = pageBreakEl.firstElementChild;
      resultContainer.appendChild(pageBreak);

      console.log(`[PDF Report] Вставлен разрыв перед страницей #${fragment.pageNumber + 1}`);
    }
  });

  const resultHtml = resultContainer.innerHTML;
  console.log('[PDF Report] Разбивка завершена, страниц:', fragments.length);
  console.log('[PDF Report] Результат:', resultHtml);

  return resultHtml;
}
