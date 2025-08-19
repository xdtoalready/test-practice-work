import React from 'react';
import styles from './Inputs.module.sass';
import TextInput from '../../TextInput';
import Icon from '../../Icon';
import cn from 'classnames';
const Index = ({
  label,
  placeholder,
  onChange,
  name,
  values,
  onAdd,
  max,
  canAdd = true,
}) => {
  return (
    <div className={styles.inputGroup}>
      <div className={cn(styles.label, styles.input_label)}>
        <div>{label}</div>
        {canAdd && (
          <Icon
            onClick={() =>
              values.length < max && onAdd(`${name}.${values.length}`)
            }
            name={'plus'}
            viewBox={'0 0 16 16'}
            size={10}
          />
        )}
      </div>
      {values.map((input, index) => (
        <TextInput
          className={styles.input}
          edited={true}
          key={input.value}
          value={input.label}
          onChange={(e) =>
            onChange(`${name}.${input.value ?? index}`, e.target.value)
          }
          placeholder={placeholder}
        />
      ))}
    </div>
  );
};

export default Index;
