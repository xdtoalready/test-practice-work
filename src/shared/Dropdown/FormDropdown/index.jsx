import React, { useCallback, useMemo } from 'react';
import { useForm, FormProvider, useController } from 'react-hook-form';
import cn from 'classnames';
import styles from './styles.module.sass';
import Dropdown from '../Default';

const FormDropdown = React.memo(
  React.forwardRef(
    (
      {
        name,
        label,
        setValue: setDropdownValue,
        value,
        required,
        control,
        ...props
      },
      ref,
    ) => {
      // Проверяем, что name определен и является строкой

      const {
        field,
        fieldState: { isTouched },
      } = useController({
        name,
        control,
        rules: {
          required: required,
        },
        defaultValue: value ?? '',
      });

      const handleChange = useCallback(
        (val) => {
          field.onChange(val);
          setDropdownValue?.(val);
        },
        [field, setDropdownValue],
      );

      const className = useMemo(
        () =>
          cn(props.className, {
            [styles.invalidField]: required && isTouched && !field.value,
          }),
        [props.className, required, isTouched, field.value],
      );
      if (!name || typeof name !== 'string') {
        console.warn(
          'FormDropdown: name prop is required and must be a string',
        );
        return null;
      }

      return (
        <Dropdown
          {...props}
          ref={ref}
          label={label}
          value={field.value}
          setValue={handleChange}
          className={className}
          required={required}
        />
      );
    },
  ),
);

FormDropdown.displayName = 'FormDropdown';
export default FormDropdown;
