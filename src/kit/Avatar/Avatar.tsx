import { FC, useMemo } from 'react';

import { bindStyles, getRadixTransformation } from '@/utils';

import { AVATAR_COLORS } from './AvatarColors';
import styles from './Avatar.module.scss';
import { ControlSize } from '@/types';

export type AvatarProps = {
  src?: string;
  className?: string;
  text?: string;
  disabled?: boolean;
  size?: ControlSize;
};

const cx = bindStyles(styles);

export const Avatar: FC<AvatarProps> = ({ src, className, size = ControlSize.MEDIUM, text, disabled }) => {
  const currentName: string = useMemo(() => {
    if (text) {
      return text[0];
    }

    return '?';
  }, [text]);

  return (
    <div
      className={cx(className, 'avatar', size, { disabled, text: !src })}
      style={src ? undefined : AVATAR_COLORS[getRadixTransformation(currentName, AVATAR_COLORS.length)]}
    >
      {src ? <img className={cx('image')} src={src} alt={currentName.toUpperCase()} /> : currentName.toUpperCase()}
    </div>
  );
};
