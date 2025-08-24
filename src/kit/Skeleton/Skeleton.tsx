import { FC } from 'react';

import { bindStyles } from '@/utils';

import styles from './Skeleton.module.scss';

const cx = bindStyles(styles);

export type SkeletonProps = {
  className?: string;
};

export const Skeleton: FC<SkeletonProps> = ({ className }) => <div className={cx(className, 'skeleton')} />;
