import { FC, useState, FocusEvent, ComponentProps, useMemo, KeyboardEvent, ChangeEvent, useEffect } from 'react';
import { bindStyles } from '@/utils';

import styles from './Input.module.scss';
import { ControllerWrapper, ControllerWrapperSharedProps } from '@/kit';
import { SharedFormatterValueFunctionSettings, useFormatter, useHidden, useValueRules, ValueRules } from './hooks';
import { InputControls, InputControlsSharedProps } from './components';
import { InputType } from './types';
import { useMaskedValue, UseMaskProps } from '@/hooks';

export type InputProps = ControllerWrapperSharedProps &
  InputControlsSharedProps &
  ValueRules &
  UseMaskProps &
  SharedFormatterValueFunctionSettings &
  Omit<ComponentProps<'input'>, 'type' | 'size' | 'onChange'> & {
    type?: InputType;
    isAllowSpaces?: boolean;
    isTrimOnBlur?: boolean;
    onChange?: (value?: string) => void;
  };

const TYPE_BY_TYPE: Partial<Record<InputType, string>> = {
  number: 'text',
};

const ALLOWED_SPACES_BY_TYPE: Record<InputType, boolean> = {
  tel: false,
  number: false,
  search: true,
  email: false,
  password: false,
  text: true,
};

const cx = bindStyles(styles);

export const Input: FC<InputProps> = ({
  caption,
  size,
  isError,
  errorText,
  prefix,
  suffix,
  description,
  disabled,
  onBlur,
  type = 'text',
  isAllowSpaces,
  isTrimOnBlur,
  isCanBeHidden,
  isClearable,
  onFocus,
  onChange,
  onKeyDown,
  mask,
  markSymbol,
  value,
  maxLength,
  isAllowNegative,
  withThousandSeparator,
  decimals,
  ...props
}) => {
  const { formattedValue: formattedValueMask, cleanNewValue } = useMaskedValue({
    mask,
    markSymbol,
    value: String(value),
  });
  const { isHidden, hide, reveal } = useHidden({ type: type as InputType });
  const [isFocused, setIsFocused] = useState(false);
  const { formatter, cleaner } = useFormatter({ type });
  const { applyRules } = useValueRules({
    type,
    cleaner,
  });
  const isAllowedSpace = isAllowSpaces ?? ALLOWED_SPACES_BY_TYPE[type as InputType];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      let newValue = applyRules({
        value: e.target.value,
        maxLength,
        isAllowNegative,
        decimals,
      });

      newValue = cleanNewValue(newValue);

      onChange(newValue);
    }
  };

  const handleClear = () => {
    onChange?.('');
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);

    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);

    if (isTrimOnBlur && onChange) {
      onChange(String(value).trim());
    }

    onBlur?.(e);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const isSpace = e.code === 'Space';

    if (isSpace && !isAllowedSpace) {
      e.preventDefault();
    }

    onKeyDown?.(e);
  };

  const currentType = useMemo(() => {
    if (isHidden) {
      return 'password';
    }

    if (type !== 'password') {
      return TYPE_BY_TYPE[type] || type;
    }

    return 'text';
  }, [type, isHidden]);

  const formattedValue = useMemo(
    () =>
      formatter({
        value: formattedValueMask,
        withThousandSeparator,
      }),
    [formattedValueMask, withThousandSeparator, formatter],
  );

  useEffect(() => {
    if (onChange) {
      let newValue = applyRules({
        value: String(value),
        maxLength,
        isAllowNegative,
        decimals,
      });

      newValue = cleanNewValue(newValue);

      onChange(newValue);
    }
  }, [mask]);

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
      <input
        type={currentType}
        className={cx('input')}
        disabled={disabled}
        value={formattedValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        {...props}
      />

      <InputControls
        hide={hide}
        reveal={reveal}
        isHidden={isHidden}
        isCanBeHidden={isCanBeHidden}
        isClearable={isClearable}
        onClear={handleClear}
        hasValue={Boolean(value)}
      />
    </ControllerWrapper>
  );
};
