import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityActions, ActivityObject, ActivityState } from '../../../types';
import { useInterval } from '../../useTime/react';
import { useStage } from '../hooks';
import {
  UseIntervalActivityParams,
  UseIntervalActivityReturnValue,
} from './types';

function useIntervalActivity<S, C>(
  {
    stateCreator,
    stateChangeHandler,
    choicesCreator,
    initialUserAnswer: _initialUserAnswer,
    getScore: _getScore,
    options: {
      interval = undefined,
      increaseScoreTiming = 'OnUserAnswerChange',
      resetUserAnswerOnStateChange = false,
    } = {},
  }: UseIntervalActivityParams<S, C>,
  activityObject: ActivityObject,
  activityState: ActivityState,
  activityActions: ActivityActions
): UseIntervalActivityReturnValue<S, C> {
  const initialUserAnswer = useRef(_initialUserAnswer).current;

  const [state, setState] = useState(() => stateCreator());
  const stateRef = useRef(state);

  const [choices] = useState<C>(() => choicesCreator(state));
  const [userAnswer, _setUserAnswer] = useState<S>(initialUserAnswer);
  const [submitScore, setSubmitScore] = useState(false);

  const getScore = useCallback(
    (state: S, userAnswer: S | undefined): number => {
      if (userAnswer === undefined) return 0;

      return _getScore(state, userAnswer) || 0;
    },
    [_getScore]
  );

  const setUserAnswer = useCallback(
    (newUserAnswer: S) => {
      _setUserAnswer(newUserAnswer);

      if (increaseScoreTiming === 'OnUserAnswerChange') setSubmitScore(true);
    },
    [increaseScoreTiming]
  );

  const nextState = useCallback(() => {
    const newState = stateCreator(stateRef.current);

    if (resetUserAnswerOnStateChange) setUserAnswer(initialUserAnswer);
    setState(newState);

    if (stateChangeHandler) stateChangeHandler(newState);
  }, [
    initialUserAnswer,
    resetUserAnswerOnStateChange,
    setUserAnswer,
    stateChangeHandler,
    stateCreator,
  ]);

  const submitActivity = useCallback(() => {
    activityActions.activitySetSubmit(true, getScore(state, userAnswer));
  }, [activityActions, getScore, state, userAnswer]);

  useStage({
    stages: [
      {
        name: activityObject.name,
        time: activityObject.sessionLength,
      },
    ],
    stageChangeHandler: function (stage, stageState) {
      if (stageState === 'start') {
        activityActions.activityNextStage(stage.name, stage.time);
      } else if (stageState === 'end') {
        submitActivity();
      }
    },
    paused: activityState.paused,
  });

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(nextState, [nextState]);

  useInterval(
    useCallback(() => {
      if (increaseScoreTiming === 'OnStateChange') setSubmitScore(true);

      if (
        resetUserAnswerOnStateChange === false ||
        increaseScoreTiming === 'OnUserAnswerChange'
      )
        nextState();

      return null;
    }, [increaseScoreTiming, nextState, resetUserAnswerOnStateChange]),
    interval || Infinity,
    activityState.paused
  );

  useEffect(() => {
    if (submitScore) {
      activityActions.activityIncreaseScore(getScore(state, userAnswer));

      if (
        resetUserAnswerOnStateChange &&
        increaseScoreTiming === 'OnStateChange'
      )
        nextState();

      setSubmitScore(false);
    }
  }, [
    activityActions,
    getScore,
    increaseScoreTiming,
    nextState,
    resetUserAnswerOnStateChange,
    state,
    submitScore,
    userAnswer,
  ]);

  return {
    state,
    nextState,
    choices,
    userAnswer,
    setUserAnswer: setUserAnswer as React.Dispatch<React.SetStateAction<S>>,
    submitActivity,
  };
}

export default useIntervalActivity;
