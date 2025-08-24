import { FC } from 'react';

import { bindStyles } from '@/utils';
import { Icon, IconTypes } from '@/kit';

import styles from './Loader.module.scss';
import { ControlSize } from '@/types';

type Props = {
  size?: ControlSize;
  type?: Extract<IconTypes, 'spinner' | 'spinner-progress' | 'spinner-filled'>;
  className?: string;
};

const cx = bindStyles(styles);

const Loader: FC<Props> = ({ size = ControlSize.MEDIUM, className, type = 'spinner-filled' }) => {
  return <Icon data-testid="loader" type={type} size={size} className={cx(className, 'loader')} />;
};

export { Loader };
