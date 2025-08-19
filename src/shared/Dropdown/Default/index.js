import React, { useRef, useState, useEffect } from 'react';
import cn from 'classnames';
import styles from './Dropdown.module.sass';
import Tooltip from '../../Tooltip';
import useOutsideClick from '../../../hooks/useOutsideClick';
import Chevron from './Chevron';
import Loader from '../../Loader';
import { useFormContext, get } from 'react-hook-form';

const Dropdown = ({
  className,
  classNameContainer,
  classDropdownHead,
  classDropdownLabel,
  value,
  setValue,
  options: initialOptions,
  label,
  tooltip,
  small,
  upBody,
  renderOption,
  noMinWidth,
  placeholder,
  renderValue,
  asyncSearch,
  isAsync = false,
  isSearchable = false,
  refInputValue,
  onInputChange,
  onSearch,
  name,
  required,
  minAsyncInput = 4,
  onKeyDown,
    onBlur,
  ...props
}) => {
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState(refInputValue || '');
  const [options, setOptions] = useState(initialOptions);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isTouched, setIsTouched] = useState(false);

  const ref = useRef(null);
  const inputRef = useRef(null);

  const handleOpen = (e) => {
    if (!isAsync) {
      setVisible((prev)=>{
        return !visible
      });
    }
    if (!isTouched) {
      setIsTouched(true);
    }
  };

  useOutsideClick(ref, () => {
    setVisible(false);

  });


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

  const { ref: hiddenInputRef, ...registerProps } = isInForm
    ? register(name, {
        required: required ? 'Это поле обязательно' : false,
        validate: (value) => {
          if (required && !value) {
            return 'Это поле обязательно';
          }
          return true;
        },
      })
    : { ref: () => {}, ...{} };

  const error =
    isInForm && (isTouched || isSubmitted) ? get(errors, name) : null;

  useEffect(() => {
    if (refInputValue !== undefined) {
      setInputValue(inputValue);
    }
  }, [inputValue]);
  const shouldShowOptions = isAsync
    ? visible && inputValue.length >= minAsyncInput
    : visible;
  useEffect(() => {
    if (isSubmitted) {
      setIsTouched(true);
    }
  }, [isSubmitted]);
  // При изменении value обновляем значение в форме

  useEffect(() => {
    if (isInForm && value !== undefined) {
      setFormValue(name, value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [isInForm, name, value, setFormValue]);

  useEffect(() => {
    if (!isAsync && !isSearchable) {
      setOptions(initialOptions);
    } else if (initialOptions && initialOptions.length) {
      setOptions(initialOptions);
    }
  }, [initialOptions, isAsync, isSearchable]);

  // Effect для async value
  useEffect(() => {
    if (isAsync) {
      setInputValue(renderValue ? renderValue(value) : value);
    }
  }, [value, isAsync, renderValue]);

  const handleClick = (selectedValue) => {
    setValue(selectedValue);
    setVisible(false);
    setIsTouched(true);
    if (isAsync || isSearchable) {
      setInputValue(renderValue ? renderValue(selectedValue) : selectedValue);
    }

    if (isInForm) {
      setFormValue(name, selectedValue, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      trigger(name);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (isAsync) {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      if (value.length >= minAsyncInput) {
        setLoading(true);
        const newTimeout = setTimeout(async () => {
          try {
            const results = await asyncSearch(value);

            setOptions(results);
          } catch (error) {
            console.error('Search error:', error);
            setOptions([]);
          } finally {
            setLoading(false);
          }
        }, 100);

        setSearchTimeout(newTimeout);
      } else {
        setOptions([]);
      }
    } else if (isSearchable && onSearch) {
      onSearch(value);
    } else if (isSearchable && onInputChange) {
      onInputChange(value);
    }
  };

  const renderHead = () => {
    if (isAsync || isSearchable) {
      return (
        <input
          ref={inputRef}
          type="text"
          className={cn(styles.input, {
            [styles.input_placeholder]: !inputValue,
            [styles.errorInput]: error,
          })}
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder ?? label ?? ''}
          onKeyDown={onKeyDown}
          onBlur={(e)=>{
            if (onBlur && e.target.value && e.target.value !== '') {
              onBlur(setInputValue)
            }

          }}
          onClick={() => setVisible(true)}
        />
      );
    }

    return (
      <div
        className={cn(styles.selection, {
          [styles.selection_placeholder]: !value,
          [styles.errorInput]: error,
        })}
      >
        {value
          ? renderValue
            ? renderValue(value)
            : value
          : placeholder ?? label ?? ''}
      </div>
    );
  };

  return (
    <div
      ref={ref}
      className={cn(classNameContainer, {
        [styles.noMinWidth]: noMinWidth,
        [styles.hasError]: error,
        [styles.disabled]: props.disabled,
      })}
      onBlur={() => setIsTouched(true)}
    >
      {/* Скрытый input для работы с формой */}
      {isInForm && (
        <input
          type="hidden"
          {...registerProps}

          ref={(e) => {
            hiddenInputRef(e);
          }}
          value={value || ''}
          name={name}
        />
      )}

      {label && (
        <div className={cn(styles.label, classDropdownLabel)}>
          {label}
          {required && <span className={styles.required}>*</span>}
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
      <div
        className={cn(
          styles.dropdown,
          className,
          { [styles.small]: small },
          { [styles.active]: visible },
          { [styles.error]: error },
        )}
      >
        <div
          className={cn(styles.head, classDropdownHead, {
            [styles.head_placeholder]:
              isAsync || isSearchable ? !inputValue : !value,
          })}
          onClick={(e)=>handleOpen(e)}
        >
          {renderHead()}
          <Chevron direction={''} isOpen={visible} />
        </div>
        {shouldShowOptions && (
          <div className={cn(styles.body, { [styles.bodyUp]: upBody })}>
            {loading ? (
              <div className={styles.loader_container}>
                <Loader />
              </div>
            ) : options?.length ? (
              options.map((option, index) => (
                <div
                  className={cn(styles.option, {
                    [styles.selectioned]: option === value,
                  })}
                  onClick={() => handleClick(option, index)}
                  key={index}
                >
                  {renderOption ? renderOption(option) : option}
                </div>
              ))
            ) : (
              <p className={styles.noOptions}>Нет опций для выбора</p>
            )}
          </div>
        )}
      </div>
      {error && isTouched && (
        <div className={styles.errorMessage}>{error.message}</div>
      )}
    </div>
  );
};

Dropdown.displayName = 'Dropdown';

export default Dropdown;
