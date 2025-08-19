import React, { useMemo, useState, useCallback } from 'react';
import styles from './CardInput.module.sass';
import cn from 'classnames';
import Icon from '../../Icon';
import TextInput from '../../TextInput';

const CardInput = ({ label, value, actions, type, name, ...props }) => {
  const [isEdited, setIsEdited] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const getInputClass = useMemo(() => {
    return {
      [styles.input_email]: type === 'email' && !isEdited,
      [styles.input_tel]: type === 'tel',
    };
  }, [type, isEdited]);

  // Стабильный обработчик изменений
  const handleChange = useCallback(
    (e) => {
      const { value, selectionStart, name } = e.target;
      actions.edit({ name, value, selectionStart });
    },
    [actions],
  );

  const handleEdit = useCallback(() => {
    props?.onEdit && props?.onEdit();
    setIsEdited((prev) => !prev);
  }, []);

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
      actions={actions}
      {...props}
    />
  );
};

export default React.memo(CardInput);
