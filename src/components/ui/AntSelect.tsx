import clsx from 'clsx';
import { hp } from 'src/utils/cssPrefix';
import { Select } from 'antd';
import { ReactNode } from 'react';
import AsterikMandatory from './AsterikMandatory';

export type SelectOption = { label: ReactNode; value: string | number };

interface AntSelectProps {
  id: string;
  name: string;
  label?: ReactNode;
  options: SelectOption[];
  value?: string | number | null;
  placeholder?: string;
  isError?: boolean;
  errorMessage?: string;
  errorPrefix?: string;
  sizeVariant?: 'xs' | 'sm' | 'base' | 'lg';
  isMandatory?: boolean;
  disabled?: boolean;
  allowClear?: boolean;
  mode?: 'multiple' | 'tags';
  onChange?: (value: string | number) => void;
}

/**
 * Local stand-in for ui/AntSelect: an antd Select inside the aegov form
 * control shell, so labels, sizing and error text match the other fields.
 */
const AntSelect = ({
  id,
  name,
  label,
  options,
  value,
  placeholder = 'Select',
  isError = false,
  errorMessage,
  errorPrefix = 'ERROR',
  sizeVariant = 'sm',
  isMandatory = false,
  disabled = false,
  allowClear = true,
  mode,
  onChange = () => {},
}: AntSelectProps) => {
  const rootClassName = clsx(
    'aegov-form-control',
    sizeVariant && `control-${sizeVariant}`,
    isError && 'control-error',
  );

  return (
    <div className={rootClassName} data-field={name}>
      {label && (
        <label htmlFor={id} className='!flex'>
          {label}
          {isMandatory ? <AsterikMandatory /> : null}
        </label>
      )}
      <Select
        id={id}
        className={hp('w-full')}
        size='large'
        status={isError ? 'error' : undefined}
        value={value === '' || value === undefined ? null : value}
        placeholder={placeholder}
        options={options}
        disabled={disabled}
        allowClear={allowClear}
        mode={mode}
        showSearch
        optionFilterProp='label'
        onChange={(next) => onChange(next)}
      />
      {isError && errorMessage && (
        <span className='error-message'>
          {errorPrefix && <strong>{errorPrefix}</strong>} {errorMessage}
        </span>
      )}
    </div>
  );
};

export default AntSelect;
