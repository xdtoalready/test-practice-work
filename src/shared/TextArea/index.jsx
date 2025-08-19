import React, {
  useLayoutEffect,
  useRef,
  useState,
  memo,
  forwardRef,
  useEffect,
} from 'react';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';

const TextArea = forwardRef((props, ref) => {
  const { defaultValue, hovered, key } = props;
  const [rendered, setRendered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    setRendered(true);
    setTimeout(() => setRendered(false), 1500);
    // return () => {
    //     setRendered(false)
    // }
  }, [defaultValue]);

  useAutosizeTextArea(ref, rendered, setRendered, isHovered);

  const handleChange = (e) => {
    if (props.onChange) {
      props.onChange(e);
    }
  };

  // Фильтруем ненужные пропсы
  const {
    inputRef,
    haveDots,
    edited,
    multiple,
    labeled,
    value, // удаляем value из пропсов
    seen,
    onSee,
    onEdit,
    ...textareaProps
  } = props;
  return (
    <textarea
      ref={ref}
      onChange={handleChange}
      defaultValue={defaultValue}
      {...textareaProps}
      onMouseEnter={() => {
        setIsHovered(true);
        setRendered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setRendered(false);
      }}
    />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
