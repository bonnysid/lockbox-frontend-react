import { FC, JSX } from 'react';

import { Icon, IconTypes } from '@/kit';
import { bindStyles } from '@/utils';

import styles from './ControllerWrapper.module.scss';

type Props = {
  icon: IconTypes | JSX.Element;
};

const cx = bindStyles(styles);

export const ControllerIcon: FC<Props> = ({ icon }) => {
  if (typeof icon === 'string') {
    return <Icon type={icon} className={cx('icon')} />;
  }

  return icon;
};
