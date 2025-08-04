import { useState } from 'react';

export const usePopupControls = (value = false) => {
  const [isOpened, setIsOpened] = useState(value);

  const open = () => setIsOpened(true);
  const close = () => setIsOpened(false);
  const toggle = () => setIsOpened((prev) => !prev);

  return { isOpened, open, close, toggle };
};

export type PopupControls = ReturnType<typeof usePopupControls>;
