import { CSSProperties, DetailedHTMLProps, FC, HTMLAttributes, useMemo } from 'react';

import { ICONS, IconTypes } from './types';

import styles from './Icon.module.scss';
import { bindStyles } from '@/utils';
import { ControlSize } from '@/types';

export type IconProps = DetailedHTMLProps<HTMLAttributes<SVGSVGElement>, SVGSVGElement> & {
  type: IconTypes;
  size?: ControlSize | number;
};

type CSSVariables = {
  '--icon-size'?: string;
};

type CustomStyle = CSSProperties & CSSVariables;

const cx = bindStyles(styles);

export const Icon: FC<IconProps> = ({ type, size = ControlSize.MEDIUM, className, ...props }) => {
  const styles = useMemo(() => {
    let sizeStyles: undefined | CustomStyle;

    if (Number.isFinite(size)) {
      sizeStyles = { '--icon-size': `${size}px` };
    }

    return sizeStyles ? { ...sizeStyles, ...props.style } : props.style;
  }, [props.style, size]);

  const IconSVG = useMemo(() => ICONS[type], [type]);

  const formattedSize = useMemo(() => {
    if (typeof size === 'string') {
      return size;
    }

    return undefined;
  }, [size]);

  if (!IconSVG) {
    return null;
  }

  return <IconSVG className={cx(className, 'icon', formattedSize)} style={styles} {...props} />;
};
