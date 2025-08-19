import React, { useState, useEffect, useRef } from 'react';
import Dropdown from '../../shared/Dropdown/Default';

const TimeDropdown = ({
  className,
  small,
  validationRules,
  value: externalValue,
  onChange,
  label,
  placeholder,
  disabled,
    required=false,
}) => {
  const [internalValue, setInternalValue] = useState(externalValue || null);
  const [inputValue, setInputValue] = useState(externalValue || '');
  const [error, setError] = useState('');
  const [lastKeyPressRef] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [dynamicOptions, setDynamicOptions] = useState([]);

  // Генерируем предопределенные варианты времени от 8:00 до 23:45 с шагом 5 минут
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        times.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  useEffect(() => {
    // Инициализация отфильтрованных опций
    setFilteredOptions(timeOptions);
  }, []);

  const findClosestTime = (input) => {
    if (!input) return null;

    // Очищаем ввод от нецифр
    const cleaned = input.replace(/[^0-9]/g, '');

    // Если ввод уже в формате времени (с двоеточием)
    if (input.includes(':')) {
      const [hoursStr, minutesStr] = input.split(':');
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);

      if (isNaN(hours) || isNaN(minutes)) return null;

      // Ищем точное совпадение
      const exactMatch = timeOptions.find(opt => opt === input);
      if (exactMatch) return exactMatch;

      // Ищем ближайшее время
      const paddedHours = hoursStr.padStart(2, '0');
      const paddedMinutes = minutesStr.padStart(2, '0');
      const partialMatch = timeOptions.find(opt =>
          opt.startsWith(`${paddedHours}:${paddedMinutes.substring(0, 1)}`)
      );
      return partialMatch || null;
    }

    // Обработка числового ввода без двоеточия
    if (/^\d+$/.test(cleaned)) {
      // Если ввели 1-2 цифры - считаем это часами
      if (cleaned.length <= 2) {
        const hours = parseInt(cleaned, 10);
        if (hours >= 0 && hours <= 23) {
          return timeOptions.find(opt => opt.startsWith(`${hours.toString().padStart(2, '0')}:`));
        }
      }
      // Если ввели 3 цифры - первые 1 цифра часы, остальные минуты
      else if (cleaned.length === 3) {
        const hours = parseInt(cleaned.substring(0, 1), 10);
        const minutes = parseInt(cleaned.substring(1), 10);
        const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
        return timeOptions.find(opt => opt === formattedTime) ||
            timeOptions.find(opt => opt.startsWith(`${hours}:`));
      }
      // Если ввели 4 цифры - первые 2 цифры часы, остальные минуты
      else if (cleaned.length >= 4) {
        const hours = parseInt(cleaned.substring(0, 2), 10);
        const minutes = parseInt(cleaned.substring(2, 4), 10);
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        return timeOptions.find(opt => opt === formattedTime) ||
            timeOptions.find(opt => opt.startsWith(`${hours.toString().padStart(2, '0')}:`));
      }
    }

    return null;
  };

  // Обработчик потери фокуса
  const handleBlur = (setter) => {
    if (!inputValue) return;


    const closestTime = formatTimeInput(inputValue);

    if (closestTime) {
      handleTimeChange(closestTime)
      setter(closestTime)
    } else {
      setInternalValue(null);
      setInputValue('');
      setError('Неверный формат времени');
      if (onChange) onChange(null);
    }
  };


  // Функция для форматирования числового ввода в время
  const formatTimeInput = (input) => {
    // Очистка от нецифр
    const cleaned = input.replace(/[^0-9]/g, '');

    // Распознавание различных форматов ввода
    if (cleaned.length === 3) {
      // Формат: "123" -> "1:23"
      const hours = parseInt(cleaned.substring(0, 1), 10);
      const minutes = parseInt(cleaned.substring(1), 10);

      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
      }
    } else if (cleaned.length === 4) {
      // Формат: "1234" -> "12:34"
      const hours = parseInt(cleaned.substring(0, 2), 10);
      const minutes = parseInt(cleaned.substring(2), 10);

      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    } else if (cleaned.length === 1 || cleaned.length === 2) {
      // Формат: "8" -> "8:00" или "12" -> "12:00"
      const hours = parseInt(cleaned, 10);

      if (hours >= 0 && hours <= 23) {
        return `${hours}:00`;
      }
    }

    // Если не удалось распознать, возвращаем исходное значение
    return input;
  };

  // Функция для проверки соответствия временному формату
  const validateTimeFormat = (time) => {
    // Применяем правила валидации
    const defaultRules = {
      minHour: 8,
      maxHour: 23,
      allowAnyMinute: true,
    };

    const rules = { ...defaultRules, ...validationRules };

    if (!time) return { isValid: false, error: '' };

    // Проверяем, соответствует ли формат HH:MM
    const timeRegex = /^(\d{1,2}):([0-5][0-9])$/;
    const match = time.match(timeRegex);

    if (!match) {
      return { isValid: false, error: 'Неверный формат времени' };
    }

    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);

    // Проверяем часы
    if (hours < rules.minHour) {
      return {
        isValid: false,
        error: `Время должно быть не раньше ${rules.minHour}:00`,
      };
    }

    if (hours > rules.maxHour) {
      return {
        isValid: false,
        error: `Время должно быть не позже ${rules.maxHour}:59`,
      };
    }

    // Проверяем минуты на кратность, если требуется
    if (!rules.allowAnyMinute && minutes % 15 !== 0) {
      return {
        isValid: false,
        error: 'Минуты должны быть кратны 15 (00, 15, 30, 45)',
      };
    }

    return { isValid: true, error: '' };
  };

  // Обработка ввода в поле
  const handleInputChange = (newValue) => {
    // Обновляем значение ввода
    setInputValue(newValue);

    if (!newValue || newValue.trim() === '') {
      // Для пустого ввода показываем все опции
      setFilteredOptions(timeOptions);
      setDynamicOptions([]);
      setInternalValue(null);
      setError('');
      if (onChange) onChange(null);
      return;
    }

    // Очищаем от недопустимых символов (оставляем только цифры и двоеточие)
    const cleanedValue = newValue.replace(/[^0-9:]/g, '');

    // Создаем динамическую опцию - отформатированное время
    let dynamicOption = null;
    let shouldShowDynamic = false;

    // Если ввод уже в формате времени, используем его напрямую
    if (cleanedValue.includes(':')) {
      const validation = validateTimeFormat(cleanedValue);
      if (validation.isValid) {
        dynamicOption = cleanedValue;
        shouldShowDynamic = true;
      } else {
        setError(validation.error);
      }
    }
    // Если ввод - только цифры, пробуем отформатировать
    else if (/^\d+$/.test(cleanedValue)) {
      const formattedTime = formatTimeInput(cleanedValue);
      if (formattedTime !== cleanedValue) {
        const validation = validateTimeFormat(formattedTime);
        if (validation.isValid) {
          dynamicOption = formattedTime;
          shouldShowDynamic = true;
          setError('');
        } else {
          setError(validation.error);
        }
      }
    }

    // Фильтруем стандартные опции, включая поиск по цифрам
    let filtered = timeOptions.filter((time) => {
      // Проверяем совпадение по отформатированному времени
      const timeWithoutColon = time.replace(':', '');
      return (
        time.startsWith(cleanedValue) ||
        timeWithoutColon.startsWith(cleanedValue)
      );
    });

    // Если у нас есть динамическая опция и её нет в отфильтрованных, добавляем
    if (shouldShowDynamic && dynamicOption) {
      const dynamicExists = filtered.includes(dynamicOption);

      if (!dynamicExists) {
        setDynamicOptions([dynamicOption]);

        // Выводим динамическую опцию первой
        filtered = [
          dynamicOption,
          ...filtered.filter((opt) => opt !== dynamicOption),
        ];
      } else {
        setDynamicOptions([]);
      }
    } else {
      setDynamicOptions([]);
    }

    setFilteredOptions(filtered);
  };

  // Обработка выбора из выпадающего списка
  const handleTimeChange = (time) => {
    if (!time) {
      setInternalValue(null);
      setInputValue('');
      setError('');
      if (onChange) onChange(null);
      return;
    }


    const validation = validateTimeFormat(time);

    if (validation.isValid) {
      setInternalValue(time);
      setInputValue(time);
      setError('');
      if (onChange) onChange(time);
    } else {
      setInternalValue(null);
      setInputValue(time);
      setError(validation.error);
      if (onChange) onChange(null);
    }
  };

  // Обработка нажатия клавиш
  const handleKeyDown = (event) => {
    // Разрешаем: цифры, двоеточие, стрелки, Tab, Enter, Backspace, Delete
    const allowedKeys = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      ':',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Tab',
      'Enter',
      'Backspace',
      'Delete',
      'Home',
      'End',
    ];

    // Если нажата клавиша не из разрешенного списка - отменяем ввод
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }

    // Предотвращаем ввод второго двоеточия
    if (event.key === ':' && inputValue.includes(':')) {
      event.preventDefault();
    }
  };

  // Синхронизация с внешним значением
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== internalValue) {
      if (!externalValue) {
        setInternalValue(null);
        setInputValue('');
        setError('');
      } else {
        const validation = validateTimeFormat(externalValue);
        if (validation.isValid) {
          setInternalValue(externalValue);
          setInputValue(externalValue);
          setError('');
        }
      }
    }
  }, [externalValue]);

  // Объединяем динамические опции и отфильтрованные стандартные опции
  const combinedOptions = [...new Set([...dynamicOptions, ...filteredOptions])];

  return (
    <Dropdown
        name={'timeDropdown'}
        required={required}
      disabled={disabled}
      value={internalValue}
      setValue={handleTimeChange}
      options={combinedOptions}
      label={label}
      renderOption={(time) => time}
      renderValue={(time) => time || ''}
      placeholder={placeholder || 'Выберите время'}
      classNameContainer={className}
      small={small}
      error={error}
      // Используем searchable вместо async
        onBlur={handleBlur}
      isAsync={false}
      isSearchable={true}
      refInputValue={inputValue}
      onInputChange={handleInputChange}
      onSearch={handleInputChange}
      onKeyDown={handleKeyDown}
    />
  );
};

TimeDropdown.displayName = 'TimeDropdown';

export default TimeDropdown;
