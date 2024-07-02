import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTimeout } from '../../../../hooks';
import useTimeActivity from '../../../../hooks/useActivity/useTimeActivity/useTimeActivity';
import { appendClass } from '../../../../lib';
import type { ActivityComponent } from '../../../../types';
import { PushButton } from '../../../core';
import {
  POSSIBLE_ANSWERS,
  POSSIBLE_CHOICES,
  POSSIBLE_DIRECTIONS,
} from './constants';
import { type Choice, type Direction } from './types';

const SenseOfDirectionActivity: ActivityComponent = ({
  activityObject,
  activityState,
  activityActions,
  activityParams,
  ...rest
}) => {
  const lastDirection = useRef<Direction | undefined>();

  const [directionsState, setDirectionsState] = useState<
    { startDirection: Direction; newDirection: Direction } | undefined
  >();
  const [state, setState] = useState<Choice | undefined>();
  const [statesCount, setStatesCount] = useState(0);
  const [showsAnswers, setShowsAnswers] = useState(false);
  const [userAnswer, setUserAnswer] = useState<Choice | undefined>();

  useTimeActivity(activityObject, activityState, activityActions);

  const createNewState = useCallback(() => {
    const correctChoice = _.sample(POSSIBLE_CHOICES)!;

    setShowsAnswers(false);
    setUserAnswer(undefined);
    setStatesCount((state) => state + 1);

    const startDirection =
      lastDirection.current || _.sample(POSSIBLE_DIRECTIONS)!;
    const newDirection = POSSIBLE_DIRECTIONS.find(
      (direction) =>
        direction.direction ===
        getNewDirectionForChoice(startDirection, correctChoice)
    )!;

    lastDirection.current = newDirection;

    setDirectionsState({ startDirection, newDirection });

    activityActions.activityIncreaseMaxScore(1);

    return setState(correctChoice);

    function getNewDirectionForChoice(
      startDirection: Direction,
      choice: Choice
    ): 'up' | 'right' | 'down' | 'left' {
      const { direction } = startDirection;
      const { direction: choiceDirection } = choice;

      if (direction === 'up') {
        if (choiceDirection === 'right') return 'right';
        else if (choiceDirection === 'reverse') return 'down';
        else if (choiceDirection === 'left') return 'left';
      } else if (direction === 'right') {
        if (choiceDirection === 'right') return 'down';
        else if (choiceDirection === 'reverse') return 'left';
        else if (choiceDirection === 'left') return 'up';
      } else if (direction === 'down') {
        if (choiceDirection === 'right') return 'left';
        else if (choiceDirection === 'reverse') return 'up';
        else if (choiceDirection === 'left') return 'right';
      } else if (direction === 'left') {
        if (choiceDirection === 'right') return 'up';
        else if (choiceDirection === 'reverse') return 'right';
        else if (choiceDirection === 'left') return 'down';
      }

      return direction;
    }
  }, [activityActions]);

  const checkUserAnswer = useCallback(() => {
    if (userAnswer?.direction === state?.direction)
      return activityActions.activityIncreaseScore(1);
  }, [activityActions, state, userAnswer]);

  useTimeout(createNewState, 5000, activityState.paused, true);
  useTimeout(
    useCallback(() => {
      activityActions.activityUnfreeze();

      createNewState();
    }, [activityActions, createNewState]),
    3000,
    activityState.paused,
    showsAnswers
  );

  useEffect(() => {
    if (userAnswer !== undefined) {
      checkUserAnswer();

      if (activityState.trainingMode) {
        activityActions.activityFreeze();

        setShowsAnswers(true);
      } else createNewState();
    }
  }, [
    activityActions,
    activityState.trainingMode,
    userAnswer,
    checkUserAnswer,
    createNewState,
  ]);

  useEffect(() => createNewState(), [createNewState]);

  return (
    <div
      {...rest}
      className={appendClass(
        'activity sense-of-direction-activity',
        rest.className
      )}
    >
      <div className="left-container container">
        {directionsState && (
          <div className="positions-container">
            <>
              <div className="position-container">
                <p>{statesCount === 1 ? 'Start' : 'New'} Position:</p>
                <div className="image-container animate" key={statesCount}>
                  <img
                    alt="new direction"
                    src={directionsState.newDirection.image}
                  />
                </div>
              </div>
              {activityState.trainingMode && userAnswer && state && (
                <div className="position-container">
                  <p>Answer:</p>
                  <div className="image-container answer">
                    <img
                      alt="answer"
                      src={
                        POSSIBLE_ANSWERS[
                          `${directionsState.startDirection.direction}_${state.direction}_${directionsState.newDirection.direction}`
                        ]
                      }
                    />
                  </div>
                </div>
              )}
            </>
          </div>
        )}
      </div>
      <div className="right-container container">
        <div className="arrows-container">
          {POSSIBLE_CHOICES.map((choice) => (
            <PushButton
              className="image-container"
              onClick={() => setUserAnswer(choice)}
              disabled={statesCount <= 1 || userAnswer !== undefined}
              style={{
                opacity:
                  statesCount > 1
                    ? userAnswer === undefined
                      ? 1
                      : activityState.trainingMode &&
                        (choice === state || userAnswer === choice)
                      ? 1
                      : 0.4
                    : 0.4,
              }}
              key={choice.direction}
            >
              <img
                alt={`${choice.direction} arrow`}
                src={
                  activityState.trainingMode && userAnswer
                    ? choice === state
                      ? choice.correctImage
                      : userAnswer === choice
                      ? choice.wrongImage
                      : choice.image
                    : choice.image
                }
              />
            </PushButton>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SenseOfDirectionActivity;
