import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityActions, ActivityObject, ActivityState } from '../../../types';
import { useStage } from '../hooks';
import { UseStaticActivityParams, UseStaticActivityReturnValue } from './types';

function useStaticActivity<S, C>(
  {
    stages: _stages,
    stageChangeHandler,
    stateCreator,
    stateChangeHandler,
    choicesCreator,
    initialUserAnswer,
    getScore: _getScore,
    options: { submitOnSelect } = {
      submitOnSelect: false,
    },
  }: UseStaticActivityParams<S, C>,
  activityObject: ActivityObject,
  activityState: ActivityState,
  activityActions: ActivityActions
): UseStaticActivityReturnValue<S, C> {
  const stages = useRef(
    _stages || [
      {
        name: activityObject.name,
        time: activityObject.sessionLength,
      },
    ]
  ).current;
  const [state] = useState(() => stateCreator());
  const [choices, setChoices] = useState<C>(() => choicesCreator(state));
  const [userAnswer, setUserAnswer] = useState<S>(initialUserAnswer);
  const [submitted, setSubmitted] = useState(false);

  const getScore = useCallback(
    (state: S, userAnswer: S): number => {
      return _getScore(state, userAnswer) || 0;
    },
    [_getScore]
  );

  const submitActivity = useCallback(() => {
    setSubmitted(true);
  }, []);

  const [stage, nextStage] = useStage({
    stages,
    stageChangeHandler: function (stage, stageState, index) {
      if (stageState === 'start') {
        activityActions.activityNextStage(stage.name, stage.time);
        if (stageChangeHandler) stageChangeHandler(stage, stageState, index);
      } else if (stageState === 'end' && index === stages.length - 1) {
        if (stageChangeHandler) stageChangeHandler(stage, stageState, index);
        submitActivity();
      } else if (stageChangeHandler)
        stageChangeHandler(stage, stageState, index);
    },
    paused: activityState.paused,
  });

  useEffect(() => {
    if (stateChangeHandler) stateChangeHandler(state);
  }, [stateChangeHandler, state]);

  useEffect(() => {
    setChoices(choicesCreator(state));
  }, [choicesCreator, state]);

  useEffect(() => {
    if (userAnswer === initialUserAnswer || !submitOnSelect) return;

    submitActivity();
  }, [initialUserAnswer, submitActivity, submitOnSelect, userAnswer]);

  useEffect(() => {
    if (submitted)
      activityActions.activitySetSubmit(true, getScore(state, userAnswer));
  }, [activityActions, getScore, state, submitted, userAnswer]);

  return {
    stage,
    nextStage,
    state,
    choices,
    userAnswer,
    setUserAnswer,
    submitActivity,
  };
}

export default useStaticActivity;
