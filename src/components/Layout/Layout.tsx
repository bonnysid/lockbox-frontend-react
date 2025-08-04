import { FC } from 'react';
import { bindStyles } from '@/utils';

import styles from './Layout.module.scss';
import { Outlet } from 'react-router-dom';

type LayoutProps = {};

const cx = bindStyles(styles);

export const Layout: FC<LayoutProps> = ({}) => {
  return (
    <div className={cx('layout')}>
      <Outlet />
    </div>
  );
};
