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
};
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
