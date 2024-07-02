import _ from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EVENT_KEYS } from "../../../../constants";
import {
  Axis,
  OnScreenJoystickPosition,
  OnScreenJoystickSize,
} from "../../../../context/ControlsContext";
import { useControls, useSound, useSpeech } from "../../../../hooks";
import useTimeActivity from "../../../../hooks/useActivity/useTimeActivity/useTimeActivity";
import { animate, appendClass } from "../../../../lib";
import type { ActivityComponent } from "../../../../types";
import { PushButton } from "../../../core";
import { OnScreenJoystick } from "../../../global";
import { POSSIBLE_SHAPES } from "../AlignActivity/constants";
import Shape from "./Shape";
import { POSSIBLE_COLORS } from "./constants";
import type { ShapeColor, ShapeType } from "./types";
import Utils from "./utils";

const TrackingActivity: ActivityComponent<{
  "tracking-type": "Pursuit" | "Compensatory" | "Dual Compensatory";
  "activity-type": "Tracking Only" | "with Shapes" | "with Calculations";
}> = ({
  activityObject,
  activityState,
  activityActions,
  activityParams,
  ...rest
}) => {
  const {
    addControlEventListener,
    removeControlEventListener,
    onScreenJoystickSize,
    onScreenJoystickPosition,
  } = useControls();

  const { playSound } = useSound();
  const { msg } = useSpeech();

  const mainContainer = useRef<HTMLDivElement>(null);

  const secondaryContainer = useRef<HTMLDivElement>(null);

  const pieTimerZone = useRef<HTMLDivElement>(null);
  const mainOnScreenJoystickZone = useRef<HTMLDivElement>(null);
  const secondaryOnScreenJoystickZone = useRef<HTMLDivElement>(null);

  const correctButtonRef = useRef<HTMLButtonElement>(null);

  const mainAxes = useRef({ x: 0, y: 0 });
  const secondaryAxes = useRef({ x: 0, y: 0 });

  const wasdAxes = useRef({ x: 0, y: 0 });
  const arrowsAxes = useRef({ x: 0, y: 0 });

  const accurateTime = useRef(0);
  const userRightDecimal = useRef(0);

  const mainWhiteDot = useRef<HTMLDivElement>(null);
  const mainOrangeDot = useRef<HTMLDivElement>(null);
  const mainWhiteRing = useRef<HTMLDivElement>(null);

  const secondaryWhiteDot = useRef<HTMLDivElement>(null);
  const [secondaryWhiteDotAccurate, setSecondaryWhiteDotAccurate] =
    useState(false);

  const secondaryWhiteRing = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  const [mainWhiteDotPosition, setMainWhiteDotPosition] = useState({
    x: 0,
    y: 0,
  });
  const [mainWhiteDotAccurate, setMainWhiteDotAccurate] = useState(false);

  const [mainOrangeDotPosition, setMainOrangeDotPosition] = useState({
    x: 0,
    y: 0,
  });
  const [orangeDotAccurate, setOrangeDotAccurate] = useState(false);

  const [secondaryWhiteDotPosition, setSecondaryWhiteDotPosition] = useState({
    x: 0,
    y: 0,
  });

  const [currentShape, setCurrentShape] = useState<
    { type: ShapeType; color: ShapeColor } | undefined
  >(undefined);

  const [correctClicked, setCorrectedClicked] = useState(false);

  const trackingType = activityParams
    ? activityParams["tracking-type"]
    : "Pursuit";
  const activityType = activityParams
    ? activityParams["activity-type"]
    : "Tracking Only";

  const { checkShapesAnswer, playRandomShape, generateNewShapesState } =
    useMemo(() => {
      var statesCount = 0;
      var userRightCount = 0;
      var currentShape: { type: ShapeType; color: ShapeColor };
      var currentShapeState: { type: ShapeType; color: ShapeColor };
      var alreadyIdentified = false;

      return { checkShapesAnswer, playRandomShape, generateNewShapesState };

      function checkShapesAnswer() {
        if (
          !alreadyIdentified &&
          currentShape?.type === currentShapeState.type &&
          currentShape.color === currentShapeState.color
        ) {
          activityActions.activityIncreaseScore(1);

          alreadyIdentified = true;

          userRightCount += 1;

          userRightDecimal.current = userRightCount / statesCount;
        }
      }

      function playRandomShape() {
        const newCurrentShape = {
          type: _.sample([
            currentShapeState.type,
            _.sample(POSSIBLE_SHAPES)!,
            _.sample(POSSIBLE_SHAPES)!,
          ])!,
          color: _.sample([
            currentShapeState.color,
            _.sample(POSSIBLE_COLORS)!,
            _.sample(POSSIBLE_COLORS)!,
          ])!,
        };

        setCurrentShape(newCurrentShape);

        currentShape = newCurrentShape;
        alreadyIdentified = false;
      }

      function generateNewShapesState() {
        const newShapesState = {
          type: _.sample(POSSIBLE_SHAPES)!,
          color: _.sample(POSSIBLE_COLORS)!,
        };

        const soundFile = `${process.env.PUBLIC_URL}/sounds/${newShapesState.color}_${newShapesState.type}.mp3`;

        playSound(soundFile);

        currentShapeState = newShapesState;

        activityActions.activityIncreaseMaxScore(1);

        statesCount += 1;
      }
    }, [activityActions, playSound]);

  const { checkIfCalculationRight, generateNewCalculationsState } =
    useMemo(() => {
      var statesCount = 0;
      var userRightCount = 0;
      var alreadyAnswered = false;
      var currentCalculationsState:
        | {
            op1: number;
            act: "add" | "sub" | "mul" | "div";
            op2: number;
            suggestedAnswer: number;
          }
        | undefined = undefined;

      return { checkIfCalculationRight, generateNewCalculationsState };

      function checkIfCalculationRight() {
        if (!currentCalculationsState) return;

        if (
          !alreadyAnswered &&
          currentCalculationsState.suggestedAnswer ===
            getRightAnswer(
              currentCalculationsState.op1,
              currentCalculationsState.act,
              currentCalculationsState.op2
            )
        ) {
          activityActions.activityIncreaseScore(1);

          userRightCount += 1;

          userRightDecimal.current = userRightCount / statesCount;
        }

        alreadyAnswered = true;
      }

      function generateNewCalculationsState() {
        const act = _.sample(["add", "sub", "mul", "div"] as (
          | "add"
          | "sub"
          | "mul"
          | "div"
        )[])!;
        var op1: number;
        do {
          op1 = _.random(3, 33);
        } while (act === "div" && isPrime(op1));
        var op2: number;
        do {
          op2 = _.random(3, 33);
        } while (
          (act === "div" && op1 % op2 !== 0) ||
          (act === "mul" && op1 * op2 > 99)
        );

        currentCalculationsState = {
          op1,
          act,
          op2,
          suggestedAnswer: _.sample([
            getRightAnswer(op1, act, op2),
            _.random(9, 99),
          ])!,
        };

        msg.text = `${currentCalculationsState.op1} ! ${getVerbalAction(
          currentCalculationsState.act
        )} ! ${currentCalculationsState.op2}} ! equals ${
          currentCalculationsState.suggestedAnswer
        }`;

        alreadyAnswered = false;

        window.speechSynthesis.speak(msg);

        statesCount += 1;

        activityActions.activityIncreaseMaxScore(1);

        function getVerbalAction(act: "add" | "sub" | "mul" | "div") {
          switch (act) {
            case "add":
              return "plus";
            case "sub":
              return "minus";
            case "mul":
              return "multiplied by";
            case "div":
              return "divided by";
          }
        }

        function isPrime(num: number) {
          for (let i = 2, s = Math.sqrt(num); i <= s; i++)
            if (num % i === 0) return false;
          return num > 1;
        }
      }

      function getRightAnswer(
        op1: number,
        act: "add" | "sub" | "mul" | "div",
        op2: number
      ) {
        switch (act) {
          case "add":
            return op1 + op2;
          case "sub":
            return op1 - op2;
          case "mul":
            return op1 * op2;
          case "div":
            return op1 / op2;
        }
      }
    }, [activityActions, msg]);

  useTimeActivity(activityObject, activityState, activityActions);

  const onSecondaryOnScreenJoystickAxesChange = useCallback((axes: Axis) => {
    secondaryAxes.current = { ...axes };
  }, []);

  // Hide score indicator when not in use:
  useEffect(() => {
    if (activityType === "Tracking Only")
      (document.querySelector("#scoreSpan") as HTMLElement).style.display =
        "none";
  }, [activityType]);

  //  Axes listeners setup:
  useEffect(
    function setupMainAxesListener() {
      const onScreenJoystickAxesChangeListener = addControlEventListener(
        "on-screen-joystick-axes-change",
        (axes) => {
          mainAxes.current = { ...axes };
        }
      );

      const leftJoystickAxesChangeListener = addControlEventListener(
        "left-physical-axes-change",
        (axes) => {
          if (onScreenJoystickPosition === OnScreenJoystickPosition.Left)
            mainAxes.current = { ...axes };
          else if (onScreenJoystickPosition === OnScreenJoystickPosition.Right)
            secondaryAxes.current = { ...axes };
        }
      );

      const rightJoystickAxesChangeListener = addControlEventListener(
        "right-physical-axes-change",
        (axes) => {
          if (onScreenJoystickPosition === OnScreenJoystickPosition.Right)
            mainAxes.current = { ...axes };
          else if (onScreenJoystickPosition === OnScreenJoystickPosition.Left)
            secondaryAxes.current = { ...axes };
        }
      );

      const wasdKeysPressListener = addControlEventListener(
        "wasd-key-press",
        (keys) => {
          wasdAxes.current = {
            x: keys.a ? -1 : keys.d ? 1 : 0,
            y: keys.w ? -1 : keys.s ? 1 : 0,
          };
        }
      );

      const arrowsKeysPressListener = addControlEventListener(
        "arrow-key-press",
        (keys) => {
          arrowsAxes.current = {
            x: keys.left ? -1 : keys.right ? 1 : 0,
            y: keys.up ? -1 : keys.down ? 1 : 0,
          };
        }
      );

      return () => {
        removeControlEventListener(onScreenJoystickAxesChangeListener);
        removeControlEventListener(leftJoystickAxesChangeListener);
        removeControlEventListener(rightJoystickAxesChangeListener);
        removeControlEventListener(wasdKeysPressListener);
        removeControlEventListener(arrowsKeysPressListener);
      };
    },
    [
      addControlEventListener,
      removeControlEventListener,
      onScreenJoystickPosition,
    ]
  );

  useEffect(function setDotInCenter() {
    if (!mainContainer.current) return;

    const mainContainerCenter = {
      x: mainContainer.current.clientWidth / 2,
      y: mainContainer.current.clientHeight / 2,
    };

    setMainWhiteDotPosition(mainContainerCenter);
    setMainOrangeDotPosition(mainContainerCenter);

    if (!secondaryContainer.current) return;

    const secondaryContainerCenter = {
      x: secondaryContainer.current.clientWidth / 2,
      y: secondaryContainer.current.clientHeight / 2,
    };

    setSecondaryWhiteDotPosition(secondaryContainerCenter);
  }, []);

  useEffect(() => {
    if (!activityState.paused) {
      const animationsCleanups: (() => void)[] = [];

      if (trackingType === "Pursuit") {
        const mainOrangeDotAnimationCancel = animate(() => {
          const axes = mainAxes.current;

          setMainOrangeDotPosition((position) => {
            if (!mainOrangeDot.current || !mainContainer.current)
              return position;

            const relevantKeyboardAxis =
              onScreenJoystickPosition === OnScreenJoystickPosition.Left
                ? wasdAxes
                : arrowsAxes;

            const newPositionX =
              position.x +
              axes.x * 5 * activityState.speed +
              relevantKeyboardAxis.current.x * 5 * activityState.speed;
            const newPositionY =
              position.y -
              axes.y * 5 * activityState.speed +
              relevantKeyboardAxis.current.y * 5 * activityState.speed;

            if (
              Utils.checkForCollision({
                dot: {
                  x: newPositionX,
                  y: newPositionY,
                  radius: mainOrangeDot.current.clientWidth / 2,
                },
                container: mainContainer.current,
                collisionElements:
                  pieTimerZone.current && mainOnScreenJoystickZone.current
                    ? [pieTimerZone.current, mainOnScreenJoystickZone.current]
                    : [],
              }).collision
            )
              return position;

            return {
              x: newPositionX,
              y: newPositionY,
            };
          });
        });

        animationsCleanups.push(mainOrangeDotAnimationCancel);
      }

      if (!mainWhiteDot.current || !mainContainer.current) return;

      const getMainWhiteDotNextPosition = getDotPositionAnimation({
        dot: mainWhiteDot.current,
        container: mainContainer.current,
        collisionElements:
          pieTimerZone.current && mainOnScreenJoystickZone.current
            ? [pieTimerZone.current, mainOnScreenJoystickZone.current]
            : undefined,
      });

      const mainWhiteDotAnimationCancel = animate(() => {
        const relevantKeyboardAxis =
          onScreenJoystickPosition === OnScreenJoystickPosition.Left
            ? wasdAxes
            : arrowsAxes;

        setMainWhiteDotPosition((position) => {
          const newPosition = getMainWhiteDotNextPosition({
            position,
            axes:
              trackingType === "Pursuit"
                ? { x: 0, y: 0 }
                : {
                    x: mainAxes.current.x + relevantKeyboardAxis.current.x,
                    y: mainAxes.current.y - relevantKeyboardAxis.current.y,
                  },
          });

          return newPosition;
        });
      });

      animationsCleanups.push(mainWhiteDotAnimationCancel);

      if (trackingType === "Dual Compensatory") {
        if (!secondaryWhiteDot.current || !secondaryContainer.current) return;

        const getSecondaryWhiteDotNextPosition = getDotPositionAnimation({
          dot: secondaryWhiteDot.current,
          container: secondaryContainer.current,
          collisionElements:
            pieTimerZone.current && secondaryOnScreenJoystickZone.current
              ? [pieTimerZone.current, secondaryOnScreenJoystickZone.current]
              : undefined,
        });

        const secondaryWhiteDotAnimationCancel = animate(() => {
          const relevantKeyboardAxis =
            onScreenJoystickPosition === OnScreenJoystickPosition.Right
              ? wasdAxes
              : arrowsAxes;

          setSecondaryWhiteDotPosition((position) => {
            const newPosition = getSecondaryWhiteDotNextPosition({
              position,
              axes: {
                x: secondaryAxes.current.x + relevantKeyboardAxis.current.x,
                y: secondaryAxes.current.y - relevantKeyboardAxis.current.y,
              },
            });

            return newPosition;
          });
        });

        animationsCleanups.push(secondaryWhiteDotAnimationCancel);
      }

      return () => animationsCleanups.forEach((cleanup) => cleanup());
    }

    function getDotPositionAnimation(options: {
      dot: HTMLDivElement;
      container: HTMLDivElement;
      collisionElements?: HTMLDivElement[];
    }) {
      const { dot, container, collisionElements } = options;

      var [xVector, yVector] = generateNewVectors();
      var lastVectorChange = Date.now();

      return (data: {
        position: { x: number; y: number };
        axes: { x: number; y: number };
      }) => {
        const { position, axes } = data;

        const now = Date.now();
        if (now - lastVectorChange >= _.random(700, 1500)) {
          lastVectorChange = now;
          [xVector, yVector] = generateNewVectors();
        }

        const { collision, newXVector, newYVector } = Utils.checkForCollision({
          dot: {
            radius: dot.clientWidth / 2,
            x:
              position.x +
              (xVector - Math.abs(axes.x) * xVector) +
              axes.x * 5 * activityState.speed,
            y:
              position.y +
              (yVector - Math.abs(axes.y) * yVector) -
              axes.y * 5 * activityState.speed,
            xVector: xVector - Math.abs(axes.x) * xVector,
            yVector: yVector - Math.abs(axes.y) * yVector,
          },
          container,
          collisionElements,
        });

        if (collision) {
          if (newXVector) {
            xVector = newXVector;
            lastVectorChange = now;
          }
          if (newYVector) {
            yVector = newYVector;
            lastVectorChange = now;
          }

          return position;
        }

        return {
          x:
            position.x +
            (xVector - Math.abs(axes.x) * xVector) +
            axes.x * 5 * activityState.speed,
          y:
            position.y +
            (yVector - Math.abs(axes.y) * yVector) -
            axes.y * 5 * activityState.speed,
        };
      };

      function generateNewVectors(
        minSpeed = 2 * activityState.speed,
        maxSpeed = 2 * activityState.speed
      ) {
        const xVector = _.random(minSpeed, maxSpeed) * _.sample([1, -1])!;
        const yVector = _.random(minSpeed, maxSpeed) * _.sample([1, -1])!;

        return [xVector, yVector];
      }
    }
  }, [
    activityState.paused,
    activityState.speed,
    onScreenJoystickPosition,
    trackingType,
  ]);

  /*
   * Accuracy check functionality:
   */
  useEffect(() => {
    if (trackingType === "Pursuit") {
      return animate(() => {
        if (!mainWhiteDot.current || !mainOrangeDot.current) return;

        const distance = calculateDistance(
          {
            x: mainWhiteDotPosition.x,
            y: mainWhiteDotPosition.y,
            radius: mainWhiteDot.current.clientWidth / 2,
          },
          {
            x: mainOrangeDotPosition.x,
            y: mainOrangeDotPosition.y,
            radius: mainOrangeDot.current.clientWidth / 2,
          }
        );

        if (distance <= 50) setOrangeDotAccurate(true);
        else setOrangeDotAccurate(false);
      });
    }

    const animationsCleanups: (() => void)[] = [];

    const mainWhiteDotAnimationCleanup = animate(() => {
      if (!mainWhiteDot.current || !mainWhiteRing.current) return;

      const distance = calculateDistance(
        {
          x: mainWhiteDotPosition.x,
          y: mainWhiteDotPosition.y,
          radius: mainWhiteDot.current.clientWidth / 2,
        },
        {
          x: mainWhiteRing.current.offsetLeft,
          y: mainWhiteRing.current.offsetTop,
          radius: mainWhiteRing.current.clientWidth / 2,
        }
      );

      if (distance <= 50) setMainWhiteDotAccurate(true);
      else setMainWhiteDotAccurate(false);
    });

    animationsCleanups.push(mainWhiteDotAnimationCleanup);

    if (trackingType === "Dual Compensatory") {
      const secondaryWhiteDotAnimationCleanup = animate(() => {
        if (!secondaryWhiteDot.current || !secondaryWhiteRing.current) return;

        const distance = calculateDistance(
          {
            x: secondaryWhiteDotPosition.x,
            y: secondaryWhiteDotPosition.y,
            radius: secondaryWhiteDot.current.clientWidth / 2,
          },
          {
            x: secondaryWhiteRing.current.offsetLeft,
            y: secondaryWhiteRing.current.offsetTop,
            radius: secondaryWhiteRing.current.clientWidth / 2,
          }
        );

        if (distance <= 50) setSecondaryWhiteDotAccurate(true);
        else setSecondaryWhiteDotAccurate(false);
      });

      animationsCleanups.push(secondaryWhiteDotAnimationCleanup);
    }

    return () => animationsCleanups.forEach((cleanup) => cleanup());

    function calculateDistance(
      dot1: { x: number; y: number; radius: number },
      dot2: { x: number; y: number; radius: number }
    ) {
      const distance =
        Math.sqrt(
          Math.pow(Math.abs(dot1.x - dot2.x), 2) +
            Math.pow(Math.abs(dot1.y - dot2.y), 2)
        ) -
        (dot1.radius + dot2.radius);

      return distance;
    }
  }, [
    trackingType,
    mainOrangeDotPosition,
    mainWhiteDotPosition,
    secondaryWhiteDotPosition,
  ]);

  /*
   * Final score calculation:
   */
  useEffect(() => {
    var mainOrangeDotAccurateTime = Date.now();
    var mainWhiteDotAccurateTime = Date.now();
    var secondaryWhiteDotAccurateTime = Date.now();

    if (orangeDotAccurate) mainOrangeDotAccurateTime = Date.now();

    if (mainWhiteDotAccurate) mainWhiteDotAccurateTime = Date.now();

    if (secondaryWhiteDotAccurate) secondaryWhiteDotAccurateTime = Date.now();

    return animate(() => {
      if (orangeDotAccurate)
        accurateTime.current += Date.now() - mainOrangeDotAccurateTime;

      if (mainWhiteDotAccurate)
        accurateTime.current += Date.now() - mainWhiteDotAccurateTime;

      if (secondaryWhiteDotAccurate)
        accurateTime.current += Date.now() - secondaryWhiteDotAccurateTime;
    });
  }, [orangeDotAccurate, mainWhiteDotAccurate, secondaryWhiteDotAccurate]);

  /*
   * Shapes functionality:
   */
  useEffect(
    function playShapes() {
      var stateChangeInterval: NodeJS.Timeout;
      var shapeChangeInterval: NodeJS.Timeout;

      if (!activityState.paused && activityType === "with Shapes") {
        generateNewShapesState();
        stateChangeInterval = setInterval(
          generateNewShapesState,
          _.random(7000, 20000)
        );

        playRandomShape();
        shapeChangeInterval = setInterval(playRandomShape, 2000);

        document.addEventListener("keydown", onSpacebarPressed);

        return () => {
          clearInterval(stateChangeInterval);
          clearInterval(shapeChangeInterval);

          document.removeEventListener("keydown", onSpacebarPressed);
        };
      }

      function onSpacebarPressed(e: KeyboardEvent) {
        if (!(e.key === EVENT_KEYS.spaceBar)) return;

        checkShapesAnswer();
      }
    },
    [
      activityState.paused,
      activityType,
      checkShapesAnswer,
      generateNewShapesState,
      playRandomShape,
    ]
  );

  /*
   * Calculations functionality:
   */
  useEffect(() => {
    var stateChangeTimeout: NodeJS.Timeout;
    var shouldPlay = false;

    if (!activityState.paused && activityType === "with Calculations") {
      shouldPlay = true;
      window.speechSynthesis.resume();

      stateChangeTimeout = setTimeout(() => {
        generateNewCalculationsState();

        msg.onend = function onSpeechEnd() {
          stateChangeTimeout = setTimeout(
            () => {
              if (shouldPlay) generateNewCalculationsState();
            },
            _.random(9000, 12000)
          );
        };
      }, 5000);

      document.addEventListener("keydown", onSpacebarPressed);
      document.addEventListener("keyup", onSpacebarUp);

      return () => {
        clearTimeout(stateChangeTimeout);
        window.speechSynthesis.pause();

        document.removeEventListener("keydown", onSpacebarPressed);
        document.removeEventListener("keyup", onSpacebarUp);

        shouldPlay = false;
      };
    }

    function onSpacebarPressed(e: KeyboardEvent) {
      if (!(e.key === EVENT_KEYS.spaceBar)) return;

      if (correctButtonRef.current) correctButtonRef.current.click();

      setCorrectedClicked(true);
    }

    function onSpacebarUp(e: KeyboardEvent) {
      if (!(e.key === EVENT_KEYS.spaceBar)) return;

      setCorrectedClicked(false);
    }
  }, [msg, activityType, activityState.paused, generateNewCalculationsState]);

  useEffect(() => {
    pausedRef.current = activityState.paused;
  }, [activityState.paused]);

  /*
   * Set final score:
   */
  useEffect(() => {
    const startTime = Date.now();

    const animateCancel = animate(() => {
      if (pausedRef.current) return;

      const accuracy = Math.min(
        Math.round(getAccuracy(Date.now() - startTime) / 100),
        100
      );

      activityActions.activitySetArbitraryState({
        accuracy: `<span>${accuracy}<span style="font-size: 12px">%</span></span>`,
      });
    });

    return () => {
      animateCancel();

      const accuracy = getAccuracy(activityObject.sessionLength * 100);

      // const rightAnswerMultiplier =
      //   activityType !== "Tracking Only" ? userRightDecimal.current : 1;

      activityActions.activityIncreaseMaxScore(1);
      activityActions.activityIncreaseScore(accuracy / 100);

      activityActions.activitySetArbitraryState({
        accuracy,
      });
    };

    function getAccuracy(ofTime: number) {
      var accuratePrecentage = (accurateTime.current / ofTime) * 100;

      if (trackingType === "Dual Compensatory") accuratePrecentage /= 2;

      return accuratePrecentage;
    }
  }, [activityType, trackingType, activityActions, activityObject]);

  return (
    <div
      {...rest}
      className={appendClass("activity tracking-activity", rest.className)}
    >
      <div
        className="parent-container"
        style={{
          flexDirection:
            onScreenJoystickPosition === OnScreenJoystickPosition.Right
              ? "row"
              : "row-reverse",
        }}
      >
        {activityType === "with Shapes" && currentShape && (
          <Shape
            onClick={() => {
              if (!activityState.paused) checkShapesAnswer();
            }}
            type={currentShape.type}
            color={currentShape.color}
          />
        )}
        {trackingType === "Dual Compensatory" && (
          <div className="secondary-container-container">
            {activityState.trainingMode && (
              <>
                <div
                  className="guide vertical"
                  style={{
                    left: `calc(${secondaryWhiteDotPosition.x}px + 1vw)`,
                  }}
                />
                <div
                  className="guide horizontal"
                  style={{
                    top: `calc(${secondaryWhiteDotPosition.y}px + 1vw)`,
                  }}
                />
              </>
            )}
            <div className="secondary-container" ref={secondaryContainer}>
              <div
                className="dot white-ring"
                style={{
                  border: secondaryWhiteDotAccurate
                    ? `5px solid #92e744`
                    : undefined,
                }}
                ref={secondaryWhiteRing}
              />
              <div
                className="dot white-dot"
                style={{
                  left: secondaryWhiteDotPosition.x,
                  top: secondaryWhiteDotPosition.y,
                  backgroundColor: secondaryWhiteDotAccurate
                    ? "#92e744"
                    : undefined,
                  border: secondaryWhiteDotAccurate
                    ? "2px solid white"
                    : undefined,
                }}
                ref={secondaryWhiteDot}
              />
            </div>
          </div>
        )}
        <div className="main-container-container">
          <div className="inactive pie-timer-zone" ref={pieTimerZone} />
          <div
            className="inactive on-screen-joystick-zone"
            ref={mainOnScreenJoystickZone}
            style={
              onScreenJoystickPosition === OnScreenJoystickPosition.Right
                ? { right: 0 }
                : { left: 0 }
            }
          />
          {activityState.trainingMode && trackingType !== "Pursuit" && (
            <>
              <div
                className="guide vertical"
                style={{ left: `calc(${mainWhiteDotPosition.x}px + 1vw)` }}
              />
              <div
                className="guide horizontal"
                style={{ top: `calc(${mainWhiteDotPosition.y}px + 1vw)` }}
              />
            </>
          )}
          <div className="main-container" ref={mainContainer}>
            {(trackingType === "Compensatory" ||
              trackingType === "Dual Compensatory") && (
              <div
                className="dot white-ring"
                style={{
                  border: mainWhiteDotAccurate
                    ? `5px solid #92e744`
                    : undefined,
                }}
                ref={mainWhiteRing}
              />
            )}
            <div
              className="dot white-dot"
              style={{
                left: mainWhiteDotPosition.x,
                top: mainWhiteDotPosition.y,
                backgroundColor:
                  orangeDotAccurate || mainWhiteDotAccurate
                    ? "#92e744"
                    : undefined,
                width:
                  trackingType === "Pursuit" && activityState.trainingMode
                    ? 70
                    : undefined,
                height:
                  trackingType === "Pursuit" && activityState.trainingMode
                    ? 70
                    : undefined,
                border: mainWhiteDotAccurate ? "2px solid white" : undefined,
              }}
              ref={mainWhiteDot}
            />

            {trackingType === "Pursuit" && (
              <div
                className="dot orange-dot"
                style={{
                  left: mainOrangeDotPosition.x,
                  top: mainOrangeDotPosition.y,
                  backgroundColor: orangeDotAccurate ? "#92e744" : undefined,
                  border: orangeDotAccurate ? "2px solid #dc5538" : undefined,
                  width: activityState.trainingMode ? 60 : 20,
                  height: activityState.trainingMode ? 60 : 20,
                }}
                ref={mainOrangeDot}
              />
            )}
          </div>
        </div>

        {trackingType === "Dual Compensatory" && (
          <div
            className={`inactive on-screen-joystick-zone ${
              activityType === "with Calculations" ? "with-button" : ""
            }`}
            ref={secondaryOnScreenJoystickZone}
            style={
              onScreenJoystickPosition === OnScreenJoystickPosition.Right
                ? { left: 0 }
                : { right: 0 }
            }
          />
        )}
      </div>

      {activityType === "with Calculations" && (
        <PushButton
          className={`correct-button font-inter ${
            onScreenJoystickPosition === OnScreenJoystickPosition.Left
              ? "right"
              : "left"
          }`}
          overrideClick={correctClicked}
          onClick={checkIfCalculationRight}
          style={{
            width: (() => {
              switch (onScreenJoystickSize) {
                case OnScreenJoystickSize.S:
                  return "10vh";
                case OnScreenJoystickSize.M:
                  return "12.5vh";
                case OnScreenJoystickSize.L:
                  return "15vh";
              }
            })(),
            bottom: trackingType === "Dual Compensatory" ? undefined : 60,
          }}
          ref={correctButtonRef}
        >
          Correct
        </PushButton>
      )}
      {trackingType === "Dual Compensatory" && (
        <OnScreenJoystick
          color="#D8D8D8"
          activityObject={activityObject}
          position={
            onScreenJoystickPosition === OnScreenJoystickPosition.Right
              ? OnScreenJoystickPosition.Left
              : OnScreenJoystickPosition.Right
          }
          onAxesUpdate={onSecondaryOnScreenJoystickAxesChange}
        />
      )}
    </div>
  );
};

export default TrackingActivity;
