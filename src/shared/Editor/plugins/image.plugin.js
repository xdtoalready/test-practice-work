import { editorIcons } from '../utils/icons';

const addCustomImagePlugin = (editor) => {
  // Создаем CSS стили для выделенного изображения и попапа
  const style = document.createElement('style');
  style.textContent = `
    .jodit-selected-image {
      outline: 2px solid #1e88e5;
      position: relative;
    }
    .jodit-image-popup {
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 100;
      display: flex;
      gap: 5px;
      width: 140px;
    }
    .jodit-image-popup button {
      border: none;
      background: #f0f0f0;
      padding: 5px;
      border-radius: 3px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }
    .jodit-image-popup button:hover {
      background: #e0e0e0;
    }
    .jodit-image-popup button svg {
      width: 16px;
      height: 16px;
    }
    
    /* Стили для попапа справа от изображения */
    .jodit-image-popup-right::before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-right: 8px solid white;
      left: -8px;
      top: 10px;
      filter: drop-shadow(-1px 0 0 #ccc);
    }
    
    /* Стили для попапа слева от изображения */
    .jodit-image-popup-left::before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-left: 8px solid white;
      right: -8px;
      top: 10px;
      filter: drop-shadow(1px 0 0 #ccc);
    }
    
    /* Стили для попапа над изображением */
    .jodit-image-popup-top::before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid white;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      filter: drop-shadow(0 1px 0 #ccc);
    }
  `;
  document.head.appendChild(style);

  // Функция для удаления попапа и снятия выделения
  const removePopupAndSelection = () => {
    const oldPopups = editor.editor.querySelectorAll('.jodit-image-popup');
    oldPopups.forEach((popup) => {
      popup.remove();
    });

    const selectedImages = editor.editor.querySelectorAll(
      '.jodit-selected-image',
    );
    selectedImages.forEach((img) => {
      img.classList.remove('jodit-selected-image');
    });
  };

  // Обработчик клика по документу
  const handleDocumentClick = (e) => {
    // Если клик был не по изображению, удаляем попап
    if (!e.target.closest('.jodit-selected-image')) {
      removePopupAndSelection();
    }
  };

  // Добавляем обработчик клика на документ
  document.addEventListener('click', handleDocumentClick);

  // Отслеживаем клик по изображению
  editor.events.on('click', (e) => {
    // Удаляем предыдущие выделения и попапы
    removePopupAndSelection();

    // Если клик был по изображению
    if (e.target.tagName === 'IMG') {
      const img = e.target;

      // Добавляем класс выделения
      img.classList.add('jodit-selected-image');

      // Создаем попап с кнопками
      const popup = document.createElement('div');
      popup.className = 'jodit-image-popup';

      // Кнопка выравнивания по левому краю
      const alignLeftBtn = document.createElement('button');
      alignLeftBtn.innerHTML = editorIcons.alignLeft;
      alignLeftBtn.title = 'Выровнять по левому краю';
      alignLeftBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        // First ensure the image is not inside a paragraph
        const parentP = img.closest('p');
        if (parentP && parentP.contains(img)) {
          // If image is inside a paragraph, move it before the paragraph
          parentP.parentNode.insertBefore(img, parentP);
        }

        // Apply float styles for left alignment
        img.style.display = 'inline';
        img.style.float = 'left';
        img.style.marginRight = '10px';
        img.style.marginBottom = '10px';
        img.style.marginLeft = '0';
        img.style.marginTop = '5px';
        editor.events.fire(editor.getEditorValue(), 'change');
      };

      // Кнопка выравнивания по центру
      const alignCenterBtn = document.createElement('button');
      alignCenterBtn.innerHTML = editorIcons.alignCenter;
      alignCenterBtn.title = 'Выровнять по центру';
      alignCenterBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        // Remove float styles
        img.style.float = 'none';
        img.style.display = 'block';
        img.style.marginLeft = 'auto';
        img.style.marginRight = 'auto';
        img.style.marginTop = '10px';
        img.style.marginBottom = '10px';

        editor.events.fire(editor.getEditorValue(), 'change');
      };

      // Кнопка выравнивания по правому краю
      const alignRightBtn = document.createElement('button');
      alignRightBtn.innerHTML = editorIcons.alignRight;
      alignRightBtn.title = 'Выровнять по правому краю';
      alignRightBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('check')
        // First ensure the image is not inside a paragraph
        const parentP = img.closest('p');
        if (parentP && parentP.contains(img)) {
          console.log('check2')

          // If image is inside a paragraph, move it before the paragraph
          parentP.parentNode.insertBefore(img, parentP);
        }

        // Apply float styles for right alignment
        img.style.display = 'inline';
        img.style.float = 'right';
        img.style.marginLeft = '10px';
        img.style.marginBottom = '10px';
        img.style.marginRight = '0';
        img.style.marginTop = '5px';

        editor.events.fire(editor.getEditorValue(), 'change');
      };

      // Кнопка удаления
      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = editorIcons.delete;
      deleteBtn.title = 'Удалить изображение';
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        img.remove();
        popup.remove();
        editor.events.fire(editor.getEditorValue(), 'change');
      };

      // Добавляем кнопки в попап
      popup.appendChild(alignLeftBtn);
      popup.appendChild(alignCenterBtn);
      popup.appendChild(alignRightBtn);
      popup.appendChild(deleteBtn);

      // Добавляем попап в редактор
      editor.editor.appendChild(popup);

      // Позиционируем попап относительно изображения внутри редактора
      const imgRect = img.getBoundingClientRect();
      const editorRect = editor.editor.getBoundingClientRect();

      // Рассчитываем позицию относительно редактора
      const imgRectInEditor = {
        top: imgRect.top - editorRect.top,
        left: imgRect.left - editorRect.left,
        right: imgRect.right - editorRect.left,
        bottom: imgRect.bottom - editorRect.top,
        width: imgRect.width,
        height: imgRect.height,
      };

      // Определяем доступное пространство справа и слева
      const spaceRight = editorRect.width - imgRectInEditor.right;
      const spaceLeft = imgRectInEditor.left;

      // Устанавливаем позицию попапа
      popup.style.position = 'absolute';

      // По умолчанию ставим попап справа от изображения, если есть место
      if (spaceRight >= 150) {
        // Предполагаем, что ширина попапа около 150px
        popup.style.left = imgRectInEditor.right + 5 + 'px';
        popup.style.top = imgRectInEditor.top + 'px';
        popup.classList.add('jodit-image-popup-right');
      }
      // Если нет места справа, ставим слева
      else if (spaceLeft >= 150) {
        popup.style.left = imgRectInEditor.left - 150 - 5 + 'px';
        popup.style.top = imgRectInEditor.top + 'px';
        popup.classList.add('jodit-image-popup-left');
      }
      // Если нет места ни справа, ни слева, ставим поверх изображения
      else {
        popup.style.left =
          imgRectInEditor.left + imgRectInEditor.width / 2 - 75 + 'px';
        popup.style.top = imgRectInEditor.top - 40 + 'px';
        popup.classList.add('jodit-image-popup-top');
      }
    }
  });

  // Удаляем обработчик при уничтожении редактора
  editor.events.on('beforeDestruct', () => {
    document.removeEventListener('click', handleDocumentClick);
  });
};

export default addCustomImagePlugin;
