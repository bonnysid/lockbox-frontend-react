import { ComponentProps, FC, FocusEvent, useState } from 'react';
import { bindStyles } from '@/utils';

import styles from './Textarea.module.scss';
import { ControllerWrapperSharedProps, ControllerWrapper } from '@/kit';

type TextareaProps = ControllerWrapperSharedProps & ComponentProps<'textarea'> & {};

const cx = bindStyles(styles);

export const Textarea: FC<TextareaProps> = ({
  size,
  suffix,
  prefix,
  description,
  isError,
  onFocus,
  onBlur,
  errorText,
  caption,
  disabled,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);

    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);

    onBlur?.(e);
  };

  return (
    <ControllerWrapper
      size={size}
      isError={isError}
      caption={caption}
      errorText={errorText}
      prefix={prefix}
      suffix={suffix}
      description={description}
      disabled={disabled}
      isFocused={isFocused}
    >
      <textarea className={cx('textarea')} disabled={disabled} onBlur={handleBlur} onFocus={handleFocus} {...props} />
    </ControllerWrapper>
  );
};
