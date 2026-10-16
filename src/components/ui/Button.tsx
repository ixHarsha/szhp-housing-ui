import { ReactNode, ButtonHTMLAttributes } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  styleVariant?: 'outline' | 'soft' | 'link' | 'secondary' | '';
  sizeVariant?: 'xs' | 'base' | 'sm' | 'lg';
  iconOnly?: boolean;
  className?: string;
};

/**
 * Local stand-in for ui/Button. Same aegov class contract and the same
 * styleVariant / sizeVariant / iconOnly props; the host-only pieces (login
 * configuration, active-task modal, unauth events) are left out because this
 * app runs standalone rather than inside the shell.
 */
const Button = ({
  children,
  styleVariant,
  sizeVariant = 'sm',
  className = '',
  iconOnly = false,
  disabled = false,
  onClick,
  ...restProps
}: ButtonProps) => {
  const styleClass = styleVariant ? `btn-${styleVariant}` : '';
  const sizeClass = sizeVariant ? `btn-${sizeVariant}` : '';
  const iconButton = iconOnly ? 'btn-icon' : '';
  const classNames = `aegov-btn ${styleClass} ${iconButton} ${sizeClass} ${className}`;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
    } else if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      disabled={disabled}
      aria-label={typeof children === 'string' ? children : undefined}
      aria-disabled={disabled}
      className={classNames.trim()}
      onClick={handleClick}
      style={disabled ? { pointerEvents: 'none' } : {}}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;
