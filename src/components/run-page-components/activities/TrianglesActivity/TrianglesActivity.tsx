import _ from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { COLORS } from "../../../../constants";
import { useInterval, useStaticActivity, useTimeout } from "../../../../hooks";
import { appendClass } from "../../../../lib";
import { ActivityComponent } from "../../../../types";
import { PushButton } from "../../../core";
import AnswersBoard from "./AnswersBoard";
import RulesPage from "./RulesPage";
import {
  RULES_SHOWING_TIME,
  SECOND_TRIANGLES_SHOWING_TIME,
  STARTING_TRIANGLE_SHOWING_TIME,
  TIME_FOREACH_TRIANGLE,
  TRIANGLES_AMOUNT,
} from "./constants";
import { Rule, Stages, Triangle } from "./types";
import Utils from "./utils";

const TrianglesActivity: ActivityComponent = ({
  activityActions,
  activityObject,
  activityState,
  ...rest
}) => {
  const inputBoxRefs: { [key: number]: React.RefObject<HTMLButtonElement> } =
    useRef({
      0: useRef<HTMLButtonElement>(null),
      1: useRef<HTMLButtonElement>(null),
      2: useRef<HTMLButtonElement>(null),
    }).current;

  const [gameState, setGameState] = useState<{
    viewedRules: Rule[];
    pickedRules: Rule[];
    triangles: Triangle[];
  }>({
    viewedRules: [],
    pickedRules: [],
    triangles: [],
  });
  const [userAnswer, setUserAnswer] = useState<number[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  const {
    stage,
    nextStage,
    state: pickedRuleIndexes,
  } = useStaticActivity(
    {
      stages: [
        {
          name: Stages.RulesPage,
          time: RULES_SHOWING_TIME,
        },
        {
          name: Stages.StartingTriangle,
          time: STARTING_TRIANGLE_SHOWING_TIME,
        },
        {
          name: Stages.SecondTriangles,
          time: SECOND_TRIANGLES_SHOWING_TIME,
        },
      ],
      stateCreator: useCallback(() => {
        activityActions.activityIncreaseMaxScore(TRIANGLES_AMOUNT);

        return new Array(TRIANGLES_AMOUNT).fill(null).map(() => _.random(2));
      }, [activityActions]),
      stateChangeHandler: useCallback((pickedRuleIndexes: number[]) => {
        const viewedRules = Utils.generateThreeRules();

        const startingTriangle = Utils.generateRandomTriangle();

        const pickedRules: Rule[] = [];
        const triangles: Triangle[] = [startingTriangle];

        for (let i = 1; i <= TRIANGLES_AMOUNT; i++) {
          const previousTriangle = triangles[i - 1];

          const [pickedRule, filteredRules] = Utils.pickRuleAndGenerate(
            viewedRules,
            pickedRuleIndexes[i - 1]
          );

          const secondTriangle = Utils.generateAppropriateTriangle(
            previousTriangle,
            filteredRules
          );

          pickedRules.push(pickedRule);
          triangles.push(secondTriangle);
        }

        setGameState({
          viewedRules,
          pickedRules,
          triangles,
        });
      }, []),
      choicesCreator: useCallback(() => [0, 1, 2], []),
      initialUserAnswer: [],
      getScore: useCallback(() => {}, []),
    },
    activityObject,
    activityState,
    activityActions
  );

  const [currentTriangleIndex, setCurrentTriangleIndex] = useState(1);

  const nextState = useCallback(() => {
    setCurrentTriangleIndex((index) => {
      if (index < TRIANGLES_AMOUNT + 1 - 1) {
        activityActions.activityNextStage(
          `SecondTriangle-${index + 1}`,
          TIME_FOREACH_TRIANGLE
        );
        return index + 1;
      }
      return index;
    });
  }, [activityActions, setCurrentTriangleIndex]);

  useInterval(
    useCallback(() => nextState(), [nextState]),
    TIME_FOREACH_TRIANGLE,
    stage !== Stages.SecondTriangles || activityState.paused || showAnswer,
    `SecondTriangle-${currentTriangleIndex}`
  );

  useTimeout(
    useCallback(() => {
      activityActions.activityUnfreeze();

      nextState();

      setShowAnswer(false);
    }, [activityActions, nextState]),
    activityObject.showAnswerTime,
    activityState.paused,
    showAnswer
  );

  useEffect(() => {
    activityActions.activityFreeze();
  }, [activityActions]);

  useEffect(() => {
    if (stage === Stages.SecondTriangles) {
      activityActions.activityUnfreeze();
      activityActions.activityNextStage(
        "SecondTriangle",
        TIME_FOREACH_TRIANGLE
      );
    }
  }, [activityActions, stage]);

  useEffect(() => {
    if (stage === Stages.SecondTriangles) {
      const keydownHandlers = gameState.viewedRules.map((rule, index) => {
        const keydownHandler = (e: KeyboardEvent) => {
          if (e.key === rule.buttonKey) inputBoxRefs[index].current?.click();
        };

        document.addEventListener("keydown", keydownHandler);

        return keydownHandler;
      });

      return () =>
        keydownHandlers.forEach((handler) =>
          document.removeEventListener("keydown", handler)
        );
    }
  }, [gameState.viewedRules, inputBoxRefs, stage]);

  const currentRulesStrings = useMemo(
    () => gameState.viewedRules.map((rule) => Utils.stringifyRule(rule)),
    [gameState.viewedRules]
  );

  const currentTriangle = gameState.triangles[currentTriangleIndex];
  const previousTriangle = gameState.triangles[currentTriangleIndex - 1];
  const currentUserAnswer = userAnswer[currentTriangleIndex - 1];

  function mapStageToJsx() {
    if (stage === Stages.RulesPage)
      return (
        <RulesPage
          disableNextButton={activityState.paused}
          rules={currentRulesStrings}
          onNext={nextStage}
        />
      );
    else if (stage === Stages.StartingTriangle) {
      return (
        <div className="starting-triangle-container font-inter">
          <h1>Starting Triangle:</h1>
          <img
            src={previousTriangle?.img || ""}
            style={{
              transform: `rotate(${previousTriangle?.orientation}deg)`,
            }}
            alt="triangle"
          />
        </div>
      );
    } else if (stage === Stages.SecondTriangles) {
      const getInputBoxBorder = (index: number) => {
        if (!showAnswer) return undefined;

        if (currentUserAnswer === index) {
          if (pickedRuleIndexes[currentTriangleIndex - 1] === index)
            return `3px solid #92e744`;
          else return `3px solid #f1504c`;
        } else if (pickedRuleIndexes[currentTriangleIndex - 1] === index)
          return `3px solid #92e744`;

        return undefined;
      };

      return (
        <div className="second-triangle-container">
          <div className="placeholder"></div>
          <PushButton
            ref={inputBoxRefs[0]}
            className="input-box"
            style={{
              border: getInputBoxBorder(0),
              backgroundColor:
                showAnswer &&
                (currentUserAnswer === 0 ||
                  pickedRuleIndexes[currentTriangleIndex - 1] === 0)
                  ? COLORS.white
                  : undefined,
            }}
            onClick={() => checkAnswer(0)}
            disabled={showAnswer || activityState.paused}
          ></PushButton>
          <div className="placeholder"></div>
          <div className="placeholder"></div>
          <img
            className="triangle"
            src={currentTriangle.img || ""}
            style={{
              transform: `rotate(${currentTriangle.orientation}deg)`,
            }}
            alt="triangle"
          />
          <PushButton
            ref={inputBoxRefs[1]}
            className="input-box"
            style={{
              border: getInputBoxBorder(1),
              backgroundColor:
                showAnswer &&
                (currentUserAnswer === 1 ||
                  pickedRuleIndexes[currentTriangleIndex - 1] === 1)
                  ? COLORS.white
                  : undefined,
            }}
            onClick={() => checkAnswer(1)}
            disabled={showAnswer || activityState.paused}
          ></PushButton>
          <div className="placeholder"></div>
          <PushButton
            ref={inputBoxRefs[2]}
            className="input-box"
            style={{
              border: getInputBoxBorder(2),
              backgroundColor:
                showAnswer &&
                (currentUserAnswer === 2 ||
                  pickedRuleIndexes[currentTriangleIndex - 1] === 2)
                  ? COLORS.white
                  : undefined,
            }}
            onClick={() => checkAnswer(2)}
            disabled={showAnswer || activityState.paused}
          ></PushButton>
          <div className="placeholder"></div>
        </div>
      );
    }
  }

  return (
    <div
      {...rest}
      className={appendClass("activity triangles-activity", rest.className)}
    >
      {showAnswer ? (
        <AnswersBoard
          triangle={previousTriangle!}
          rules={gameState.viewedRules}
          correctRuleIndex={pickedRuleIndexes[currentTriangleIndex - 1]}
          // dimensions={answerBoardDimensions}
        />
      ) : null}
      {mapStageToJsx()}
    </div>
  );

  function checkAnswer(ruleIndex: number) {
    if (ruleIndex === pickedRuleIndexes[currentTriangleIndex - 1])
      activityActions.activityIncreaseScore(1);

    if (activityState.trainingMode) {
      activityActions.activityFreeze();
      activityActions.activityNextStage(
        "ShowAnswer",
        activityObject.showAnswerTime
      );
      setShowAnswer(true);
    } else nextState();

    if (userAnswer.length < TRIANGLES_AMOUNT - 1)
      setUserAnswer((userAnswer) => [...userAnswer, ruleIndex]);
    else activityActions.activitySetSubmit(true);
  }
};

export default TrianglesActivity;
