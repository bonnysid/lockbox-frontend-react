import { FC } from 'react';

import styles from './HiddenControl.scss';
import { bindStyles } from '@/utils';
import { Icon } from '@/kit';

const cx = bindStyles(styles);

export type HiddenControlProps = {
  isHidden?: boolean;
  hide: () => void;
  reveal: () => void;
};

export const HiddenControl: FC<HiddenControlProps> = ({ isHidden, reveal, hide }) => (
  <button type="button" className={cx('hidden-control')} onClick={isHidden ? reveal : hide}>
    <Icon type="eye-off" className={cx('icon', { hidden: isHidden })} size={20} />
    <Icon type="eye" className={cx('icon', { hidden: !isHidden })} size={20} />
  </button>
);
