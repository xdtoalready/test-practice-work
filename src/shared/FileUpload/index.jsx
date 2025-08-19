import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Download } from 'lucide-react';
import styles from './Upload.module.sass';
import cn from 'classnames';
const FileUpload = ({
  label,
  value,
  onChange,
  name,
  className = '',
  acceptTypes = '*',
  disabled = false,
  ...props
}) => {
  const [localFileUrl, setLocalFileUrl] = useState(null);
  const inputRef = useRef(null);

  // Очищаем URL при размонтировании
  useEffect(() => {
    return () => {
      if (localFileUrl) {
        URL.revokeObjectURL(localFileUrl);
      }
    };
  }, [localFileUrl]);

  // Получение имени файла
  const getDisplayFileName = () => {
    if (value instanceof File) {
      // Если value это File объект
      return value.name;
    } else if (value instanceof Blob) {
      // Если value это Blob (из API)
      // Возможно, вам нужно будет адаптировать это под вашу структуру данных
      return 'Загруженный файл';
    } else if (!value) {
      return '';
    }
    // Если value это строка (путь к файлу)
    return value.split('/').pop();
  };

  // Обработчик выбора файла
  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Очищаем предыдущий URL если он есть
      if (localFileUrl) {
        URL.revokeObjectURL(localFileUrl);
      }

      // Создаем URL для предпросмотра
      const fileUrl = URL.createObjectURL(selectedFile);
      setLocalFileUrl(fileUrl);

      // Передаем файл в родительский компонент
      onChange?.(name, selectedFile);
    }
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  // Обработчик скачивания
  const handleDownload = async () => {
    if (!value) return;

    if (value instanceof File) {
      // Если это File объект, используем localFileUrl для скачивания
      const link = document.createElement('a');
      link.href = localFileUrl;
      link.download = value.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (value instanceof Blob) {
      // Если это Blob (из API), используем его напрямую
      const link = document.createElement('a');
      link.href = URL.createObjectURL(value);
      link.download = getDisplayFileName(); // или используйте соответствующее имя
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } else if (typeof value === 'string') {
      const fileName = value.split('/').pop();

      // Проверяем расширение файла
      const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);

      if (isImage) {
        // Для изображений - открываем в новой вкладке
        window.open(value, '_blank');
      } else {
        // Для остальных файлов - скачиваем
        const link = document.createElement('a');
        link.href = value;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <div className={cn(styles.field, className)}>
      {label && (
        <label className={styles.label}>
          {label}
          {props.required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.wrap}>
        <input
          type="text"
          className={styles.input}
          value={getDisplayFileName()}
          readOnly
          placeholder="Прикрепить файл"
          disabled={disabled}
        />
        <div className={styles.actions}>
          {value && (
            <button
              type="button"
              onClick={handleDownload}
              className={styles.button}
              // className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              disabled={disabled || !value}
            >
              <Download size={20} />
            </button>
          )}
          <button
            type="button"
            onClick={handleUploadClick}
            // className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            disabled={disabled}
          >
            <Paperclip size={20} />
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          style={{ display: 'none' }}
          className="hidden"
          onChange={handleFileChange}
          accept={acceptTypes}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default FileUpload;
