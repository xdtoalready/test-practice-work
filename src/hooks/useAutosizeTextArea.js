import { useEffect, useLayoutEffect } from 'react';
import {calculateTextHeight} from "../utils/calculate";

const useAutosizeTextArea = (textAreaRef, isRendered, setRendered,hovered) => {

  useEffect(() => {
    setTimeout(()=>{if (textAreaRef?.current && isRendered) {
      const textarea = textAreaRef.current;

      // Сохраняем скролл
      const scrollTop = textarea.scrollTop;

      // Обновляем размер
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;

      console.log(
          textAreaRef, textarea, textarea.defaultValue, textarea.offsetWidth, textarea.clientWidth, textarea.style, 'autosize'
      )

      textarea.style.height = scrollHeight === 0 ? calculateTextHeight(textarea.defaultValue ?? '', textarea.offsetWidth ?? textarea.clientWidth, textarea.style) : scrollHeight + 'px';

      // Восстанавливаем скролл
      textarea.scrollTop = scrollTop;

      setRendered(false);
    }
    },50)
  }, [textAreaRef?.current,textAreaRef?.current?.value, isRendered,hovered]);
};

export default useAutosizeTextArea;
