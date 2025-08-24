import { FC } from 'react';

import { HiddenControl, HiddenControlProps } from '../HiddenControl';
import { Icon } from '@/kit';

export type InputControlsSharedProps = {
  isCanBeHidden?: boolean;
  isClearable?: boolean;
};

export type InputControlsProps = HiddenControlProps &
  InputControlsSharedProps & {
    onClear?: () => void;
    hasValue?: boolean;
  };

export const InputControls: FC<InputControlsProps> = ({
  isCanBeHidden,
  isHidden,
  hide,
  reveal,
  hasValue,
  onClear,
  isClearable,
}) => {
  if (isCanBeHidden) {
    return <HiddenControl isHidden={isHidden} reveal={reveal} hide={hide} />;
  }

  if (onClear && hasValue && isClearable) {
    return <Icon type="close" onClick={onClear} />;
  }

  return null;
};
