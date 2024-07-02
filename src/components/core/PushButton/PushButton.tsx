import React, { useEffect, useState } from 'react';
import { appendClass } from '../../../lib';
import Holdable, { HoldableProps } from '../Holdable';

export interface PushButtonProps extends HoldableProps {
  overrideClick?: boolean;
}

const PushButton = React.forwardRef<HTMLButtonElement, PushButtonProps>(
  ({ children, overrideClick = false, ...rest }, ref) => {
    const [passedInitial, setPassedInitial] = useState(false);
    const [clicked, setClicked] = useState(false);

    function click() {
      setPassedInitial(true);
      setClicked(true);
    }

    function clearClick() {
      setClicked(false);
    }

    useEffect(() => {
      function _clearClick() {
        if (overrideClick) return;

        clearClick();
      }

      document.addEventListener('mouseup', _clearClick);

      return () => document.removeEventListener('mouseup', _clearClick);
    }, [overrideClick]);

    useEffect(() => {
      if (overrideClick) click();
      else clearClick();
    }, [overrideClick]);

    return (
      <Holdable
        {...rest}
        className={appendClass(
          `push-button ${
            passedInitial ? (clicked ? 'clicked' : '') : 'initial'
          }`,
          rest.className
        )}
        onMouseDown={(e) => {
          rest.onMouseDown?.(e);

          if (!overrideClick) click();
        }}
        onMouseUp={(e) => {
          rest.onMouseUp?.(e);

          if (!overrideClick) clearClick();
        }}
        onMouseLeave={(e) => {
          rest.onMouseLeave?.(e);

          if (!overrideClick) setClicked(false);
        }}
        onTouchStart={(e) => {
          rest.onTouchStart?.(e);

          if (!overrideClick) click();
        }}
        onTouchEnd={(e) => {
          rest.onTouchEnd?.(e);

          if (!overrideClick) clearClick();
        }}
        ref={ref}
      >
        {children}
      </Holdable>
    );
  }
);

export default PushButton;
