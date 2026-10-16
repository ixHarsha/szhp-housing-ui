import { useEffect, useState } from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onToggle?: (checked: boolean) => void;
  isChecked: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  label?: React.ReactNode;
}

/** Local stand-in for ui/Checkbox, same aegov-check-item contract. */
const Checkbox = ({
  onToggle,
  isChecked,
  disabled,
  id,
  label,
  className = '',
  ...rest
}: CheckboxProps) => {
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handleChecked = () => {
    const newCheckedState = !checked;
    setChecked(newCheckedState);
    if (onToggle) {
      onToggle(newCheckedState);
    }
  };

  return (
    <div className={`aegov-check-item ${className}`}>
      <input
        type='checkbox'
        id={id}
        className='hover:!shadow-none hover:!ring-0 hover:!transition-none'
        checked={checked}
        onChange={handleChecked}
        disabled={disabled}
        {...rest}
      />
      {label && <label htmlFor={id}>{label}</label>}
    </div>
  );
};

export default Checkbox;
