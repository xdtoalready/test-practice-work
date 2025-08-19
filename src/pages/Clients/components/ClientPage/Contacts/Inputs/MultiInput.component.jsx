import React, { useMemo } from 'react';
import MultiInputLabeled from '../../../../../../shared/Input/MultiLabeled/MultiLabeledInputs';
import CardInput from '../../../../../../shared/Input/Card';

const MultiInputContacts = ({
  onActions,
  contactData,
  param,
  label,
  type,
  onAdd,
  ...rest
}) => {
  const length = useMemo(
    () => Object.keys(contactData[param] ?? {}).length,
    [contactData],
  );

  return (
    <MultiInputLabeled
      label={label}
      onAdd={() => onAdd(`contactData.${param}.${length}`)}
    >
      {Object.entries(contactData[param] ?? {}).map(([key, value], index) => {
        const actions = onActions(`contactData.${param}.${key}`);
        return (
          <CardInput
            placeholder={label}
            multiple={true}
            label={label}
            name={`contactData.${param}.${key}`}
            type={type}
            value={value}
            actions={actions}
            {...rest}
          />
        );
      })}
    </MultiInputLabeled>
  );
};

export default MultiInputContacts;
