import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useControls } from '../../../../../../hooks';
import { animate, appendClass } from '../../../../../../lib';
import { PushButton } from '../../../../../core';
import { LeftGameComponent } from '../../types';
import { DOTS_MAX, DOT_RADIUS, PLANE_X_POSITION } from './constants';
import { Dot } from './types';
import Utils from './utils';

const Slalom: LeftGameComponent = ({
  activityState,
  paused,
  setGameGood,
  ...rest
}) => {
  const { addControlEventListener, removeControlEventListener } = useControls();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const planeRef = useRef<HTMLImageElement>(null);
  const dots = useRef<Dot[]>([]);

  const [upClicked, setUpClicked] = useState(false);
  const [downClicked, setDownClicked] = useState(false);

  const [parameters, setParameters] = useState({
    X_SPACE: 0,
    Y_SPACE: 0,
    Y_MIN: 0,
    Y_MAX: 0,
    Y_DIFF: 0,
  });
  const [xOffset, setXOffset] = useState(0);
  const [planeYOffset, setPlaneYOffset] = useState(0);

  const createNewDot = useMemo(() => {
    const { X_SPACE, Y_DIFF, Y_MIN, Y_MAX } = parameters;

    var xPosition = 0;
    var yPosition = Y_MAX / 2;

    return () => {
      const newDot = { x: xPosition, y: yPosition } as Dot;

      xPosition += X_SPACE;

      if (yPosition >= Y_MAX) yPosition -= Y_DIFF;
      if (yPosition <= Y_MIN) yPosition += Y_DIFF;
      else yPosition += _.sample([Y_DIFF, -Y_DIFF])!;

      return newDot;
    };
  }, [parameters]);

  const moveUp = useCallback(() => {
    setPlaneYOffset((planeYOffset) => {
      if (
        !planeRef.current ||
        planeYOffset - planeRef.current.clientHeight / 2 <= 0
      )
        return planeYOffset;

      return planeYOffset - activityState.speed;
    });
  }, [activityState.speed]);

  const moveDown = useCallback(() => {
    setPlaneYOffset((planeYOffset) => {
      if (
        !canvasRef.current ||
        !planeRef.current ||
        planeYOffset + planeRef.current.clientHeight / 2 >=
          canvasRef.current.clientHeight
      )
        return planeYOffset;

      return planeYOffset + activityState.speed;
    });
  }, [activityState.speed]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const containerWidth = canvasRef.current.clientWidth;
    const containerHeight = canvasRef.current.clientHeight;

    const newXSpace = _.round(containerWidth / (DOTS_MAX - 1));
    const newYSpace = (containerHeight / 2) * 0.6;
    const newYmin = (containerHeight / 2) * 0.25;
    const newYMax = containerHeight / 2;
    const newYDiff = newYMax / 6;

    setParameters({
      X_SPACE: newXSpace,
      Y_SPACE: newYSpace,
      Y_MIN: newYmin,
      Y_MAX: newYMax,
      Y_DIFF: newYDiff,
    });

    setPlaneYOffset(containerHeight / 2);
  }, []);

  useEffect(() => {
    const arrowKeyPressed = {
      up: false,
      down: false,
    };

    const arrowKeyPressListener = addControlEventListener(
      'arrow-key-press',
      (keys) => {
        arrowKeyPressed.up = keys.up;
        setUpClicked(keys.up);
        arrowKeyPressed.down = keys.down;
        setDownClicked(keys.down);
      }
    );

    const wasdKeyPressListener = addControlEventListener(
      'wasd-key-press',
      (keys) => {
        setUpClicked(keys.w || arrowKeyPressed.up);
        setDownClicked(keys.s || arrowKeyPressed.down);
      }
    );

    return () => {
      removeControlEventListener(arrowKeyPressListener);
      removeControlEventListener(wasdKeyPressListener);
    };
  }, [addControlEventListener, removeControlEventListener]);

  useEffect(() => {
    dots.current = _.times(DOTS_MAX, createNewDot);

    const firstDot = dots.current[0];

    const { Y_SPACE } = parameters;

    setPlaneYOffset(firstDot.y + Y_SPACE / 2);
  }, [createNewDot, parameters]);

  useEffect(() => {
    setXOffset((xOffset) => Math.floor(xOffset));
  }, [activityState.speed]);

  useEffect(() => {
    return animate(() => {
      if (paused) return;

      setUpClicked((upClicked) => {
        if (upClicked) moveUp();

        return upClicked;
      });

      setDownClicked((downClicked) => {
        if (downClicked) moveDown();

        return downClicked;
      });

      setXOffset((xOffset) => {
        if (!canvasRef.current) return xOffset;

        const context = canvasRef.current.getContext('2d');

        if (!context) return xOffset;

        context.clearRect(
          0,
          0,
          canvasRef.current.clientWidth,
          canvasRef.current.clientHeight
        );

        const { X_SPACE, Y_SPACE } = parameters;

        dots.current.forEach((dot) => {
          Utils.drawCircle(context, dot.x - xOffset, dot.y, DOT_RADIUS, '#fff');

          Utils.drawCircle(
            context,
            dot.x - xOffset,
            dot.y + Y_SPACE,
            DOT_RADIUS,
            '#fff'
          );
        });

        if (
          xOffset > 0 &&
          xOffset % X_SPACE <=
            (activityState.speed === 0.5 ? 0 : activityState.speed - 1)
        ) {
          dots.current.push(createNewDot());

          dots.current.shift();
        }

        return xOffset + activityState.speed;
      });
    });
  }, [activityState.speed, createNewDot, moveDown, moveUp, parameters, paused]);

  useEffect(() => {
    if (!planeRef.current || !canvasRef.current! || xOffset === 0) return;

    const { X_SPACE, Y_SPACE } = parameters;

    if ((xOffset - PLANE_X_POSITION) % X_SPACE === 0) {
      const planeBounds = {
        top: planeYOffset - planeRef.current.clientHeight / 2,
        bottom: planeYOffset + planeRef.current.clientHeight / 2,
      };
      const relevantYBounds = {
        top: dots.current[1].y,
        bottom: dots.current[1].y + Y_SPACE,
      };

      if (
        planeBounds.top < relevantYBounds.top ||
        planeBounds.bottom > relevantYBounds.bottom
      )
        setGameGood(false);
    }
  }, [parameters, planeYOffset, setGameGood, xOffset]);

  return (
    <div {...rest} className={appendClass('slalom', rest.className)}>
      <img
        ref={planeRef}
        className="aircraft"
        src={require('./images/aircraft.png')}
        alt="Aircraft"
        style={{ top: `${planeYOffset}px` }}
      />
      <canvas
        ref={canvasRef}
        width={canvasRef.current?.clientWidth || 0}
        height={canvasRef.current?.clientHeight || 0}
      />
      <div className="buttons-container">
        <PushButton onHold={moveUp} overrideClick={upClicked} disabled={paused}>
          <img
            src={require('./images/svgs/arrow.svg').default}
            alt="Up Arrow"
          />
          <span>Up</span>
        </PushButton>
        <PushButton
          onHold={moveDown}
          overrideClick={downClicked}
          disabled={paused}
        >
          <img
            src={require('./images/svgs/arrow.svg').default}
            alt="Up Arrow"
            style={{ transform: 'rotate(180deg)' }}
          />
          <span>Down</span>
        </PushButton>
      </div>
    </div>
  );
};

export default Slalom;
