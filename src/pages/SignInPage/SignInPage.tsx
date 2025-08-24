import { FC, useRef } from 'react';
import { bindStyles } from '@/utils';

import { usePopupControls } from '@/hooks';
import { Button, Dropdown } from '@/kit';
import styles from './SignInPage.module.scss';

type SignInPageProps = {};

const cx = bindStyles(styles);

export const SignInPage: FC<SignInPageProps> = ({}) => {
  const dropdownPopup = usePopupControls();
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className={cx('sign-in-page')}>
      <Button text="toggle dropdown" onClick={dropdownPopup.toggle} ref={triggerRef} />
      {dropdownPopup.isOpened && (
        <Dropdown triggerElement={triggerRef.current} onClose={dropdownPopup.close}>
          dropdown content
        </Dropdown>
      )}
    </div>
  );
};
