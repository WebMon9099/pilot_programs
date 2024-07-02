import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useControls, useInterval } from '../../../../../../hooks';
import { animate, appendClass } from '../../../../../../lib';
import { PushButton } from '../../../../../core';
import { LeftGameComponent } from '../../types';
import { DOT_RADIUS } from './constants';
import { Dot } from './types';
import Utils from './utils';

const CatchingBalls: LeftGameComponent = ({
  activityState,
  paused,
  setGameGood,
  ...rest
}) => {
  const { addControlEventListener, removeControlEventListener } = useControls();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cupRef = useRef<HTMLImageElement>(null);
  const dots = useRef<Dot[]>([]);

  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);

  const [cupXOffset, setCupXOffset] = useState(0);

  const addDot = useCallback(() => {
    if (!canvasRef.current) return;

    const containerWidth = canvasRef.current.clientWidth;

    const newDot = {
      x: _.random(20, containerWidth - 20),
      y: 20,
    } as Dot;

    dots.current.push(newDot);
  }, []);

  const moveLeft = useCallback(() => {
    setCupXOffset((cupXOffset) => {
      if (!cupRef.current || cupXOffset <= cupRef.current.clientWidth / 2)
        return cupXOffset;

      return cupXOffset - 2 * activityState.speed;
    });
  }, [activityState.speed]);

  const moveRight = useCallback(() => {
    setCupXOffset((cupXOffset) => {
      if (
        !cupRef.current ||
        !canvasRef.current ||
        cupXOffset >=
          canvasRef.current.clientWidth - cupRef.current.clientWidth / 2
      )
        return cupXOffset;

      return cupXOffset + 2 * activityState.speed;
    });
  }, [activityState.speed]);

  useEffect(() => {
    if (!canvasRef.current) return;

    addDot();

    setCupXOffset(canvasRef.current.clientWidth / 2);
  }, [addDot]);

  useEffect(() => {
    const arrowKeyPressed = {
      left: false,
      right: false,
    };

    const arrowKeyPressListener = addControlEventListener(
      'arrow-key-press',
      (keys) => {
        arrowKeyPressed.left = keys.left;
        setLeftPressed(keys.left);
        arrowKeyPressed.right = keys.right;
        setRightPressed(keys.right);
      }
    );

    const wasdKeyPressListener = addControlEventListener(
      'wasd-key-press',
      (keys) => {
        setLeftPressed(keys.a || arrowKeyPressed.left);
        setRightPressed(keys.d || arrowKeyPressed.right);
      }
    );

    return () => {
      removeControlEventListener(arrowKeyPressListener);
      removeControlEventListener(wasdKeyPressListener);
    };
  }, [addControlEventListener, removeControlEventListener]);

  useInterval(addDot, 3000 / activityState.speed, paused);

  useEffect(() => {
    return animate(() => {
      setLeftPressed((leftPressed) => {
        if (leftPressed) moveLeft();

        return leftPressed;
      });

      setRightPressed((rightPressed) => {
        if (rightPressed) moveRight();

        return rightPressed;
      });

      setCupXOffset((cupXOffset) => {
        if (!canvasRef.current || paused) return cupXOffset;

        const context = canvasRef.current.getContext('2d');

        if (!context) return cupXOffset;

        context.clearRect(
          0,
          0,
          canvasRef.current.clientWidth,
          canvasRef.current.clientHeight
        );

        const removeQueue: number[] = [];
        dots.current.forEach((dot, index) => {
          if (!canvasRef.current || !cupRef.current) return;

          if (
            dot.y + DOT_RADIUS >=
            canvasRef.current.clientHeight - cupRef.current.clientHeight - 20
          ) {
            if (
              dot.x > cupXOffset - cupRef.current.clientWidth / 2 &&
              dot.x < cupXOffset + cupRef.current.clientWidth / 2
            )
              removeQueue.push(index);
          }
          if (dot.y - DOT_RADIUS >= canvasRef.current.clientHeight) {
            removeQueue.push(index);

            setGameGood(false);
          }

          Utils.drawCircle(context, dot.x, dot.y, DOT_RADIUS, '#fff');

          dot.y += 1 * activityState.speed;
        });

        removeQueue.forEach((index) => dots.current.splice(index, 1));

        return cupXOffset;
      });
    });
  }, [activityState.speed, setGameGood, paused, moveLeft, moveRight]);

  return (
    <div {...rest} className={appendClass('catching-balls', rest.className)}>
      <img
        className="cup"
        src={require('./images/cup.png')}
        alt="Cup"
        style={{ left: cupXOffset }}
        ref={cupRef}
      />
      <canvas
        ref={canvasRef}
        width={canvasRef.current?.clientWidth || 0}
        height={canvasRef.current?.clientHeight || 0}
      />
      <div className="buttons-container">
        <PushButton
          onHold={moveLeft}
          overrideClick={leftPressed}
          disabled={paused}
        >
          <img
            src={require('./images/svgs/arrow.svg').default}
            alt="Up Arrow"
            style={{ transform: 'rotate(-90deg)' }}
          />
          <span>Left</span>
        </PushButton>
        <PushButton
          onHold={moveRight}
          overrideClick={rightPressed}
          disabled={paused}
        >
          <span>Right</span>
          <img
            src={require('./images/svgs/arrow.svg').default}
            alt="Up Arrow"
            style={{ transform: 'rotate(90deg)' }}
          />
        </PushButton>
      </div>
    </div>
  );
};

export default CatchingBalls;
