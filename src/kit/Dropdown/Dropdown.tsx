import React, { CSSProperties, FC, PropsWithChildren, useEffect, useRef, useState } from 'react';

import { bindStyles } from '@/utils';

import styles from './Dropdown.module.scss';
import { Portal } from '@/kit/Portal';

export enum DropdownVerticalPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
  AUTO = 'auto',
}

export enum DropdownHorizontalPosition {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
  AUTO = 'auto',
}

export enum DropdownWidthVariants {
  AUTO = 'auto',
  FULL_WIDTH = 'full-width',
  FIT_CONTENT = 'fit-content',
}

export enum DropdownAnimationVariant {
  AUTO = 'auto',
  NONE = 'none',
  TOP = 'fade-top',
  BOTTOM = 'fade-bottom',
}

export type DropdownProps = PropsWithChildren<{
  className?: string;

  horizontalPosition?: DropdownHorizontalPosition;
  verticalPosition?: DropdownVerticalPosition;
  animation?: DropdownAnimationVariant;
  width?: DropdownWidthVariants | number | string;

  isFullWidth?: boolean;
  withShadow?: boolean;
  isPortal?: boolean;
  triggerElement: HTMLElement | null;
  gap?: number;
  onClose?: () => void;
}>;

export type GetPositionProps = {
  triggerRect: DOMRect;
  dropdownRect: DOMRect;
  gap: number;

  viewportHeight?: number;
  viewportWidth?: number;
};

const cx = bindStyles(styles);

const getTopPosition = ({ triggerRect, dropdownRect, gap }: GetPositionProps) => {
  const topAvailablePX = triggerRect.top;
  const needHeightPX = dropdownRect.height + gap;
  const dropdownStyles: CSSProperties = {};

  if (topAvailablePX >= needHeightPX) {
    dropdownStyles.top = `${topAvailablePX - needHeightPX}px`;
  } else {
    dropdownStyles.top = 0;
  }

  return dropdownStyles;
};

const getBottomPosition = ({ triggerRect, dropdownRect, gap, viewportHeight = window.innerHeight }: GetPositionProps) => {
  const dropdownStyles: CSSProperties = {};
  const needHeightPX = dropdownRect.height + gap;

  const bottomAvailablePX = viewportHeight - (triggerRect.bottom + triggerRect.height);

  if (bottomAvailablePX >= needHeightPX) {
    dropdownStyles.top = `${triggerRect.bottom + gap}px`;
  } else {
    dropdownStyles.bottom = 0;
  }

  return dropdownStyles;
};

const getAutoVerticalPosition = ({ triggerRect, dropdownRect, gap, viewportHeight = window.innerHeight }: GetPositionProps) => {
  const topAvailablePX = triggerRect.top;
  const bottomAvailablePX = viewportHeight - (triggerRect.bottom + triggerRect.height);
  const needHeightPX = dropdownRect.height + gap;

  if (bottomAvailablePX >= needHeightPX) {
    return getBottomPosition({ triggerRect, dropdownRect, gap });
  }

  if (topAvailablePX >= needHeightPX) {
    return getTopPosition({ triggerRect, dropdownRect, gap });
  }

  if (bottomAvailablePX >= topAvailablePX) {
    return getBottomPosition({ triggerRect, dropdownRect, gap });
  } else {
    return getTopPosition({ triggerRect, dropdownRect, gap });
  }
};

const getLeftPosition = ({ triggerRect }: GetPositionProps) => {
  const dropdownStyles: CSSProperties = {};

  dropdownStyles.left = `${triggerRect.left}px`;

  return dropdownStyles;
};

const getRightPosition = ({ triggerRect, dropdownRect }: GetPositionProps) => {
  const dropdownStyles: CSSProperties = {};

  dropdownStyles.left = `${triggerRect.right - dropdownRect.width}px`;

  return dropdownStyles;
};

const getCenterPosition = ({ triggerRect, dropdownRect }: GetPositionProps) => {
  const dropdownStyles: CSSProperties = {};

  const diff = triggerRect.width - dropdownRect.width;

  dropdownStyles.left = `${triggerRect.left + diff / 2}px`;

  return dropdownStyles;
};

