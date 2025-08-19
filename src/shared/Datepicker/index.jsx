import React, { forwardRef, useState, useEffect, useRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ru } from 'date-fns/locale/ru';
import TextInput from '../TextInput';
import styles from './datepicker.module.sass';
import { parse, isValid } from 'date-fns';
import { formatDateWithOnlyDigits } from '../../utils/formate.date';
import cn from 'classnames';
import { useFormContext, get } from 'react-hook-form';
import Icon from '../Icon';

registerLocale('ru', ru);

const Calendar = (
  {
    value,
    onChange,
    label,
    placeholder = null,
    name,
    required,
    period = false,
    canClose = true,
    classNameContainer={},
    ...props
  },
  ref,
) => {
  const datePickerRef = useRef();
  const [isTouched, setIsTouched] = useState(false);

  // Интеграция с react-hook-form
  const formContext = useFormContext();
  const isInForm = !!formContext && name;

  const {
    register = () => ({}),
    formState: { errors = {}, isSubmitted = false } = {
      errors: {},
      isSubmitted: false,
    },
    setValue: setFormValue = () => {},
    trigger = () => {},
  } = formContext || {};

  // Показываем ошибку если поле тронуто ИЛИ была попытка отправки формы
  const error =
    isInForm && (isTouched || isSubmitted) ? get(errors, name) : null;

  // Регистрируем поле в форме
  useEffect(() => {
    if (isInForm) {
      register(name, {
        required: required ? 'Это поле обязательно' : false,
        validate: (value) => {
          if (required && !value) {
            return 'Это поле обязательно';
          }
          return true;
        },
      });

      if (value) {
        setFormValue(name, value, { shouldValidate: true });
      }
    }
  }, [isInForm, name, register, setFormValue, value, required]);

  // Отмечаем поле как тронутое при отправке формы
  useEffect(() => {
    if (isSubmitted) {
      setIsTouched(true);
    }
  }, [isSubmitted]);

  const CustomInput = forwardRef(({ onClick }, ref) => {
    const formatPeriodValue = (dates) => {
      if (!dates || !Array.isArray(dates)) return '';
      const [start, end] = dates;
      if (!start && !end) return '';
      return `${start ? formatDateWithOnlyDigits(start) : ''} - ${end ? formatDateWithOnlyDigits(end) : ''}`;
    };
    const [inputValue, setInputValue] = useState(
      period
        ? formatPeriodValue(value)
        : value
          ? formatDateWithOnlyDigits(value)
          : '',
    );

    useEffect(() => {
      if (period) {
        setInputValue(formatPeriodValue(value));
      } else if (value) {
        setInputValue(formatDateWithOnlyDigits(value));
      }
    }, [value, period]);

    const handleInputChange = (e) => {
      setInputValue(e.target.value);
      setIsTouched(true);
    };

    const handleClear = (e) => {
      e.stopPropagation(); // Предотвращаем открытие календаря
      setInputValue('');
      handleDateChange(null);
      if (datePickerRef.current) {
        datePickerRef.current.setOpen(false);
      }
    };

    const handleBlur = () => {
      setIsTouched(true);
      if (period) {
        // Проверяем, есть ли вообще значение для парсинга
        if (!inputValue || !inputValue.includes('-')) {
          setInputValue(formatPeriodValue(value));
          if (isInForm) {
            setFormValue(name, value, {
              shouldValidate: true,
              shouldTouch: true,
            });
          }
          return;
        }

        // Парсинг периода дат
        const [startStr, endStr] = inputValue.split('-').map((d) => d.trim());

        // Проверяем наличие обеих дат
        if (!startStr || !endStr) {
          setInputValue(formatPeriodValue(value));
          if (isInForm) {
            setFormValue(name, value, {
              shouldValidate: true,
              shouldTouch: true,
            });
          }
          return;
        }

        const startDate = parse(startStr, 'dd.MM.yyyy', new Date());
        const endDate = parse(endStr, 'dd.MM.yyyy', new Date());

        if (isValid(startDate) && isValid(endDate)) {
          handleDateChange([startDate, endDate]);
        } else {
          setInputValue(formatPeriodValue(value));
          if (isInForm) {
            setFormValue(name, value, {
              shouldValidate: true,
              shouldTouch: true,
            });
          }
        }
      } else {
        // Проверяем наличие значения для одиночной даты
        if (!inputValue) {
          setInputValue(value ? formatDateWithOnlyDigits(value) : '');
          if (isInForm) {
            setFormValue(name, value, {
              shouldValidate: true,
              shouldTouch: true,
            });
          }
          return;
        }

        const parsedDate = parse(inputValue, 'dd.MM.yyyy', new Date());
        if (isValid(parsedDate)) {
          handleDateChange(parsedDate);
        } else {
          setInputValue(value ? formatDateWithOnlyDigits(value) : '');
          if (isInForm) {
            setFormValue(name, value, {
              shouldValidate: true,
              shouldTouch: true,
            });
          }
        }
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleBlur();
        e.target.blur();
        datePickerRef.current.setOpen(false);
      }
    };

    return (
      <>
        <TextInput
          placeholder={placeholder ?? label ?? ''}
          icon={'calendar'}
          classWrap={styles.datepicker_wrapper}
          classInput={cn(styles.datepicker_input, {
            [styles.datepicker_input__placeholder]: !inputValue,
            [styles.error]: error,
          })}
          beforeIcon={
            value && canClose ? (
              <Icon
                name="close"
                size="16"
                className={styles.clearIcon}
                onClick={handleClear}
              />
            ) : null
          }
          onWheel={() => null}
          classLabel={styles.datepicker_label}
          value={inputValue ?? ''}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          edited={true}
          label={label}
          required={required}
          onClick={(e) => {
            setIsTouched(true);
            onClick(e);
          }}
          ref={ref}
          error={error}
        />
        {error && <div className={styles.errorMessage}>{error.message}</div>}
      </>
    );
  });

  const handleDateChange = (date) => {
    setIsTouched(true);

    if (isInForm) {
      setFormValue(name, date, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      trigger(name);
    }

    onChange(date);
  };

  return (
    <div className={cn(classNameContainer,{ [styles.hasError]: error })}>
      <DatePicker
        ref={datePickerRef}
        selected={period ? value?.[0] : value}
        startDate={period ? value?.[0] : null}
        endDate={period ? value?.[1] : null}
        selectsRange={period}
        dateFormat="dd.MM.yyyy"
        onChange={handleDateChange}
        customInput={<CustomInput />}
        locale={'ru'}
        {...props}
      />
    </div>
  );
};

export default Calendar;
