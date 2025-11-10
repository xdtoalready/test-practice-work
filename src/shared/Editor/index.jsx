import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  createContext,
  useContext,
} from 'react';
import { Jodit } from 'jodit';
import 'jodit/es2021/jodit.css';
import styles from './editor.module.sass';
import Resizer from 'react-image-file-resizer';
import { handleError } from '../../utils/snackbar';
import addCustomImagePlugin from './plugins/image.plugin';
import { compressImage } from './utils/compressImage';
import addResizePlugin from './plugins/resize.plugin';
import addPdfOptimizerPlugin, { registerPdfOptimizeButton } from './plugins/pdf-optimizer.plugin';
import HeightIndicator from './components/HeightIndicator';
import {
  afterInitClick,
  afterInitDblClick,
  afterInitPasteComment,
  afterInitPaste,
  beforeInitDrop,
  beforeInitKeyDown,
} from './events';
import { EditorJsTools, EditorJsToolsWithPdfOptimization } from './config';
import { editorIcons } from './utils/icons';
import { EditorContext } from './context/editor.context';

// Регистрируем кнопку PDF оптимизации глобально (один раз)
registerPdfOptimizeButton();

const Editor = forwardRef(
  (
    {
      onChange,
      onChangeComment,
      initialHTML,
      comment,
      name,
      placeholder,
      handleEnter,
      onFileUpload,
      enablePdfOptimization = false, // Новый пропс для включения PDF функционала
      ...rest
    },
    ref,
  ) => {

    const containerRef = useRef(null);
    const { registerEditor } = useContext(EditorContext);
    const editorRef = useRef(null);
    const [selectionRange, setSelectionRange] = useState(null);
    const [contentHeight, setContentHeight] = useState({
      height: 0,
      pagesCount: 1,
      pageHeight: 900,
    });
    Jodit.modules.Icon.set('bold',editorIcons.bold);
    Jodit.modules.Icon.set('italic',editorIcons.italic);
    Jodit.modules.Icon.set('paragraph',editorIcons.paragraph);
    Jodit.modules.Icon.set('link',editorIcons.link);
    Jodit.modules.Icon.set('redo',editorIcons.redo);
    Jodit.modules.Icon.set('undo',editorIcons.undo);
    Jodit.modules.Icon.set('table',editorIcons.table);
    Jodit.modules.Icon.set('brush',editorIcons.brush);
    Jodit.modules.Icon.set('strikethrough',editorIcons.underline);
    Jodit.modules.Icon.set('underline',editorIcons.strikethrough);

    // Jodit.modules.Icon.set('bold', '<svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 1.46776C16.4817 2.20411 17.5 3.73314 17.5 5.5C17.5 7.26686 16.4817 8.79589 15 9.53224M17 14.7664C18.5115 15.4503 19.8725 16.565 21 18M1 18C2.94649 15.5226 5.58918 14 8.5 14C11.4108 14 14.0535 15.5226 16 18M13 5.5C13 7.98528 10.9853 10 8.5 10C6.01472 10 4 7.98528 4 5.5C4 3.01472 6.01472 1 8.5 1C10.9853 1 13 3.01472 13 5.5Z" stroke="#8E59FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
    const controls = {
      bold: {
        name:'bold',
        icon: 'bold',
        // exec: (e,current,control) => {
        //   console.log(e)
        //   console.log(current)
        //   console.log(control)
        //
        //   const isPressed = control.button.button.ariaPressed === 'true';
        //
        //
        //   console.log(control.button.button.ariaPressed,'true')
        //   if (!isPressed){
        //     control.button.button.classList.add(styles.rotate)
        //   } else{
        //     control.button.button.classList.remove(styles.rotate)
        //   }
        //   // return control.originalEvent
        //   e.execCommand('bold');
        // }
      },
      paragraph:{
        component:'select',
        // name:'paragraph',
        // icon:'paragraph',
        css:{
          width:'25px',
          height:'24px'
        },
        iconURL: '/leadbro/font-size-editor.svg',

      },
      font:{
        component:'select',
      }


    };

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      },
    }));
    useEffect(() => {
      if (containerRef.current && !editorRef.current) {
        const textarea = document.createElement('textarea');
        textarea.value = initialHTML || '';
        textarea.name = name || '';
        containerRef.current.appendChild(textarea);

        // Jodit.defaultOptions.controls.bulletList = {
        //   name: 'bulletList',
        //   iconURL: '/leadbro/back-jodit.png',
        //   exec: (editor) => {
        //     editor.execCommand('insertUnorderedList');
        //   },
        //   tooltip: 'Маркированный список',
        //   list: {
        //     default: 'Маркированный список',
        //   },
        // };

        // Jodit.defaultOptions.controls.bulletList = {
        //   name: 'bulletList',
        //   icon: <Icon name="smile" size={24} />, // Заменяем иконку на компонент Icon
        //   exec: (editor) => {
        //     editor.execCommand('insertUnorderedList');
        //   },
        //   tooltip: 'Маркированный список',
        //   list: {
        //     default: 'Маркированный список',
        //   },
        // };

        Jodit.defaultOptions.controls.numberedList = {
          name: 'numberedList',
          iconURL:
            'https://avatars.mds.yandex.net/i?id=43f1a029d98aef8cb0091dba04947086_l-5292126-images-thumbs&n=27&h=480&w=480',
          exec: (editor) => {
            editor.execCommand('insertOrderedList');
          },
          tooltip: 'Нумерованный список',
          list: {
            default: 'Нумерованный список',
          },
        };
        const configJodit =
          name === 'comment'
            ? {
                disablePlugins: ['enter'],
                className: 'comment-jodit',
                allowResizeY: true,
                toolbar: false,
                placeholder: placeholder || 'Start typing...',
                showXPathInStatusbar: false,
                showCharsCounter: false,
                showWordsCounter: false,
                minHeight: 46,
                maxHeight: 'auto',
                controls: controls,
                events: {
                  beforeInit: function (editor) {
                    beforeInitKeyDown(editor, selectionRange, selectionRange);
                    beforeInitDrop(editor);
                  },
                  afterInit: function (editor) {
                    const originalSetValue = editor.setEditorValue;
                    editor.setEditorValue = function (value) {
                      // Проверяем, есть ли активный селекшн
                      const isEditorFocused =
                        this.ownerDocument.activeElement === this.editor;
                      const selection = isEditorFocused
                        ? this.selection.save()
                        : null;

                      // Вызываем оригинальный метод
                      originalSetValue.call(this, value);

                      // Восстанавливаем селекшн если был
                      if (selection) {
                        setTimeout(() => {
                          // this.selection.restore(selection);
                        }, 0);
                      }
                    };
                    addCustomImagePlugin(editor);

                    afterInitClick(editor);

                    afterInitPasteComment(editor, onFileUpload);

                    afterInitDblClick(editor);
                  },
                  keydown: (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleEnter();
                    }
                  },
                  change: async function (newValue) {

                    if (onChange) {
                      onChangeComment({
                        target: {
                          name: name || '',
                          value: newValue === '' ? ' ' : newValue,
                        },
                      });
                      onChange({
                        target: {
                          name: name || '',
                          value: newValue === '' ? ' ' : newValue,
                        },
                      });
                    }
                  },
                },
                zIndex: 100000,
              }
            : {
                controls: controls,

                className: 'jodit-default',
                // Используем разные конфигурации в зависимости от enablePdfOptimization
                ...(enablePdfOptimization ? EditorJsToolsWithPdfOptimization : EditorJsTools),
                // Для обычных редакторов убираем кнопку PDF оптимизации
                buttons: enablePdfOptimization
                  ? EditorJsToolsWithPdfOptimization.buttons
                  : EditorJsTools.buttons.filter(btn => btn !== 'pdfOptimize'),
                placeholder: placeholder || 'Start typing...',
                minHeight: rest?.height ?? 100,
                maxHeight: rest?.height + 400,
                events: {
                  beforeInit: function (editor) {
                    beforeInitKeyDown(editor, selectionRange, selectionRange);
                    beforeInitDrop(editor);
                  },
                  afterInit: function (editor) {
                    editor.container.style.paddingBottom = '24px';
                    addCustomImagePlugin(editor);

                    afterInitClick(editor);

                    afterInitPaste(editor);

                    afterInitDblClick(editor);

                    // Добавляем плагин оптимизации PDF только если включен
                    if (enablePdfOptimization) {
                      addPdfOptimizerPlugin(editor, (heightData) => {
                        setContentHeight(heightData);
                      });
                    }

                    // addResizePlugin(editor);
                  },
                  change: async function (newValue) {
                    if (onChange) {
                      onChange({
                        target: {
                          name: name || '',
                          value: newValue === '' ? ' ' : newValue,
                        },
                      });
                    }
                  },
                },
                zIndex: 100000,
              };
        editorRef.current = Jodit.make(textarea, configJodit);
        editorRef.current.value = initialHTML || '';
        textarea.remove();

        registerEditor(editorRef.current);
      }

      return () => {
        if (editorRef.current) {
          editorRef.current.destruct();
          editorRef.current = null;
        }
      };
    }, []);

    return (
      <div>
        <div ref={containerRef} className={styles.editorContainer}></div>
        {name !== 'comment' && enablePdfOptimization && (
          <HeightIndicator
            height={contentHeight.height}
            pagesCount={contentHeight.pagesCount}
            pageHeight={contentHeight.pageHeight}
          />
        )}
      </div>
    );
  },
);

export default Editor;
