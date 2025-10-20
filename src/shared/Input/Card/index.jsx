import React, { useMemo, useState, useCallback } from 'react';
import styles from './CardInput.module.sass';
import cn from 'classnames';
import Icon from '../../Icon';
import TextInput from '../../TextInput';

const CardInput = ({ label, value, actions, type, name, disabled = false, readOnly = false, ...props }) => {
  const [isEdited, setIsEdited] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const getInputClass = useMemo(() => {
    return {
      [styles.input_email]: type === 'email' && !isEdited,
      [styles.input_tel]: type === 'tel',
      [styles.input_readonly]: readOnly || disabled,
    };
  }, [type, isEdited, readOnly, disabled]);

  // Стабильный обработчик изменений
  const handleChange = useCallback(
    (e) => {
      if (readOnly || disabled) return;
      const { value, selectionStart, name } = e.target;
      actions?.edit({ name, value, selectionStart });
    },
    [actions, readOnly, disabled],
  );

  const handleEdit = useCallback(() => {
    if (readOnly || disabled) return;
    props?.onEdit && props?.onEdit();
    setIsEdited((prev) => !prev);
  }, [readOnly, disabled, props]);

  const handleSee = useCallback(() => {
    setIsClicked((prev) => !prev);
  }, []);

  return (
    <TextInput
      haveDots={true}
      name={name}
      value={value}
      type={type}
      edited={isEdited}
      onEdit={handleEdit}
      onChange={handleChange}
      seen={isClicked}
      onSee={handleSee}
      disabled={disabled || readOnly}
      classNameActions={styles.actions}
      classLabel={
        props.multiple
          ? styles.label_multiple
          : cn(styles.label, props.classNameLabel)
      }
      classWrap={styles.wrap}
      className={
        props?.multiple && props?.labeled
          ? styles.container_labeled
          : styles.container
      }
      classInput={cn(styles.input, getInputClass, props?.classInput)}
      label={props?.multiple ? (props?.labeled ? label : null) : label}
      actions={readOnly || disabled ? undefined : actions}
      {...props}
    />
  );
};

export default React.memo(CardInput);
