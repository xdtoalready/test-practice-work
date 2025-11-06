/**
 * Утилиты для разбивки HTML контента отчётов на страницы PDF
 */

const PAGE_HEIGHT = 900; // px - высота страницы PDF
const PAGE_WIDTH = 1920; // px - ширина страницы PDF
const CONTENT_PADDING = 50; // px - отступы контента

/**
 * Создает HTML маркера разрыва страницы
 */
function createPageBreakHTML(pageNumber) {
  return `<div class="pdf-page-break" contenteditable="false" style="page-break-after: always; break-after: page; margin: 20px 0; padding: 10px; background: #e6f7ff; border: 2px dashed #1890ff; border-radius: 4px; text-align: center; color: #1890ff; font-size: 12px; font-weight: 600; cursor: default; user-select: none;">📄 Разрыв страницы (Страница ${pageNumber})</div>`;
}

/**
 * Разбивает список (OL/UL) на части по элементам LI
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
 * @returns {string} - HTML с добавленными разрывами страниц
 */
export function splitHtmlIntoPages(htmlContent) {
  console.log('[PDF Report] Начало разбивки HTML контента');
  console.log('[PDF Report] Входной HTML:', htmlContent);

  // Создаем временный контейнер для парсинга HTML
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = htmlContent;

  // Получаем все top-level элементы
  const elements = Array.from(tempContainer.children).filter(
    el => !el.classList.contains('pdf-page-break')
  );

  console.log('[PDF Report] Найдено top-level элементов:', elements.length);
  console.log('[PDF Report] Типы элементов:', elements.map(el => el.tagName).join(', '));

  if (elements.length === 0) {
    console.log('[PDF Report] Нет элементов для обработки');
    return htmlContent;
  }

  // Создаем измерительный контейнер
  const measureContainer = document.createElement('div');
  measureContainer.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    width: ${PAGE_WIDTH - CONTENT_PADDING * 2}px;
    visibility: hidden;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  `;

  document.body.appendChild(measureContainer);

  const fragments = [];
  let currentFragment = [];
  let currentHeight = 0;
  let pageNumber = 1;
  const pageLimit = PAGE_HEIGHT - CONTENT_PADDING * 2;

  console.log('[PDF Report] Лимит высоты страницы:', pageLimit, 'px');

  elements.forEach((el, index) => {
    const clone = el.cloneNode(true);
    measureContainer.innerHTML = '';
    measureContainer.appendChild(clone);
    const elHeight = measureContainer.offsetHeight;

    console.log(`[PDF Report] Элемент #${index} (${el.tagName}): ${elHeight}px, текущая высота: ${currentHeight}px`);

    // Если элемент - список и он слишком большой, разбиваем его
    if ((el.tagName === 'OL' || el.tagName === 'UL') && elHeight > pageLimit) {
      console.log(`[PDF Report] Элемент ${el.tagName} слишком большой (${elHeight}px > ${pageLimit}px), разбиваю на части`);

      const availableHeight = pageLimit - currentHeight;
      const listParts = splitListElement(el, pageLimit, measureContainer, availableHeight);

      console.log(`[PDF Report] Список разбит на ${listParts.length} частей`);

      listParts.forEach((listPart, partIndex) => {
        measureContainer.innerHTML = '';
        measureContainer.appendChild(listPart.cloneNode(true));
        const partHeight = measureContainer.offsetHeight;

        console.log(`[PDF Report]   Часть #${partIndex + 1}: ${partHeight}px`);

        if (partIndex === 0 && currentHeight + partHeight <= pageLimit) {
          currentFragment.push(listPart);
          currentHeight += partHeight;
        } else {
          if (currentFragment.length > 0) {
            fragments.push({
              elements: [...currentFragment],
              pageNumber: pageNumber++,
            });
            console.log(`[PDF Report]   Создана страница #${pageNumber - 1}`);
          }

          currentFragment = [listPart];
          currentHeight = partHeight;
        }
      });

      return;
    }

    // Обычная обработка элемента
    if (currentHeight + elHeight > pageLimit && currentFragment.length > 0) {
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
