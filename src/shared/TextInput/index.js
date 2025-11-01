import React, { forwardRef, memo, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import styles from './TextInput.module.sass';
import Icon from '../Icon';
import Tooltip from '../Tooltip';
import TextArea from '../TextArea';
import { useFormContext, get } from 'react-hook-form';
import Editor from '../Editor';
import ActionList from './Actions/ActionList';
import Dots from './Dots';
import uuid from 'draft-js/lib/uuid';

const TextInput = forwardRef(
  (
    {
      className,
      classLabel,
      classInput,
      label,
      classWrap,
      classNameActions,
      icon,
      beforeIcon,
      copy,
      currency,
      tooltip,
      place,
      actions,
      noMinWidth,
      onChange,
      onChangeComment,
      handleEnter,
      value,
      comment,
      validate,
      name,
      required,
      key,
      disabled,
      onFileUpload,
      enablePdfOptimization = false, // Пропс для включения PDF функционала
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef(null);
    const wrapRef = useRef(null);
    const [isTouched, setIsTouched] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(null);
    // Проверяем, находимся ли мы внутри формы
    const formContext = useFormContext();
    const isInForm = !!formContext && name;

    // Получаем методы формы, если они есть
    const {
      register,
      formState: { errors, isSubmitted } = {},
      setValue: setFormValue,
      trigger,
      clearErrors,
    } = formContext || {};
    const error = isInForm && isSubmitted ? get(errors, name) : null;

    // Регистрируем поле в форме, если мы внутри FormProvider
    useEffect(() => {
      if (isInForm) {
        // Регистрируем поле с валидацией
        register(name, {
          required: required && 'Это поле обязательно',
          validate: (value) => {
            // Сначала проверяем required
            if (required && !value) {
              return 'Это поле обязательно';
            }

            // Затем выполняем кастомную валидацию

            if (validate && required) {
              const result = validate(value);
              // Если результат === true, валидация прошла успешно
              // Иначе возвращаем сообщение об ошибке
              return result === true ? true : result;
            }

            return true;
          },
        });

        if (value !== undefined) {
          setFormValue(name, value, {
            shouldValidate: isTouched || isSubmitted,
          });
        }
      }
    }, [isInForm, name, register, setFormValue, value, required, validate]);

    useEffect(() => {
      if (isSubmitted) {
        setIsTouched(true);
      }
    }, [isSubmitted]);

    useEffect(() => {
      if (cursorPosition !== null && inputRef.current) {
        inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, [value, cursorPosition]);

    const formatValue = (inputValue) => {
      if (!inputValue) return inputValue;
      let formattedValue = inputValue.replace(/[^0-9.]/g, '');
      const [integer, decimal] = formattedValue.split('.');
      if (decimal) {
        formattedValue = `${integer}.${decimal.slice(0, 2)}`;
      }
      if (!decimal) {
        formattedValue += formattedValue.includes('.') ? '00' : '.00';
      }
      return formattedValue;
    };

    const handleBlur = (e) => {
      setIsTouched(true);
      if (isInForm) {
        // Запускаем валидацию при потере фокуса
        trigger(name);
      }
      if (props.onBlur) {
        props.onBlur();
      }
    };

    const handleInputChange = (e) => {
      const rawValue = e.target.value;
      const cursorPos = e.target.selectionStart;
      const isTextArea = e.target.tagName.toLowerCase() === 'textarea';
      if (props.type === 'hours') {
        const value = e.target.value ?? e.target.defaultValue;
        if (value === '' || (/^\d*$/.test(value) && parseInt(value) <= 23)) {
          handleChange({
            target: {
              ...e.target,
              value: value,
            },
          });
        }
      }
      if (props.type === 'minutes') {
        const value = e.target.value ?? e.target.defaultValue;
        if (value === '' || (/^\d*$/.test(value) && parseInt(value) <= 59)) {
          handleChange({
            target: {
              ...e.target,
              value: value,
            },
          });
        }
      }
      // Обработка для money типа
      if (props.type === 'money') {
        if (rawValue === '') {
          handleChange({
            target: {
              ...e.target,
              value: '',
            },
          });
          return;
        }

        const [integer, decimal] = rawValue.split('.');
        const formattedValue = integer ? formatValue(String(rawValue)) : '';
        if (
          !rawValue.includes('.') &&
          rawValue !== '' &&
          e.target.defaultValue !== ''
        ) {
          return;
        }
        handleChange({
          target: {
            ...e.target,
            value: formattedValue,
          },
        });
        return;
      }

      handleChange(e);

      if (isTextArea) {
        // requestAnimationFrame(() => {
        //   if (inputRef.current) {
        //     inputRef.current.setSelectionRange(cursorPos, cursorPos);
        //   }
        // });
      } else {
        setCursorPosition(cursorPos);
      }
    };

    // Общий обработчик изменений
    const handleChange = (e) => {
      const newValue = e.target.value;

      if (isInForm) {
        setFormValue(name, newValue, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        // Запускаем валидацию при изменении
        trigger(name);
      }

      if (onChange) {
        onChange(e);
      }
    };

    const commonProps = {
      name,
      onBlur: handleBlur,

      // ref: (e) => {
      //   inputRef.current = e;
      //   if (typeof ref === 'function') ref(e);
      //   else if (ref) ref.current = e;
      // },
      className: cn(classInput, styles.input, { [styles.errorInput]: error }),
      readOnly:
        (props.hasOwnProperty('edited') && !props?.edited) || disabled || false,
      ...props,
    };

    const renderInput = () => {
      if (props.type === 'textarea') {
        return (
          <TextArea
            {...commonProps}
            onChange={handleInputChange}
            defaultValue={value}
            className={cn(commonProps.className, styles.textarea)}
            ref={inputRef}
          />
        );
      }

      if (props.type === 'editor') {
        return (
          <Editor
            placeholder={props?.placeholder}
            name={name || ''}
            initialHTML={value || ''}
            comment={comment || ''}
            onChange={onChange}
            onChangeComment={onChangeComment}
            handleEnter={handleEnter}
            onFileUpload={onFileUpload}
            enablePdfOptimization={enablePdfOptimization}
            ref={ref}
            {...props}
          />
        );
      }

      return (
        <input
          onWheel={(e) => {
            e.target.blur();
          }}
          {...commonProps}
          value={
            props.type === 'money' ? formatValue(String(value) || '') : value
          }
          onChange={handleInputChange}
          ref={inputRef}
        />
      );
    };

    return (
      <div
        className={cn(
          styles.field,
          { [styles.fieldIcon]: icon },
          { [styles.fieldCopy]: copy },
          { [styles.fieldCurrency]: currency },
          { [styles.fieldBeforeIcon]: beforeIcon },
          { [styles.noMinWidth]: noMinWidth },
          className,
        )}
      >
        {label && (
          <div className={cn(classLabel, styles.label)}>
            {label}
            {required && <span className={styles.required}>*</span>}
            {tooltip && (
              <Tooltip
                className={styles.tooltip}
                title={tooltip}
                icon="info"
                place={place ? place : 'right'}
              />
            )}
          </div>
        )}
        <div
          ref={wrapRef}
          id={'input_wrap'}
          className={cn(styles.wrap, classWrap)}
        >
          {renderInput()}
          {beforeIcon && <div className={styles.beforeIcon}>{beforeIcon}</div>}
          {icon && (
            <div className={styles.icon}>
              <Icon name={icon} size="24" />
            </div>
          )}
          {copy && (
            <button className={styles.copy}>
              <Icon name="copy" size="24" />
            </button>
          )}
          {currency && <div className={styles.currency}>{currency}</div>}
          {props?.haveDots && (
            <Dots
              classNameDotsContainer={styles.dots_container}
              classNameActions={classNameActions}
              inputRef={inputRef}
              props={props}
              actions={actions}
              className={styles.dots_loader}
              classNameDot={styles.dot}
            />
          )}
          {actions && (
            <ActionList
              props={props}
              actions={actions}
              inputRef={inputRef}
              classNameActions={classNameActions}
            />
          )}
        </div>
        {error && <div className={styles.errorMessage}>{error.message}</div>}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
