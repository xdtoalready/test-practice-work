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

  // Настройки нормализации HTML
  cleanHTML: {
    removeEmptyElements: true,
    fillEmptyParagraph: false,
    replaceNBSP: true,
    replaceOldTags: {
      i: 'em',
      b: 'strong',
    },
    allowTags: {
      p: true,
      br: true,
      ul: true,
      ol: true,
      li: true,
      a: true,
      strong: true,
      em: true,
      u: true,
      s: true,
      span: true,
      div: true,
      h1: true,
      h2: true,
      h3: true,
      h4: true,
      h5: true,
      h6: true,
      table: true,
      thead: true,
      tbody: true,
      tr: true,
      td: true,
      th: true,
      img: true,
      code: true,
    },
    denyTags: {
      script: true,
      style: true,
    },
  },

  // Удаление мусорных атрибутов при вставке и редактировании
  sanitizeOptions: {
    allowedAttributes: {
      '*': ['class', 'style'],
      'a': ['href', 'target', 'rel'],
      'img': ['src', 'alt', 'width', 'height'],
      'table': ['border', 'cellpadding', 'cellspacing'],
      'ol': ['start', 'type'],
      'ul': ['type'],
    },
  },
};
