const addResizePlugin = (editor) => {
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'jodit-custom-resizer';
  resizeHandle.style.cssText = `
    position: absolute;
    bottom: -8px;
    left: 0;
    right: 0;
    height: 16px;
    background-color: rgba(0, 0, 0, 0.1);
    cursor: ns-resize;
    border-radius: 0 0 12px 12px;
  `;

  editor.container.style.position = 'relative';
  editor.container.appendChild(resizeHandle);

  const editorStyle = document.createElement('style');
  editorStyle.textContent = `
    .jodit-container .jodit-wysiwyg ul {
      list-style-type: disc !important;
      padding-left: 2em !important;
    }
    .jodit-container .jodit-wysiwyg ol {
      list-style-type: decimal !important;
      padding-left: 2em !important;
    }
    .jodit-container .jodit-wysiwyg li {
      display: list-item !important;
    }
  `;
  editor.container.appendChild(editorStyle);

  let startY = 0;
  let startHeight = 0;
  let isResizing = false;

  resizeHandle.addEventListener('mousedown', function (e) {
    isResizing = true;
    startY = e.clientY;
    startHeight = editor.container.offsetHeight;
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
    e.preventDefault();
  });

  function handleResize(e) {
    if (!isResizing) return;
    const newHeight = startHeight + (e.clientY - startY);
    if (newHeight >= 100) {
      editor.container.style.height = newHeight + 'px';
      editor.e.fire('resize');
    }
  }

  function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  }
};

export default addResizePlugin;
