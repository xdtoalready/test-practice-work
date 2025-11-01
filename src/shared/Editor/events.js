import { compressImage } from './utils/compressImage';

export const beforeInitKeyDown = function (
  editor,
  selectionRange,
  setSelectionRange,
) {
  editor.events.on('keydown', function (event) {
    if (event.ctrlKey && event.key === 'a') {
      event.preventDefault(); // Prevent default browser select all

      const range = editor.selection.createRange();
      range.selectNodeContents(editor.editor);
      editor.selection.selectRange(range);
      setSelectionRange(range);

      return false;
    }

    if (
      (event.key === 'Delete' || event.key === 'Backspace') &&
      selectionRange
    ) {
      const selection = selectionRange;
      const editorContent = editor.editor.textContent.trim();

      if (
        selection &&
        (selection.toString().length >= editorContent.length * 0.9 || // If 90% or more is selected
          (editor.selection.isCollapsed() === false &&
            editorContent.length > 0 &&
            selection.toString().length > 0))
      ) {
        event.preventDefault();

        editor.value = ' ';

        return false;
      }
    }
  });
};

export const beforeInitDrop = function (editor) {
  editor.events.on(
    'drop',
    function (e) {
      if (
        e.dataTransfer &&
        e.dataTransfer.files &&
        e.dataTransfer.files.length
      ) {
        const dt = e.dataTransfer;
        let handled = false;

        for (let i = 0; i < dt.files.length; i++) {
          const file = dt.files[i];

          if (file.type.indexOf('image') === 0) {
            e.preventDefault();
            e.stopPropagation();
            handled = true;
            compressImage(file, editor);
          }
        }

        if (handled) {
          return false;
        }
      }
    },
    { priority: 1 },
  );
};

export const afterInitClick = function (editor) {
  editor.editor.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (link) {
      e.preventDefault();
      e.stopPropagation();
      editor.selection.select(link);
    }
  });
  const uploadButton = editor.container.querySelector('[data-ref="upload"]');
  if (uploadButton) {
    uploadButton.remove();
  }
};

export const afterInitPasteComment = function (editor, onFileUpload) {
  editor.editor.addEventListener('paste', async function (e) {
    const items = e.clipboardData?.items;
    const files = [];
    if(!e.clipboardData.getData('text')){
      if (!items) return;
      for (const item of items)
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) 
            files.push(file);
        }
      onFileUpload(files);
      e.preventDefault();
      e.stopPropagation();
      console.log('paste items', e.clipboardData.items);
    }
  });
};

export const afterInitPaste = function (editor) {
  editor.editor.addEventListener('paste', async function (e) {

    const items = (e.clipboardData || e.originalEvent.clipboardData).items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.indexOf('image') === 0) {
        e.preventDefault(); // Stop default paste behavior
        const file = item.getAsFile();

        if (file) {
          compressImage(file, editor);
        }
      }
    }
  });

  // Очистка стилей после вставки
  editor.events.on('afterPaste', function () {
    setTimeout(() => {
      cleanupPastedStyles(editor);
    }, 50);
  });
};

/**
 * Очищает нежелательные стили после вставки контента
 * Агрессивная очистка всех атрибутов из Word/Google Docs
 */
function cleanupPastedStyles(editor) {
  const editorElement = editor.editor;
  if (!editorElement) return;

  // Список разрешенных атрибутов для каждого типа элемента
  const allowedAttributes = {
    'a': ['href', 'target'],
    'img': ['src', 'alt', 'width', 'height'],
    'div': ['class'], // только для page-break
  };

  // Получаем все элементы
  const allElements = editorElement.querySelectorAll('*');

  allElements.forEach((el) => {
    const tagName = el.tagName.toLowerCase();

    // Не трогаем page-break маркеры
    if (el.classList && el.classList.contains('pdf-page-break')) {
      return;
    }

    // Удаляем ВСЕ атрибуты, кроме разрешенных
    const attrs = Array.from(el.attributes);
    attrs.forEach((attr) => {
      const attrName = attr.name.toLowerCase();

      // Разрешенные атрибуты для этого тега
      const allowed = allowedAttributes[tagName] || [];

      // Если атрибут не в списке разрешенных - удаляем
      if (!allowed.includes(attrName)) {
        el.removeAttribute(attr.name);
      }
    });
  });

  // Удаляем все span теги (переносим содержимое)
  const spans = editorElement.querySelectorAll('span');
  spans.forEach((span) => {
    // Переносим содержимое span в родительский элемент
    while (span.firstChild) {
      span.parentNode.insertBefore(span.firstChild, span);
    }
    span.remove();
  });

  // Упрощаем структуру: удаляем пустые параграфы внутри списков
  const listParagraphs = editorElement.querySelectorAll('li > p');
  listParagraphs.forEach((p) => {
    // Если это единственный параграф в li, переносим содержимое напрямую в li
    if (p.parentElement.children.length === 1) {
      while (p.firstChild) {
        p.parentElement.insertBefore(p.firstChild, p);
      }
      p.remove();
    }
  });

  // Удаляем code теги (если были вставлены из Google Docs)
  const codeTags = editorElement.querySelectorAll('code');
  codeTags.forEach((code) => {
    while (code.firstChild) {
      code.parentNode.insertBefore(code.firstChild, code);
    }
    code.remove();
  });

  // Синхронизируем изменения
  editor.synchronizeValues();
}
export const afterInitDblClick = function (editor) {
  editor.editor.addEventListener('dblclick', function (e) {
    const link = e.target.closest('a');
    if (link) {
      e.preventDefault();
      e.stopPropagation();

      // Выбираем ссылку и открываем диалог редактирования
      window.open(link.href, '_blank');
    }
  });
};
