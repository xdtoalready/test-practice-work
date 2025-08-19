// components/FilterManager/index.jsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Radio from '../Radio';
import styles from './FilterManager.module.sass';
import ValuesSelector from '../Selector';
import Calendar from '../Datepicker';
import Dropdown from '../Dropdown/Default';
import Filters from '../Filter';
import { useFilters } from '../../providers/FilterProvider';
import Button from '../Button';
import TextInput from '../TextInput';

const FILTER_COMPONENTS = {
  radio: Radio,
  select: ValuesSelector,
  input: ValuesSelector,
  date: Calendar,
  dropdown: Dropdown,
  textInput: TextInput,
};

const FilterManager = ({
  filterConfig,
  onFilterChange,
  className,
  classNameBody,
  classNameTitle,
  title,
  hasFirstCall = true,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setFilters, setFilterValue, getFilterValue } = useFilters();
  const [pendingFilterValues, setPendingFilterValues] = useState({});
  const getInitialValues = useCallback(() => {
    const values = {};
    filterConfig.filters.forEach((filter) => {
      const paramValue = searchParams.get(filter.name);
      if (paramValue) {
        // Пробуем получить значение из контекста
        const savedValue = getFilterValue(filter.name);
        if (savedValue) {
          values[filter.name] = savedValue;
        } else {
          // Если в контексте нет - используем значение из URL как id
          // и ждем, когда компонент обновит значение при загрузке данных
          values[filter.name] = filter.decodeUrlValue
            ? filter.decodeUrlValue(paramValue)
            : paramValue;
        }
      } else if (filter.props?.defaultValue) {
        values[filter.name] = filter.props?.defaultValue;
      }
    });
    return values;
  }, [filterConfig, searchParams, getFilterValue]);

  const [filterValues, setFilterValues] = useState(getInitialValues);

  useEffect(() => {


    const initialValues = getInitialValues();
    if (Object.keys(initialValues).length > 0) {
      // Если это первый запрос, вызываем onFilterChange
      if (setFilters(initialValues) && hasFirstCall) {
        onFilterChange(initialValues);
      }
    }
  }, []);

  const clearConflictingGroupFilters = (
    currentFilter,
    newValues,
    updatedParams,
  ) => {
    if (!currentFilter.groupId) return newValues;

    const result = { ...newValues };

    filterConfig.filters.forEach((filter) => {
      if (!filter.groupId || filter.groupId === currentFilter.groupId) return;

      if (result[filter.name]) {
        result[filter.name] = null;
        updatedParams.delete(filter.name);
      }
    });

    return result;
  };

  const handleFilterChange = (name, value) => {
    const filter = filterConfig.filters.find((f) => f.name === name);
    if (filter.type === 'textInput') {
      value = value.currentTarget.value;
    }
    const isMulti = filter.props?.isMulti;
    // ;
    // setFilterValue(name, value);
    //
    const updatedParams = new URLSearchParams(searchParams);
    const urlValue = filter.toUrlValue ? filter.toUrlValue(value) : value;
    const paramToDelete = filter.onChange && filter.onChange(updatedParams);
    if (urlValue) {
      updatedParams.set(name, urlValue);
    } else {
      updatedParams.delete(name);
    }
    // // setSearchParams(updatedParams);
    //
    // let newValues = {
    //   ...filterValues,
    //   [name]: value,
    //   [paramToDelete]: null,
    // };
    // newValues = clearConflictingGroupFilters(filter, newValues, updatedParams);
    // setSearchParams(updatedParams);
    // setFilterValues(newValues);
    // setFilters(newValues);
    setFilterValue(name, value);

    let newValues = {
      ...filterValues,
      [name]: value,
    };
    newValues = clearConflictingGroupFilters(filter, newValues, updatedParams);

    // Обновляем состояние фильтров, но URL не изменяется
    setFilterValues(newValues);
    setFilters(newValues);
  };

  const handleApplyFilters = () => {
    // const newValues = { ...filterValues, ...pendingFilterValues };
    //
    // setFilterValues(newValues);
    // setFilters(newValues);
    //
    // onFilterChange({ ...newValues, isSubmit: 1 });
    //
    // setPendingFilterValues({});
    const newValues = { ...filterValues, ...pendingFilterValues };

    setFilterValues(newValues);
    setFilters(newValues);

    // Теперь вызываем изменение URL
    const updatedParams = new URLSearchParams(searchParams);
    // Проходим по фильтрам и обновляем или удаляем параметры URL
    filterConfig.filters.forEach((filter) => {
      if (newValues.hasOwnProperty(filter.name)) {
        const value = newValues[filter.name];

        const urlValue =
          filter.toUrlValue && value ? filter.toUrlValue(value) : value;

        if (urlValue) {
          updatedParams.set(filter.name, urlValue);
        } else {
          updatedParams.delete(filter.name);
        }
      }
    });

    // Обновляем URL с новыми значениями фильтров
    setSearchParams(updatedParams);

    // Вызываем onFilterChange, передавая итоговые значения фильтров
    onFilterChange({ ...newValues, isSubmit: 1 });

    // Сбрасываем отложенные значения фильтров
    setPendingFilterValues({});
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());

    const resetValues = {};
    filterConfig.filters.forEach((filter) => {
      if (filter.props?.defaultValue) {
        resetValues[filter.name] = filter.props.defaultValue;
      }
    });

    setFilterValues(resetValues);
    setFilters(resetValues);

    onFilterChange({ ...resetValues, isSubmit: 0 });

    setPendingFilterValues({});
  };

  const renderFilter = (filterConfig) => {
    const { type, component, props = {}, name, ...rest } = filterConfig;
    const FilterComponent = component || FILTER_COMPONENTS[type];

    if (!FilterComponent) return null;

    if (type === 'radio') {
      return (
        rest?.options &&
        rest?.options.map((option) => (
          <Radio
            key={option.value}
            className={styles.radioOption}
            name={name}
            content={option.label}
            value={filterValues[name] === option.value}
            onChange={() => handleFilterChange(name, option.value)}
          />
        ))
      );
    }

    return (
      <FilterComponent
        key={name}
        {...props}
        {...rest}
        name={name}
        value={filterValues[name]}
        onChange={(value) => handleFilterChange(name, value)}
        placeholder={rest.label}
        label={''}
      />
    );
  };

  const filtersContent = (
    <div className={styles.filtersContent}>
      {filterConfig.filters.map(renderFilter)}
      <div className={styles.filterActions}>
        <Button
          name={'Применить'}
          onClick={handleApplyFilters}
          className={styles.applyButton}
        />

        <Button
          type={'secondary'}
          name={'Сбросить'}
          onClick={handleResetFilters}
          className={styles.resetButton}
        />
      </div>
    </div>
  );

  return (
    <Filters
      className={className}
      classNameBody={classNameBody}
      classNameTitle={classNameTitle}
      title={title}
    >
      {filtersContent}
    </Filters>
  );
};

export default FilterManager;
