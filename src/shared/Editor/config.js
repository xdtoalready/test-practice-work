import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import Header from '@editorjs/header';
import InlineCode from '@editorjs/inline-code';
import Marker from '@editorjs/marker';
import BreakLine from 'editorjs-break-line';

export const EditorJsTools = {
  uploader: {
    insertImageAsBase64URI: true,
    imagesExtensions: ['jpg', 'png', 'jpeg'],
    url: 'no-url-to-prevent-default-upload',
    process: function (resp) {
      return { files: [], error: 1, message: 'Upload disabled' };
    },
    processFileName: function (name) {
      return name;
    },
  },
  allowResizeY: true,
  resize: true,
  useAceEditor: false,
  removeButtons: ['upload'],
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,

  language: 'ru',
  i18n: {
    ru: {
      Insert: 'Вставить',
      Cancel: 'Отмена',
      URL: 'URL',
      Text: 'Текст',
    },
  },
  buttons: [
    'undo',
    'redo',
      '|',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    '|',
    'font',
    'paragraph',
    'brush',
    '|',
    'table',
    'link',
    '|',
    'pdfOptimize',

  ],
  link: {
    processPastedLink: true,
    noFollowCheckbox: false,
    openInNewTabCheckbox: false,
    modeClassName: null,
  },
  toolbarAdaptive: false,
  dialog: {
    zIndex: 20000,
  },
  enableCommandExecution: true,
  disablePlugins: ['mobile'],
  iframe: false,

  // Настройки очистки стилей при вставке
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  defaultActionOnPaste: 'insert_clear_html',
  processPasteHTML: true,

  // Функция для очистки HTML при вставке (применяется ДО вставки в редактор)
  events: {
    processPaste: function(event, html, plainText) {
      // Создаем временный контейнер для парсинга HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // Удаляем все атрибуты style
      const allElements = tempDiv.querySelectorAll('*');
      allElements.forEach((el) => {
        // Удаляем атрибуты
        el.removeAttribute('style');
        el.removeAttribute('class');
        el.removeAttribute('id');
        el.removeAttribute('dir');
        el.removeAttribute('role');
        el.removeAttribute('aria-level');

        // Удаляем все aria-* атрибуты
        Array.from(el.attributes).forEach((attr) => {
          if (attr.name.startsWith('aria-') || attr.name.startsWith('data-')) {
            el.removeAttribute(attr.name);
          }
        });
      });

      // Удаляем все span теги
      const spans = tempDiv.querySelectorAll('span');
      spans.forEach((span) => {
        while (span.firstChild) {
          span.parentNode.insertBefore(span.firstChild, span);
        }
        span.remove();
      });

      // Удаляем code теги
      const codeTags = tempDiv.querySelectorAll('code');
      codeTags.forEach((code) => {
        while (code.firstChild) {
          code.parentNode.insertBefore(code.firstChild, code);
        }
        code.remove();
      });

      // Упрощаем структуру списков
      const listParagraphs = tempDiv.querySelectorAll('li > p');
      listParagraphs.forEach((p) => {
        if (p.parentElement.children.length === 1) {
          while (p.firstChild) {
            p.parentElement.insertBefore(p.firstChild, p);
          }
          p.remove();
        }
      });

      return tempDiv.innerHTML;
    }
  }
};
