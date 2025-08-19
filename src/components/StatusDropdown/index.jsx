import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import styles from '../../shared/Dropdown/Default/Dropdown.module.sass';
import Dropdown from '../../shared/Dropdown/Default';

const StatusDropdown = ({ statuses, value, onChange, name, required }) => {
  const options = useMemo(() => {
    return Object.entries(statuses).map(
      ([key, { status, class: className }]) => ({
        key,
        label: status,
        className,
      }),
    );
  }, [statuses]);

  const dropdownOptions = options.map((opt) => `${opt.label}#${opt.key}`);

  return (
    <Dropdown
      name={name ?? ''}
      required={required ?? false}
      classNameContainer={cn(styles.statusDropdown, styles[value?.class])}
      classDropdownHead={value?.class}
      options={dropdownOptions}
      value={value?.status}
      renderOption={(opt) => opt.split('#')[0]} // Отображаем только название статуса
      setValue={(e) => {
        const selectedKey = e.split('#')[1];
        const selectedOption = options.find((opt) => opt.key === selectedKey);
        onChange(selectedOption);
      }}
    />
  );
};

export default StatusDropdown;
