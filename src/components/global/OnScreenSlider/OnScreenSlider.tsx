import { useEffect, useRef, useState } from 'react';
import {
  OnScreenJoystickPosition,
  OnScreenJoystickSize,
} from '../../../context/ControlsContext/types';
import { useControls } from '../../../hooks';
import { appendClass } from '../../../lib';
import { ActivityObject } from '../../../types';
import { Holdable } from '../../core';
import SliderButton from './SliderButton';

interface OnScreenSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  activityObject: ActivityObject;
}

const OnScreenSlider: React.FC<OnScreenSliderProps> = ({
  activityObject,
  ...rest
}) => {
  const {
    onScreenJoystickSize,
    onScreenJoystickPosition,
    updateSpeed,
    addControlEventListener,
    removeControlEventListener,
  } = useControls();

  const containerRef = useRef<HTMLDivElement>(null);
  const center = useRef(0);

  const touchIndex = useRef<number | undefined>();

  const [hold, setHold] = useState(false);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (onScreenJoystickPosition === OnScreenJoystickPosition.Right) {
      const wasdKeyPressEventListener = addControlEventListener(
        'wasd-key-press',
        (keys) => {
          if (!containerRef.current) return;

          if (keys.w && y <= containerRef.current.clientHeight / 2) {
            setY(y + 1);
          } else if (keys.s && y >= -(containerRef.current.clientHeight / 2)) {
            setY(y - 1);
          }
        }
      );

      return () => removeControlEventListener(wasdKeyPressEventListener);
    } else if (onScreenJoystickPosition === OnScreenJoystickPosition.Left) {
      const arrowKeyPressEventListener = addControlEventListener(
        'arrow-key-press',
        (keys) => {
          if (!containerRef.current) return;

          if (keys.up && y <= containerRef.current.clientHeight / 2) {
            setY(y + 1);
          } else if (
            keys.down &&
            y >= -(containerRef.current.clientHeight / 2)
          ) {
            setY(y - 1);
          }
        }
      );

      return () => removeControlEventListener(arrowKeyPressEventListener);
    }
  }, [
    addControlEventListener,
    removeControlEventListener,
    onScreenJoystickPosition,
    y,
  ]);

  useEffect(() => {
    if (!containerRef.current) return;

    center.current =
      containerRef.current.getBoundingClientRect().top +
      containerRef.current.clientHeight / 2;
  }, []);

  useEffect(() => {
    function calculateNewPosition(clientY: number) {
      if (!hold || !containerRef.current) return;

      const targetY = center.current - clientY;

      if (
        targetY >= -(containerRef.current.clientHeight / 2) &&
        targetY <= containerRef.current.clientHeight / 2
      )
        setY(targetY);
    }

    function onMouseMove(e: MouseEvent) {
      calculateNewPosition(e.clientY);
    }

    function onTouchStart(e: TouchEvent) {
      touchIndex.current = e.touches.length - 1;
    }

    function onTouchMove(e: TouchEvent) {
      calculateNewPosition(e.touches[touchIndex.current || 0].clientY);
    }

    function onTouchEnd() {
      touchIndex.current = undefined;
    }

    const { current: container } = containerRef;
    if (!container) return;

    document.addEventListener('mousemove', onMouseMove);
    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchmove', onTouchMove);
    container.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      container.addEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [hold, setY]);

  useEffect(() => {
    if (!containerRef.current) return;

    const speed = y / (containerRef.current.clientHeight / 2);

    updateSpeed(speed);
  }, [updateSpeed, y]);

  const { width, height } = (() => {
    switch (onScreenJoystickSize) {
      case OnScreenJoystickSize.S:
        return { width: '10vh', height: '10vh' };
      case OnScreenJoystickSize.M:
        return { width: '12.5vh', height: '12.5vh' };
      case OnScreenJoystickSize.L:
        return { width: '15vh', height: '15vh' };
      default:
        return { width: '0', height: '0' };
    }
  })();

  return (
    <div
      {...rest}
      className={appendClass(
        `on-screen-slider ${
          onScreenJoystickPosition === OnScreenJoystickPosition.Right
            ? 'left'
            : 'right'
        }`,
        rest.className
      )}
      style={{
        ...rest.style,
        backgroundImage: `url(${require('./images/svgs/slider.svg').default})`,
        width,
        height,
      }}
      ref={containerRef}
    >
      <Holdable
        className="interactable"
        onHold={() => setHold(true)}
        onHoldRelease={() => setHold(false)}
        style={{ top: `calc(50% - ${y}px)` }}
        sticky
      >
        <SliderButton fill={activityObject.controlsColor} />
      </Holdable>
    </div>
  );
};

export default OnScreenSlider;
