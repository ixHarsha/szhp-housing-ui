import clsx from 'clsx';
import { hp } from 'src/utils/cssPrefix';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { ReactNode } from 'react';
import AsterikMandatory from './AsterikMandatory';

interface DatePickerInputProps {
  id: string;
  name: string;
  label?: ReactNode;
  value?: string | null;
  format?: string;
  placeholder?: string;
  isError?: boolean;
  errorMessage?: string;
  errorPrefix?: string;
  sizeVariant?: 'xs' | 'sm' | 'base' | 'lg';
  isMandatory?: boolean;
  disabled?: boolean;
  disabledDate?: (date: dayjs.Dayjs) => boolean;
  onChange?: (value: string | null) => void;
}

/**
 * Local stand-in for ui/DatePickerInput. Values are exchanged as
 * YYYY-MM-DD strings so the form state stays serialisable.
 */
const DatePickerInput = ({
  id,
  name,
  label,
  value,
  format = 'DD/MM/YYYY',
  placeholder = 'Select date',
  isError = false,
  errorMessage,
  errorPrefix = 'ERROR',
  sizeVariant = 'sm',
  isMandatory = false,
  disabled = false,
  disabledDate,
  onChange = () => {},
}: DatePickerInputProps) => {
  const rootClassName = clsx(
    'aegov-form-control',
    sizeVariant && `control-${sizeVariant}`,
    isError && 'control-error',
  );

  return (
    <div className={rootClassName}>
      {label && (
        <label htmlFor={id} className='!flex'>
          {label}
          {isMandatory ? <AsterikMandatory /> : null}
        </label>
      )}
      <DatePicker
        id={id}
        name={name}
        className={hp('w-full')}
        size='large'
        status={isError ? 'error' : undefined}
        value={value ? dayjs(value) : null}
        format={format}
        placeholder={placeholder}
        disabled={disabled}
        disabledDate={disabledDate}
        onChange={(date) => onChange(date ? date.format('YYYY-MM-DD') : null)}
      />
      {isError && errorMessage && (
        <span className='error-message'>
          {errorPrefix && <strong>{errorPrefix}</strong>} {errorMessage}
        </span>
      )}
    </div>
  );
};

export default DatePickerInput;
