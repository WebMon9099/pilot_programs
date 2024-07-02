import _ from "lodash";
import { useCallback, useMemo, useRef, useState } from "react";
import { useStaticActivity, useTimeout } from "../../../../hooks";
import { appendClass } from "../../../../lib";
import { ActivityComponent } from "../../../../types";
import { PushButton } from "../../../core";
import {
  AVAILABLE_COLORS,
  AVAILABLE_LETTERS,
  NUMBER_OF_SETS_PER_PAGE,
  PAGE_SWITCH_TIME,
  QUESTION_TIME,
} from "./constants";
import { Set, Stages } from "./types";
import { drawCircle } from "./utils";

const VisualMemoryActivity: ActivityComponent = ({
  activityActions,
  activityObject,
  activityState,
  ...rest
}) => {
  const neededAnswerIndex = useRef(-1);

  const [sets, setSets] = useState<Set[]>([]);
  const [showSecondSet, setShowSecondSet] = useState(false);

  const generateNewSetsPage = useCallback((state: string) => {
    const availableColors = [...AVAILABLE_COLORS];

    let newSets = [];
    const existingLettersKeys: { [key: string]: boolean } = {};
    for (let i = 0; i < NUMBER_OF_SETS_PER_PAGE; ++i) {
      const isTheKeyACircle =
        _.sample([true, false])! && availableColors.length > 0;

      let key;
      if (isTheKeyACircle) {
        const colorIndex = _.random(availableColors.length - 1);

        key = drawCircle(availableColors[colorIndex]);

        availableColors.splice(colorIndex, 1);
      } else {
        do {
          key =
            AVAILABLE_LETTERS[_.random(AVAILABLE_LETTERS.length - 1)] +
            AVAILABLE_LETTERS[_.random(AVAILABLE_LETTERS.length - 1)];
        } while (existingLettersKeys[key] === false);

        existingLettersKeys[key] = false;
      }

      newSets.push({
        key,
        value: `${_.random(10, 100)}`,
      });
    }

    neededAnswerIndex.current = _.random(newSets.length - 1);
    newSets[neededAnswerIndex.current].value = state;

    setSets(newSets);
  }, []);

  useTimeout(
    useCallback(() => setShowSecondSet(true), []),
    PAGE_SWITCH_TIME,
    activityState.paused,
    !activityState.trainingMode
  );

  const {
    stage,
    state: pickedKeyValue,
    choices,
    userAnswer,
    setUserAnswer,
    submitActivity,
  } = useStaticActivity(
    {
      stages: [
        {
          name: Stages.Show,
          time: PAGE_SWITCH_TIME,
        },
        { name: Stages.Question, time: QUESTION_TIME },
      ],
      stateCreator: useCallback(() => {
        activityActions.activityIncreaseMaxScore(1);

        return `${_.random(10, 100)}`;
      }, [activityActions]),
      stateChangeHandler: useCallback(
        (state: string) => generateNewSetsPage(state),
        [generateNewSetsPage]
      ),
      choicesCreator: useCallback(
        () => ({
          numbers: ["7", "8", "9", "4", "5", "6", "1", "2", "3"],
          del: "DEL",
          zero: "0",
          ok: "OK",
        }),
        []
      ),
      initialUserAnswer: "",
      getScore: useCallback(
        (pickedKeyValue: string, userAnswer: string) =>
          userAnswer === pickedKeyValue ? 1 : 0,
        []
      ),
    },
    activityObject,
    activityState,
    activityActions
  );

  const displayJSX = useMemo(() => {
    if (stage === Stages.Show && !showSecondSet) {
      return sets.slice(0, 4).map((set, index) => (
        <div className="set" key={index}>
          <div className="key">{set.key}</div>
          <div className="value">{set.value}</div>
        </div>
      ));
    } else if (stage === Stages.Show && showSecondSet) {
      return sets.slice(4, sets.length).map((set, index) => (
        <div className="set" key={index}>
          <div className="key">{set.key}</div>
          <div className="value">{set.value}</div>
        </div>
      ));
    } else if (stage === Stages.Question && !activityState.submitted) {
      return (
        <div className="question">
          <div className="key">{sets[neededAnswerIndex.current].key}</div>
          <p className="font-inter">{userAnswer === "" ? "?" : userAnswer}</p>
        </div>
      );
    } else if (
      stage === Stages.Question &&
      activityState.submitted &&
      activityState.trainingMode
    ) {
      return (
        <div className="answer">
          <div className="top">
            <div className="key">{sets[neededAnswerIndex.current].key}</div>
            <p
              className="font-inter"
              style={{
                color: pickedKeyValue === userAnswer ? "#92e744" : "#f1504c",
              }}
            >
              {userAnswer === "" ? "?" : userAnswer}
            </p>
          </div>
          {!(pickedKeyValue === userAnswer) ? (
            <p className="correct-answer font-inter">
              Correct Answer: {sets[neededAnswerIndex.current].value}
            </p>
          ) : null}
        </div>
      );
    } else return null;
  }, [
    activityState.submitted,
    activityState.trainingMode,
    sets,
    showSecondSet,
    stage,
    pickedKeyValue,
    userAnswer,
  ]);

  return (
    <div
      {...rest}
      className={appendClass("activity visual-memory-activity", rest.className)}
    >
      <div className="display-container">
        <div className="display">{displayJSX}</div>
      </div>
      <div className="numpad-container font-inter">
        <div
          className={`${
            (stage !== Stages.Question ||
              activityState.submitted ||
              activityState.paused) &&
            "disabled"
          } numpad`}
        >
          {choices.numbers.map((number, index) => (
            <PushButton
              onClick={() => {
                if (userAnswer.length < 2) setUserAnswer(userAnswer + number);
              }}
              key={index}
            >
              {number}
            </PushButton>
          ))}
          <PushButton
            className="action delete"
            onClick={() =>
              setUserAnswer(userAnswer.substring(0, userAnswer.length - 1))
            }
          >
            {choices.del}
          </PushButton>
          <PushButton
            onClick={() => {
              if (userAnswer.length < 2)
                setUserAnswer(userAnswer + choices.zero);
            }}
          >
            {choices.zero}
          </PushButton>
          <PushButton className="action ok" onClick={submitActivity}>
            {choices.ok}
          </PushButton>
        </div>
      </div>
    </div>
  );
};

export default VisualMemoryActivity;
