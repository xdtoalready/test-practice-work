import React, { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import styles from './EditorRendered.module.scss';
import cn from 'classnames';
import { Jodit } from 'jodit';
import 'jodit/es2021/jodit.css';

const EditorRenderer = ({
  content,
  className,
  maxHeight,
  width,
  style,
  ...rest
}) => {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const [shouldLimit, setShouldLimit] = useState(false);

  useEffect(() => {
    if (containerRef.current && !editorRef.current && content) {
      // Create a read-only Jodit instance
      editorRef.current = Jodit.make(containerRef.current, {
        readonly: true,
        toolbar: false,
        statusbar: false,
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        buttons: [],
        height: 'auto',
        width: width || 'auto',
        minHeight: 0,
        disablePlugins: ['mobile', 'drag-and-drop'],
        useAceEditor: false,
        allowResizeY: false,
        events: {
          afterInit: function (editor) {
            editor.editor.addEventListener('click', function (e) {
              const link = e.target.closest('a');
              if (link) {
                e.preventDefault();
                e.stopPropagation();

                // Выбираем ссылку и открываем диалог редактирования
                window.open(link.href, '_blank');
              }
            });
          },
        },
        css: {
          '.jodit-container': {
            border: 'none',
            borderRadius: '0',
            backgroundColor: 'transparent',
          },
          '.jodit-workplace': {
            border: 'none',
            backgroundColor: 'transparent',
          },
          '.jodit-wysiwyg': {
            padding: '0',
            overflowY: maxHeight ? 'auto' : 'visible',
            maxHeight: maxHeight ? `${maxHeight}px` : 'none',
          },
          '.jodit-wysiwyg ul': {
            listStyleType: 'disc !important',
            paddingLeft: '2em !important',
            margin: '0.5em 0 !important',
          },
          '.jodit-wysiwyg ol': {
            listStyleType: 'decimal !important',
            paddingLeft: '2em !important',
            margin: '0.5em 0 !important',
          },
          '.jodit-wysiwyg li': {
            display: 'list-item !important',
          },
        },
      });

      // Set content
      editorRef.current.value = content;

      // Check for applying height limit
      if (maxHeight) {
        const contentHeight = editorRef.current.editor.scrollHeight;
        setShouldLimit(contentHeight > maxHeight);
      }
    }

    // Update content if it changes
    if (editorRef.current && content !== undefined) {
      editorRef.current.value = content;

      // Re-check height limits
      if (maxHeight) {
        const contentHeight = editorRef.current.editor.scrollHeight;
        setShouldLimit(contentHeight > maxHeight);
      }
    }

    // Cleanup
    return () => {
      if (editorRef.current) {
        editorRef.current.destruct();
        editorRef.current = null;
      }
    };
  }, [content, maxHeight, width]);

  return (
    <div
      className={cn(styles.editorRenderer, className, {
        [styles.limitedHeight]: shouldLimit,
      })}
      style={{
        ...style,
        width: width || '100%',
      }}
      {...rest}
    >
      <div ref={containerRef} className={styles.content} />
      {shouldLimit && maxHeight && <div className={styles.gradient} />}
    </div>
  );
};

export default EditorRenderer;
