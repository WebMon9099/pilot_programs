import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Axis,
  OnScreenJoystickPosition,
  OnScreenJoystickSize,
} from '../../../context';
import { useControls } from '../../../hooks';
import { animate, appendClass } from '../../../lib';
import { ActivityObject } from '../../../types';
import { Holdable } from '../../core';
import JoystickTop from './JoystickTop';

interface JoystickAttributes extends React.HTMLAttributes<HTMLDivElement> {
  activityObject: ActivityObject;
  width?: number;
  height?: number;
  position?: OnScreenJoystickPosition;
  color?: string;
  onAxesUpdate?: (axes: Axis) => void;
}

const OnScreenJoystick: React.FC<JoystickAttributes> = ({
  activityObject,
  width = 10,
  height = 10,
  position,
  color,
  onAxesUpdate,
  ...rest
}) => {
  const { onScreenJoystickSize, onScreenJoystickPosition, updateLogicalAxes } =
    useControls();

  const containerRef = useRef<HTMLDivElement>(null);
  const center = useRef({ x: 0, y: 0 });

  const touchIndex = useRef<number | undefined>();

  const axisX = useRef(0);
  const axisY = useRef(0);

  const [hold, setHold] = useState(false);
  const [y, setY] = useState(0);
  const [x, setX] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    center.current = {
      x:
        containerRef.current.getBoundingClientRect().left +
        containerRef.current.clientWidth / 2,
      y:
        containerRef.current.getBoundingClientRect().top +
        containerRef.current.clientHeight / 2,
    };
  }, [onScreenJoystickPosition]);

  useEffect(() => {
    if (!hold) {
      setY(0);
      setX(0);
    }
  }, [hold, setX, setY]);

  useEffect(() => {
    function calculateNewPosition(clientX: number, clientY: number) {
      if (!hold || !containerRef.current) return;

      const targetY = center.current.y - clientY;
      const targetX = clientX - center.current.x;

      if (
        Math.pow(Math.abs(targetY), 2) + Math.pow(Math.abs(targetX), 2) <=
        Math.pow(containerRef.current.clientWidth / 2, 2)
      ) {
        setY(targetY);
        setX(targetX);
      } else {
        const r = containerRef.current.clientWidth / 2;
        const m = targetY / targetX;

        const newX =
          Math.sqrt(Math.pow(r, 2) / (1 + Math.pow(m, 2))) *
          (clientX < center.current.x ? -1 : 1);
        const newY = newX * m;

        setY(newY);
        setX(newX);
      }
    }

    function onMouseMove(e: MouseEvent) {
      calculateNewPosition(e.clientX, e.clientY);
    }

    function onTouchStart(e: TouchEvent) {
      touchIndex.current = e.touches.length - 1;
    }

    function onTouchMove(e: TouchEvent) {
      calculateNewPosition(
        e.touches[touchIndex.current || 0].clientX,
        e.touches[touchIndex.current || 0].clientY
      );
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
  }, [hold, setX, setY]);

  useEffect(() => {
    if (!containerRef.current) return;

    const newAxisX = x / (containerRef.current.clientWidth / 2);
    const newAxisY = y / (containerRef.current.clientHeight / 2);

    if (!onAxesUpdate) updateLogicalAxes({ x: newAxisX, y: newAxisY });

    axisX.current = newAxisX;
    axisY.current = newAxisY;
  }, [onAxesUpdate, updateLogicalAxes, x, y]);

  useEffect(() => {
    if (onAxesUpdate)
      return animate(() =>
        onAxesUpdate({ x: axisX.current, y: axisY.current })
      );
  }, [onAxesUpdate]);

  const sizeMultiplier = (() => {
    switch (onScreenJoystickSize) {
      case OnScreenJoystickSize.S:
        return 1;
      case OnScreenJoystickSize.M:
        return 1.25;
      case OnScreenJoystickSize.L:
        return 1.5;
      default:
        return 0;
    }
  })();

  const finalPosition = position || onScreenJoystickPosition;
  const { finalWidth, finalHeight } = {
    finalWidth: `${width * sizeMultiplier}vh`,
    finalHeight: `${height * sizeMultiplier}vh`,
  };

  const backgroundImage = (() => {
    const baseBackground = require('./images/svgs/joystick_base.svg').default;
    const horizontalBackground =
      require('./images/svgs/joystick_base_horizontal.svg').default;

    if (
      activityObject.gear.joystick === true ||
      (typeof activityObject.gear.joystick !== 'boolean' &&
        activityObject.gear.joystick?.onScreenJoystick === true)
    )
      return baseBackground;
    else if (
      typeof activityObject.gear.joystick !== 'boolean' &&
      typeof activityObject.gear.joystick?.onScreenJoystick !== 'boolean'
    ) {
      if (activityObject.gear.joystick?.onScreenJoystick.horizontal)
        return horizontalBackground;
    }
  })();

  return (
    <div
      {...rest}
      className={appendClass(
        `on-screen-joystick ${
          finalPosition === OnScreenJoystickPosition.Right ? 'right' : 'left'
        }`,
        rest.className
      )}
      style={{
        ...rest.style,
        backgroundImage: `url("${backgroundImage}")`,
        width: finalWidth,
        height: finalHeight,
      }}
      ref={containerRef}
    >
      <Holdable
        className="interactable"
        onHold={useCallback(() => setHold(true), [])}
        onHoldRelease={useCallback(() => setHold(false), [])}
        style={{
          top: `calc(50% - ${y}px)`,
          left: `calc(50% + ${x}px)`,
        }}
        sticky
      >
        <JoystickTop fill={color || activityObject.controlsColor} />
      </Holdable>
    </div>
  );
};

export default OnScreenJoystick;
