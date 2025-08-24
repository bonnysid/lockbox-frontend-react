import { useCallback } from 'react';

import { isUndefinedOrNull } from '@/utils';

export type UseMaskProps = {
  mask?: string;
  markSymbol?: string;
};

export type UseMaskFunctionProps = UseMaskProps & {
  value: string;
};

export const MASK_MARK_SYMBOL_DEFAULT = 'X';

const findBracketsContent = (mask: string) => {
  const bracketPattern = /\[(.*?)\]/;
  const match = mask.match(bracketPattern);

  return match;
};

export const applyMask = ({ mask, markSymbol = MASK_MARK_SYMBOL_DEFAULT, value }: UseMaskFunctionProps): string => {
  if (!mask) {
    return value;
  }

  let formatted = '';
  let valueIndex = 0;

  for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
    const maskSymbol = mask[i];
    const valueSymbol = value[valueIndex];

    if (['[', ']'].includes(maskSymbol)) {
      continue;
    }

    if (maskSymbol === markSymbol || maskSymbol === valueSymbol) {
      formatted += valueSymbol;
      valueIndex++;
    } else {
      formatted += maskSymbol;
    }
  }

  return formatted;
};

export const cleanMask = ({ mask, markSymbol = MASK_MARK_SYMBOL_DEFAULT, value }: UseMaskFunctionProps) => {
  if (!mask) {
    return value;
  }

  let cleanedValue = '';
  let valueIndex = 0;
  const bracketContent = findBracketsContent(mask);

  for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
    const maskSymbol = mask[i];
    const valueSymbol = value[valueIndex];
    const inBrackets =
      bracketContent && !isUndefinedOrNull(bracketContent.index) && bracketContent.index <= i && i <= bracketContent.length;

    if (['[', ']'].includes(maskSymbol)) {
      continue;
    }

    if (inBrackets && maskSymbol !== valueSymbol) {
      cleanedValue += maskSymbol;
    } else if (maskSymbol === markSymbol || (inBrackets && maskSymbol === valueSymbol)) {
      cleanedValue += valueSymbol;
      valueIndex++;
    } else if (valueSymbol === maskSymbol) {
      valueIndex++;
    }
  }

  return cleanedValue;
};
export const useMask = ({ mask, markSymbol = MASK_MARK_SYMBOL_DEFAULT }: UseMaskProps) => {
  const apply = useCallback((value: string) => applyMask({ mask, markSymbol, value }), [mask, markSymbol]);

  const clean = useCallback((value: string) => cleanMask({ mask, markSymbol, value }), [mask, markSymbol]);

  return { apply, clean };
};
