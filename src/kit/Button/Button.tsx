import { ComponentProps, FC, JSX, MouseEvent } from 'react';
import { bindStyles } from '@/utils';

import styles from './Button.module.scss';
import { ControlSize } from '@/types/size';
import { useNavigate } from 'react-router-dom';
import { Loader } from '@/kit/Loader';
import { IconTypes } from '@/kit';
import { ButtonIcon } from '@/kit/Button/ButtonIcon';

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

export type ButtonProps = ComponentProps<'button'> & {
  href?: string;
  variant?: ButtonVariant;
  size?: ControlSize;
  text?: string;
  isFullWidth?: boolean;
  isLoading?: boolean;
  isActive?: boolean;

  prefix?: IconTypes | JSX.Element;
  suffix?: IconTypes | JSX.Element;
};

const cx = bindStyles(styles);

export const Button: FC<ButtonProps> = ({
  className,
  variant = ButtonVariant.PRIMARY,
  size = ControlSize.MEDIUM,
  children,
  text,
  type = 'button',
  href,
  isActive,
  isFullWidth,
  onClick,
  isLoading,
  prefix,
  suffix,
  disabled,
  onMouseLeave,
  ...props
}) => {
  const navigate = useNavigate();
  const isDisabled = disabled ?? isLoading;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (href) {
      navigate(href);
    }

    onClick?.(e);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget?.blur();
    onMouseLeave?.(event);
  };

  return (
    <button
      type={type}
      className={cx(className, 'button', variant, size, { isFullWidth, isActive, isLoading })}
      onClick={handleClick}
      disabled={isDisabled}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {prefix && <ButtonIcon icon={prefix} />}
      {(text || children) && <div className={cx('text')}>{text ?? children}</div>}
      {suffix && <ButtonIcon icon={suffix} />}

      {isLoading && <Loader className={cx('loader')} />}
    </button>
  );
};
