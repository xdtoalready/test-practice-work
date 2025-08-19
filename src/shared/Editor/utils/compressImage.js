import Resizer from 'react-image-file-resizer';
import { handleError } from '../../../utils/snackbar';

export const compressImage = (file, editor, maxWidth = 600, quality = 60) => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    try {
      reader.onload = (e) => {
        img.onload = () => {
          // Get original dimensions
          const originalWidth = img.width;
          const originalHeight = img.height;

          // Only resize if the image is larger than the max dimensions
          if (originalWidth > maxWidth) {
            // Keep aspect ratio
            const aspectRatio = originalWidth / originalHeight;
            const targetHeight = Math.round(maxWidth / aspectRatio);
            Resizer.imageFileResizer(
              file,
              maxWidth,
              targetHeight,
              'JPEG',
              quality,
              0,
              (uri) => {
                setTimeout(() => {
                  editor.selection.insertImage(uri);
                }, 10);
              },
              'base64',
            );
          } else {
            Resizer.imageFileResizer(
              file,
              originalWidth,
              originalHeight,
              'JPEG',
              quality,
              0,
              (uri) => {
                setTimeout(() => {
                  editor.selection.insertImage(uri);
                }, 10);
              },
              'base64',
            );
          }
        };
        img.src = e.target.result;
      };
    } catch (err) {
      console.error('Image compression error on drop:', err);
      handleError('Ошибка при вставке файла', err);
    } finally {
      reader.readAsDataURL(file);
    }
  });
};