const getAutoHorizontalPosition = ({ triggerRect, dropdownRect, gap, viewportWidth = window.innerWidth }: GetPositionProps) => {
  const leftAvailablePX = triggerRect.left;
  const rightAvailablePX = viewportWidth - triggerRect.left;
  const needWidthPX = dropdownRect.width + gap;

  if (rightAvailablePX >= needWidthPX) {
    return getLeftPosition({ triggerRect, dropdownRect, gap });
  }

  if (leftAvailablePX >= needWidthPX) {
    return getRightPosition({ triggerRect, dropdownRect, gap });
  }

  if (viewportWidth >= needWidthPX) {
    return getCenterPosition({ triggerRect, dropdownRect, gap });
  }

  if (rightAvailablePX >= leftAvailablePX) {
    return getLeftPosition({ triggerRect, dropdownRect, gap });
  } else {
    return getRightPosition({ triggerRect, dropdownRect, gap });
  }
};

export const Dropdown: FC<DropdownProps> = ({
  className,
  isFullWidth,
  onClose,
  gap = 8,
  width = DropdownWidthVariants.AUTO,
  withShadow = true,
  isPortal = true,
  horizontalPosition = DropdownHorizontalPosition.AUTO,
  verticalPosition = DropdownVerticalPosition.AUTO,
  animation = DropdownAnimationVariant.NONE,
  triggerElement,
  children,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [styles, setStyles] = useState<CSSProperties>({});

  const calculateStyles = () => {
    if (triggerElement && dropdownRef.current) {
      const triggerRect = triggerElement.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();

      let dropdownStyles: CSSProperties = {};

      switch (verticalPosition) {
        case DropdownVerticalPosition.TOP:
          dropdownStyles = {
            ...dropdownStyles,
            ...getTopPosition({ triggerRect, dropdownRect, gap }),
          };
          break;
        case DropdownVerticalPosition.BOTTOM:
          dropdownStyles = {
            ...dropdownStyles,
            ...getBottomPosition({ triggerRect, dropdownRect, gap }),
          };
          break;
        case DropdownVerticalPosition.AUTO:
        default:
          dropdownStyles = {
            ...dropdownStyles,
            ...getAutoVerticalPosition({ triggerRect, dropdownRect, gap }),
          };
          break;
      }

      switch (horizontalPosition) {
        case DropdownHorizontalPosition.LEFT:
          dropdownStyles = {
            ...dropdownStyles,
            ...getLeftPosition({ triggerRect, dropdownRect, gap }),
          };
          break;
        case DropdownHorizontalPosition.RIGHT:
          dropdownStyles = {
            ...dropdownStyles,
            ...getRightPosition({ triggerRect, dropdownRect, gap }),
          };
          break;
        case DropdownHorizontalPosition.CENTER:
          dropdownStyles = {
            ...dropdownStyles,
            ...getCenterPosition({ triggerRect, dropdownRect, gap }),
          };
          break;
        case DropdownHorizontalPosition.AUTO:
        default:
          dropdownStyles = {
            ...dropdownStyles,
            ...getAutoHorizontalPosition({ triggerRect, dropdownRect, gap }),
          };
          break;
      }

      if (typeof width === 'number') {
        dropdownStyles.width = `${width}px`;
      } else {
        switch (width) {
          case DropdownWidthVariants.FULL_WIDTH:
            dropdownStyles.width = '100%';
            break;
          case DropdownWidthVariants.FIT_CONTENT:
            dropdownStyles.width = 'fit-content';
            break;
          case DropdownWidthVariants.AUTO:
            if (dropdownRect.width > triggerRect.width) {
              dropdownStyles.width = `fit-content`;
            } else {
              dropdownStyles.width = `${triggerRect.width}px`;
            }
            break;
          default:
            dropdownStyles.width = width;
            break;
        }
      }

      setStyles(dropdownStyles);
    }
  };

  useEffect(() => {
    calculateStyles();
  }, []);

  useEffect(() => {
    const check = (e: MouseEvent | TouchEvent | FocusEvent) => {
      if (!triggerElement?.contains(e.target as Node) && !dropdownRef.current?.contains(e.target as Node)) {
        onClose?.();
      }
    };

    window.addEventListener('click', check);
    window.addEventListener('mousedown', check);
    window.addEventListener('touchstart', check);
    window.addEventListener('blur', check);

    window.addEventListener('resize', calculateStyles);

    return () => {
      window.removeEventListener('click', check);
      window.removeEventListener('mousedown', check);
      window.removeEventListener('touchstart', check);
      window.removeEventListener('blur', check);

      window.removeEventListener('resize', calculateStyles);
    };
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(calculateStyles);

    if (triggerElement) {
      observer.observe(triggerElement);
    }

    return () => {
      observer?.disconnect();
    };
  }, []);

  const content = (
    <div ref={dropdownRef} className={cx(className, 'dropdown', animation, { isFullWidth, withShadow })} style={styles}>
      {children}
    </div>
  );

  if (isPortal) {
    return <Portal id="dropdown-portal">{content}</Portal>;
  }

  return content;
};
