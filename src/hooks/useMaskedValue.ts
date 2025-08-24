import { useCallback, useMemo } from 'react';

import { useMask, UseMaskProps } from './useMask';

export type UseMaskedValueProps = UseMaskProps & {
  value: string;
};

export const useMaskedValue = ({ value, mask, markSymbol }: UseMaskedValueProps) => {
  const { clean, apply } = useMask({ mask, markSymbol });

  const cleanNewValue = useCallback(
    (newValue: string) => {
      if (!mask) {
        return newValue;
      }

      return clean(newValue);
    },
    [clean, mask],
  );

  const formatValue = useCallback((newValue: string) => apply(newValue), [apply]);

  const formattedValue = useMemo(() => apply(value), [apply, value]);

  return {
    formattedValue,
    cleanNewValue,
    formatValue,
  };
};
