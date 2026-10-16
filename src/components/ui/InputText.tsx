import clsx from 'clsx';
import { ChangeEvent, ClipboardEvent, ComponentPropsWithoutRef, ReactNode } from 'react';
import AsterikMandatory from './AsterikMandatory';

interface InputTextProps extends ComponentPropsWithoutRef<'input'> {
  label?: string;
  isError?: boolean;
  showLabel?: boolean;
  errorMessage?: string;
  errorPrefix?: string;
  sizeVariant?: 'xs' | 'sm' | 'base' | 'lg';
  id: string;
  value: string;
  name: string;
  placeholder?: string;
  variant?: 'default' | 'filled' | 'border-less';
  isSecondary?: boolean;
  disabled?: boolean;
  type?: string;
  prefixIcon?: ReactNode;
  suffxIcon?: ReactNode;
  onInputChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  isMandatory?: boolean;
  isAutocomplete?: string;
  onlyNumeric?: boolean;
  allowFloat?: boolean;
  inputStyles?: string;
  labelClassName?: string;
  inputClassName?: string;
}

/** Local stand-in for ui/InputText, same aegov-form-control contract. */
const InputText = ({
  label,
  isError,
  showLabel = true,
  sizeVariant = 'sm',
  errorPrefix = 'ERROR',
  errorMessage,
  value,
  name,
  id,
  isSecondary = false,
  placeholder,
  disabled,
  prefixIcon,
  suffxIcon,
  isMandatory = false,
  isAutocomplete = 'off',
  onInputChange = () => {},
  type = 'text',
  onlyNumeric = false,
  allowFloat = false,
  inputStyles,
  labelClassName,
  inputClassName,
  variant = 'default',
  className,
  ...rest
}: InputTextProps) => {
  const rootClassName = clsx(
    'aegov-form-control',
    sizeVariant && `control-${sizeVariant}`,
    isError && 'control-error',
    isSecondary && 'control-secondary',
  );

  const disabledFields = disabled || rest?.readOnly;

  const onlyNumerics = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey || event.metaKey) return;
    const allowedKeys = [
      'Backspace',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Enter',
      'Home',
      'End',
    ];
    if (allowFloat) allowedKeys.push('.');
    const isDigit = event.key >= '0' && event.key <= '9';
    if (!isDigit && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabledFields) return;
    let newValue = event.target.value;
    if (onlyNumeric) {
      newValue = newValue?.replace(/[^0-9.]/g, '');
      if (allowFloat) {
        newValue = newValue?.replace(/(\..*?)\..*/g, '$1');
        newValue = newValue?.replace(/^(\d+)(\.\d{0,2})?.*$/, '$1$2');
      } else {
        newValue = newValue?.replace(/\./g, '');
      }
    } else {
      newValue = newValue?.replace(/\s+/g, ' ').trimStart();
    }
    onInputChange({ ...event, target: { ...event.target, value: newValue } });
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    if (disabledFields) return;
    if (onlyNumeric) {
      const pastedText = event.clipboardData.getData('text');
      const regex = allowFloat ? /^\d+(\.\d{0,2})?$/ : /^\d+$/;
      if (!regex.test(pastedText)) {
        event.preventDefault();
      }
    }
  };

  return (
    <div className={clsx(rootClassName, className, inputClassName)}>
      {showLabel && label && (
        <label htmlFor={id} className={labelClassName}>
          <div className={labelClassName}>
            {label}
            {isMandatory ? <AsterikMandatory /> : null}
          </div>
        </label>
      )}
      <div className={clsx(`form-control-input input-${variant}`)}>
        {prefixIcon ? (
          <span className='control-prefix'>
            <div>{prefixIcon}</div>
          </span>
        ) : null}
        <input
          autoComplete={isAutocomplete}
          value={value}
          placeholder={placeholder}
          name={name}
          id={id}
          className={inputStyles}
          onChange={handleInputChange}
          type={type}
          aria-disabled={disabled}
          disabled={disabled}
          onKeyDown={onlyNumeric ? onlyNumerics : undefined}
          onPaste={handlePaste}
          {...rest}
        />
        {suffxIcon ? (
          <span className='control-suffix'>
            <div>{suffxIcon}</div>
          </span>
        ) : null}
      </div>
      {isError && errorMessage && errorMessage?.length > 0 ? (
        <span className='error-message'>
          {errorPrefix && <strong>{errorPrefix}</strong>} {errorMessage}
        </span>
      ) : null}
    </div>
  );
};

export default InputText;
