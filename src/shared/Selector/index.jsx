import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import Tooltip from '../Tooltip';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import Chevron from '../Dropdown/Default/Chevron';
import styles from './Selector.module.sass';
import { motion } from 'framer-motion';
import {
  opacityForSelectTranstion,
  opacityTransition,
} from '../../utils/motion.variants';
import Select from 'react-select';
import { useFormContext, get } from 'react-hook-form';

const ValuesSelector = ({
  className,
  classNameContainer,
  classDropdownHead,
  classDropdownLabel,
  value,
  onChange,
  isMulti,
  name,
  options,
  label,
  tooltip,
  placeholder,
  readonly,
  required,
  small,
  upBody,
  renderOption,
  renderValue,
  // Новые пропсы для асинхронности
  isAsync = false,
  asyncSearch,
  minInputLength = 4,
  loadingMessage = 'Загрузка...',
  noOptionsMessage = 'Нет результатов',
}) => {
  const ref = useRef(false);

  const [isTouched, setIsTouched] = useState(false);

  // Интеграция с react-hook-form
  const formContext = useFormContext();
  const isInForm = !!formContext && !!name;

  const {
    register = () => ({}),
    formState: { errors = {}, isSubmitted = false } = {
      errors: {},
      isSubmitted: false,
    },
    setValue: setFormValue = () => {},
    trigger = () => {},
  } = formContext || {};

  useEffect(() => {
    if (isInForm) {
      register(name, {
        required: required ? 'Это поле обязательно' : false,
        validate: (value) => {
          if (required) {
            if (!value) return 'Это поле обязательно';
            if (Array.isArray(value) && value.length === 0)
              return 'Это поле обязательно';
          }
          return true;
        },
      });

      // Устанавливаем начальное значение
      if (value !== undefined) {
        setFormValue(name, value, { shouldValidate: true });
      }
    }
  }, [isInForm, name, register, value, required]);

  useEffect(() => {
    if (isSubmitted) {
      setIsTouched(true);
    }
  }, [isSubmitted]);

  const error =
    isInForm && (isTouched || isSubmitted) ? get(errors, name) : null;

  const handleChange = (selectedOptions) => {
    setIsTouched(true);
    let newValue;

    if (
      !isMulti &&
      Array.isArray(selectedOptions) &&
      selectedOptions.length > 1
    ) {
      newValue = [selectedOptions[selectedOptions.length - 1]];
    } else {
      newValue = selectedOptions;
    }

    if (isInForm) {
      setFormValue(name, newValue, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      trigger(name);
    }

    // Вызываем оригинальный onChange
    onChange(newValue);
  };

  const loadOptions = async (inputValue) => {
    if (inputValue.length < minInputLength) {
      return [];
    }

    try {
      const results = await asyncSearch(inputValue);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  const SelectComponent = isAsync ? AsyncSelect : Select;

  const commonProps = {
    placeholder: placeholder
      ? placeholder
      : typeof label === 'string'
        ? label
        : '',
    onChange: handleChange,
    value: value ?? null,
    isMulti: true,
    isDisabled: readonly ?? false,
    name: name,
    components: {
      MenuList: MenuList,
      IndicatorSeparator: null,
      CrossIcon: null,
      ClearIndicator: null,
      DropdownIndicator: (props) => !readonly && <Indicator {...props} />,
    },
    styles: {
      multiValue: (base) => ({
        ...base,
        borderRadius: '8px',
      }),
      control: (base, state) => ({
        ...base,
        borderColor: error ? '#ee7373' : base.borderColor,
        '&:hover': {
          borderColor: error ? '#ee7373' : base.borderColor,
        },
        boxShadow: error ? '0 0 5px rgba(255, 0, 0, 0.47)' : base.boxShadow,
      }),
    },
    classNames: {
      input:()=>styles.selector_input,
      placeholder: () => styles.selector__container__control__placeholder,
      multiValueLabel: () => styles.selector__container__control_values__label,
      menu: () => styles.selector__container__control_menu,
      option: () => styles.selector__container__control_menuList__option,
      menuList: () => styles.selector__container__control_menuList,
      valueContainer: () => styles.selector__container__control_values,
      control: (state) =>
        state.isFocused
          ? styles.selector__container__control_focused
          : cn(styles.selector__container__control, {
              [styles.hasValue]: isMulti ? !value?.length : !value,
              [styles.error]: error,
            }),
    },
  };

  const asyncProps = {
    ...commonProps,
    loadOptions,
    defaultOptions: options || [],
    cacheOptions: true,
    loadingMessage: () => loadingMessage,
    noOptionsMessage: ({ inputValue }) =>
      inputValue.length < minInputLength
        ? `Введите минимум ${minInputLength} символа`
        : noOptionsMessage,
    minInputLength,
  };

  return (
    <div ref={ref} className={classNameContainer}>
      {label && (
        <div className={cn(styles.label, classDropdownLabel)}>
          {label} {required && <span className={styles.required}>*</span>}
          {tooltip && (
            <Tooltip
              className={styles.tooltip}
              title={tooltip}
              icon="info"
              place="right"
            />
          )}
        </div>
      )}
      {isAsync ? (
        <AsyncSelect {...asyncProps} />
      ) : (
        <Select {...commonProps} options={options} />
      )}
      {error && <div className={styles.errorMessage}>{error.message}</div>}
    </div>
  );
};

const Indicator = ({ children, ...props }) => {
  return (
    <components.DropdownIndicator {...props}>
      <Chevron direction={''} isOpen={props.selectProps.menuIsOpen}></Chevron>
    </components.DropdownIndicator>
  );
};

const MenuList = (props) => {
  return (
    <motion.div
      initial={'hidden'}
      exit={'hidden'}
      animate={'show'}
      variants={opacityForSelectTranstion}
    >
      <components.MenuList {...props}>{props.children}</components.MenuList>
    </motion.div>
  );
};

export default ValuesSelector;
