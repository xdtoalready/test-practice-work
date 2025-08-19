import React, { useCallback, useMemo } from 'react';
import { useController } from 'react-hook-form';
import cn from 'classnames';
import styles from './styles.module.sass';
import TextInput from '../../TextInput';

const FormTextInput = React.memo(
  React.forwardRef(
    ({ name, label, onChange, value, required, control, ...props }, ref) => {
      const {
        field,
        fieldState: { isTouched, error },
      } = useController({
        name,
        control,
        rules: {
          required: required,
        },
        defaultValue: value ?? '',
      });

      const handleChange = useCallback(
        (e) => {
          field.onChange(e);
          onChange?.(e);
        },
        [field, onChange],
      );

      const className = useMemo(
        () =>
          cn(props.className, {
            [styles.invalidField]: required && isTouched && !field.value,
          }),
        [props.className, required, isTouched, field.value],
      );

      // Проверяем, что name определен и является строкой
      if (!name || typeof name !== 'string') {
        console.warn(
          'FormTextInput: name prop is required and must be a string',
        );
        return null;
      }

      return (
        <TextInput
          {...props}
          {...field}
          ref={ref}
          label={label}
          onChange={handleChange}
          className={className}
          required={required}
        />
      );
    },
  ),
);

FormTextInput.displayName = 'FormTextInput';

export default FormTextInput;
