import { FC, PropsWithChildren, JSX } from 'react';
import { bindStyles } from '@/utils';

import styles from './ControllerWrapper.module.scss';
import { ControlSize } from '@/types';
import { IconTypes } from '@/kit';
import { ControllerIcon } from '@/kit/ControllerWrapper/ControllerIcon';

export type ControllerWrapperSharedProps = {
  caption?: string;
  description?: string;
  isError?: boolean;
  disabled?: boolean;
  errorText?: string;
  size?: ControlSize;

  prefix?: IconTypes | JSX.Element;
  suffix?: IconTypes | JSX.Element;
};

export type ControllerWrapperProps = PropsWithChildren<
  ControllerWrapperSharedProps & {
    className?: string;
    isFocused?: boolean;
  }
>;

const cx = bindStyles(styles);

export const ControllerWrapper: FC<ControllerWrapperProps> = ({
  className,
  caption,
  isError,
  errorText,
  disabled,
  isFocused,
  description,
  size = ControlSize.MEDIUM,
  prefix,
  suffix,
  children,
}) => {
  return (
    <label className={cx(className, 'controller-wrapper', size, { isFocused, isError, disabled })}>
      {caption && <div className={cx('caption')}>{caption}</div>}

      <div className={cx('controller-field')}>
        {prefix && <ControllerIcon icon={prefix} />}

        {children}

        {suffix && <ControllerIcon icon={suffix} />}
      </div>

      {description && <div className={cx('description')}>{description}</div>}
      {isError && errorText && <div className={cx('error')}>{errorText}</div>}
    </label>
  );
};
