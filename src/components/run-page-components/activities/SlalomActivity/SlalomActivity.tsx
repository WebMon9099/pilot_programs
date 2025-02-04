import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useClock, useControls } from "../../../../hooks";
import useTimeActivity from "../../../../hooks/useActivity/useTimeActivity/useTimeActivity";
import { animate } from "../../../../lib";
import { ActivityComponent } from "../../../../types";
import "./SlalomActivity.scss";
import Utils from "./utils";

interface Dot {
  x: number;
  y: number;
  passed: boolean;
}

var right = true;
var lastChange = 0;
var pairs: Dot[][] = [];
var margin = 25;
var speed = 2.75;
var baseSpeed = speed;
var controlSpeed = 10;
var rotationTimeout: string | undefined;

const SlalomActivity: ActivityComponent = ({
  activityObject,
  activityState,
  activityActions,
  activityParams,
}) => {
  const clock = useClock();

  const {
    addControlEventListener,
    removeControlEventListener,
    leftActiveGamepad,
    leftGamepadOptions,
  } = useControls();

  useTimeActivity(activityObject, activityState, activityActions);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const planeRef = useRef<HTMLImageElement>(null);

  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasXMargin, setCanvasXMargin] = useState(0);

  const [planeX, setPlaneX] = useState(0);
  const [planeY, setPlaneY] = useState(0);

  const [rotation, setRotation] = useState(0);

  const goToX = useCallback((getNewX: (x: number) => number) => {
    setPlaneX((planeX) => {
      const newX = getNewX(planeX);

      if (!planeRef.current || !canvasRef.current) return planeX;

      var right = false;

      if (planeX < newX) right = true;

      if (right) {
        const planeRightEdge = newX + planeRef.current.clientWidth / 2;

        if (planeRightEdge < canvasRef.current?.clientWidth) return newX;
      } else {
        const planeLeftEdge = newX - planeRef.current.clientWidth / 2;

        if (planeLeftEdge > 0) return newX;
      }

      return planeX;
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    if (activityParams?.type === "Dynamic") margin = 30;
    else {
      speed += 1.75;
      baseSpeed += 2;
    }

    setCanvasWidth(
      activityParams?.type === "Fixed"
        ? containerRef.current.clientWidth
        : containerRef.current.clientHeight
    );
    setCanvasHeight(containerRef.current.clientHeight);
    setCanvasXMargin(
      (activityParams?.type === "Fixed"
        ? containerRef.current.clientWidth
        : containerRef.current.clientHeight) /
        (100 / margin)
    );

    setPlaneX(
      (activityParams?.type === "Fixed"
        ? containerRef.current.clientWidth
        : containerRef.current.clientHeight) / 2
    );
    setPlaneY(containerRef.current.clientHeight - 192);
  }, [activityParams]);

  useEffect(() => {
    if (activityState.paused) return;

    const keyPressListener = addControlEventListener(
      "arrow-key-press",
      (keys) => {
        if (keys.right) goToX((x) => x + controlSpeed);
        if (keys.left) goToX((x) => x - controlSpeed);
      }
    );

    const wasdPressListener = addControlEventListener(
      "wasd-key-press",
      (keys) => {
        if (keys.a) goToX((x) => x - controlSpeed);
        if (keys.d) goToX((x) => x + controlSpeed);
      }
    );

    const physicalAxesChangeListener = addControlEventListener(
      "left-physical-axes-change",
      (axes) => {
        if (!leftActiveGamepad) return;

        goToX(
          (x) =>
            x + axes.x * ((controlSpeed * leftGamepadOptions.sensitivityX) / 50)
        );
      }
    );

    const onScreenJoystickAxesChangeListener = addControlEventListener(
      "on-screen-joystick-axes-change",
      (axes) => {
        goToX((x) => x + controlSpeed * axes.x);
      }
    );

    const speedChangeListener = addControlEventListener(
      "speed-change",
      (newSpeed) => {
        speed = (newSpeed + 3) * baseSpeed;
      }
    );

    return () => {
      removeControlEventListener(keyPressListener);
      removeControlEventListener(wasdPressListener);
      removeControlEventListener(physicalAxesChangeListener);
      removeControlEventListener(onScreenJoystickAxesChangeListener);
      removeControlEventListener(speedChangeListener);
    };
  }, [
    goToX,
    activityState.paused,
    addControlEventListener,
    removeControlEventListener,
    leftActiveGamepad,
    leftGamepadOptions.sensitivityX,
  ]);

  useEffect(() => {
    if (!canvasRef.current) return;

    pairs = [];

    right = _.random(0, 1) === 0 ? true : false;

    for (let i = 0; i < DOTS_NUMBER; i++) {
      const xOrigin =
        i > 0 ? (pairs[i - 1][0].x + pairs[i - 1][1].x) / 2 : canvasWidth / 2;

      const xDiff =
        lastChange <= 2 ? 0 : _.random(DOTS_X_DIFF / 2, DOTS_X_DIFF);

      var xCenter = xOrigin + (right ? xDiff : -xDiff);

      if (
        lastChange > 2 &&
        ((lastChange >= 7 && _.random(1, 4) === 1) ||
          xCenter >= canvasWidth - canvasXMargin ||
          xCenter <= canvasXMargin)
      ) {
        lastChange = 0;
        right = !right;
        xCenter = xOrigin + (right ? xDiff : -xDiff);
      } else {
        lastChange += 1;
      }

      pairs.push([
        {
          x: xCenter - DOTS_X_GAP / 2,
          y: canvasHeight - (i + 1) * DOTS_Y_GAP,
          passed: i < 8,
        },
        {
          x: xCenter + DOTS_X_GAP / 2,
          y: canvasHeight - (i + 1) * DOTS_Y_GAP,
          passed: i < 8,
        },
      ]);
    }
  }, [canvasWidth, canvasHeight, canvasXMargin]);

  useEffect(() => {
    if (activityState.paused) return;

    return animate(() => {
      if (!canvasRef.current) return;

      const context = canvasRef.current.getContext("2d");
      if (!context) return;

      context.clearRect(0, 0, canvasWidth, canvasHeight);

      const removeIndexes: number[] = [];

      pairs.forEach((pair, i) => {
        pair.forEach((dot) => {
          Utils.drawCircle(context, dot.x, dot.y, 7, "#fff");

          dot.y += speed;
        });

        if (!pair[0].passed && pair[0].y >= planeY) {
          pair[0].passed = true;

          if (!planeRef.current) return;

          const planeLeftEdge = planeX - planeRef.current.clientWidth / 2;
          const planeRightEdge = planeX + planeRef.current.clientWidth / 2;

          activityActions.activityIncreaseMaxScore(1);

          if (planeLeftEdge >= pair[0].x && planeRightEdge <= pair[1].x)
            activityActions.activityIncreaseScore(1);
        }

        if (pair[0].y >= canvasHeight) {
          const xOrigin =
            (pairs[pairs.length - 1][0].x + pairs[pairs.length - 1][1].x) / 2;

          const xDiff =
            lastChange <= 2 ? 0 : _.random(DOTS_X_DIFF / 2, DOTS_X_DIFF);

          var xCenter = xOrigin + (right ? xDiff : -xDiff);

          if (
            lastChange > 2 &&
            ((lastChange >= 7 && _.random(1, 4) === 1) ||
              xCenter >= canvasWidth - canvasXMargin ||
              xCenter <= canvasXMargin)
          ) {
            lastChange = 0;
            right = !right;
            xCenter = xOrigin + (right ? xDiff : -xDiff);
          } else {
            lastChange += 1;
          }

          pairs.push([
            {
              x: xCenter - DOTS_X_GAP / 2,
              y: pairs[pairs.length - 1][0].y - DOTS_Y_GAP,
              passed: false,
            },
            {
              x: xCenter + DOTS_X_GAP / 2,
              y: pairs[pairs.length - 1][0].y - DOTS_Y_GAP,
              passed: false,
            },
          ]);

          removeIndexes.push(i);
        }
      });

      removeIndexes.forEach((index) => pairs.splice(index, 1));
    });
  }, [
    activityActions,
    activityState.paused,
    canvasWidth,
    canvasHeight,
    canvasXMargin,
    planeY,
    planeX,
  ]);

  useEffect(() => {
    if (activityParams?.type === "Dynamic") {
      rotationTimeout = setRotationTimeout();

      return () => {
        if (rotationTimeout) clock.clear(rotationTimeout);
      };
    }

    function setRotationTimeout() {
      return clock.addTimeout(
        () => {
          setRotation(_.random(0, 6) * 60);

          rotationTimeout = setRotationTimeout();
        },
        _.random(3, 12) * 1000
      );
    }
  }, [clock, activityParams]);

  useEffect(() => {
    if (!rotationTimeout) return;

    if (activityState.paused) clock.pause(rotationTimeout);
    else clock.resume(rotationTimeout);
  }, [clock, activityState.paused]);

  return (
    <div
      className="flex h-full w-full items-center justify-center bg-[#3f3f3f]"
      ref={containerRef}
    >
      <div
        className="relative"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: "transform 7s",
          width: canvasWidth,
          height: canvasHeight,
        }}
      >
        <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef} />
        <img
          className="absolute bottom-24 h-48 -translate-x-1/2 -translate-y-1/2 -rotate-90"
          alt="aircraft"
          style={{ left: planeX, top: planeY }}
          src={require("./images/aircraft.png")}
          ref={planeRef}
        />
      </div>
    </div>
  );
};

export default SlalomActivity;

const DOTS_NUMBER = 20;
const DOTS_X_DIFF = 80;
const DOTS_X_GAP = 275;
const DOTS_Y_GAP = 75;
