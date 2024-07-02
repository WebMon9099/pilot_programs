import {
  ActivityDecreaseSpeedAction,
  ActivityFinishAction,
  ActivityFreezeAction,
  ActivityIncreaseMaxScoreAction,
  ActivityIncreaseMaxScorePayload,
  ActivityIncreaseScoreAction,
  ActivityIncreaseScorePayload,
  ActivityIncreaseSpeedAction,
  ActivityNextSessionAction,
  ActivityNextSpeedAction,
  ActivityNextStageAction,
  ActivityNextStagePayload,
  ActivityPauseAction,
  ActivityPrepareAction,
  ActivityPreparePayload,
  ActivityResumeAction,
  ActivitySetArbitraryStateAction,
  ActivitySetStartedProperlyAction,
  ActivitySetStartedProperlyPayload,
  ActivitySetSubmitAction,
  ActivitySetSubmitPayload,
  ActivitySetTrainingModeAction,
  ActivitySetTrainingModePayload,
  ActivityStartSessionAction,
  ActivityStateActionType,
  ActivityUnfreezeAction,
} from '../action-types';

export const ACTIVITY_PREPARE_ACTION = (
  payload: ActivityPreparePayload
): ActivityPrepareAction => {
  return {
    type: ActivityStateActionType.ActivityPrepare,
    payload,
  };
};

export const ACTIVITY_PAUSE_ACTION: ActivityPauseAction = {
  type: ActivityStateActionType.ActivityPause,
};

export const ACTIVITY_RESUME_ACTION: ActivityResumeAction = {
  type: ActivityStateActionType.ActivityResume,
};

export const ACTIVITY_FREEZE_ACTION: ActivityFreezeAction = {
  type: ActivityStateActionType.ActivityFreeze,
};

export const ACTIVITY_UNFREEZE_ACTION: ActivityUnfreezeAction = {
  type: ActivityStateActionType.ActivityUnfreeze,
};

export const ACTIVITY_SET_SUBMIT_ACTION = ({
  submitted,
  increaseScoreBy,
}: ActivitySetSubmitPayload): ActivitySetSubmitAction => {
  return {
    type: ActivityStateActionType.ActivitySetSubmit,
    payload: {
      submitted,
      increaseScoreBy,
    },
  };
};

export const ACTIVITY_INCREASE_SPEED_ACTION: ActivityIncreaseSpeedAction = {
  type: ActivityStateActionType.ActivityIncreaseSpeed,
};

export const ACTIVITY_DECREASE_SPEED_ACTION: ActivityDecreaseSpeedAction = {
  type: ActivityStateActionType.ActivityDecreaseSpeed,
};

export const ACTIVITY_NEXT_SPEED_ACTION: ActivityNextSpeedAction = {
  type: ActivityStateActionType.ActivityNextSpeed,
};

export const ACTIVITY_INCREASE_SCORE_ACTION = (
  payload: ActivityIncreaseScorePayload
): ActivityIncreaseScoreAction => {
  return {
    type: ActivityStateActionType.ActivityIncreaseScore,
    payload,
  };
};

export const ACTIVITY_INCREASE_MAX_SCORE_ACTION = (
  payload: ActivityIncreaseMaxScorePayload
): ActivityIncreaseMaxScoreAction => {
  return {
    type: ActivityStateActionType.ActivityIncreaseMaxScore,
    payload,
  };
};

export const ACTIVITY_SET_TRAINING_MODE_ACTION = (
  payload: ActivitySetTrainingModePayload
): ActivitySetTrainingModeAction => {
  return {
    type: ActivityStateActionType.ActivitySetTrainingMode,
    payload,
  };
};

export const ACTIVITY_NEXT_SESSION_ACTION: ActivityNextSessionAction = {
  type: ActivityStateActionType.ActivityNextSession,
};

export const ACTIVITY_START_SESSION_ACTION: ActivityStartSessionAction = {
  type: ActivityStateActionType.ActivityStartSession,
};

export const ACTIVITY_FINISH_ACTION: ActivityFinishAction = {
  type: ActivityStateActionType.ActivityFinish,
};

export const ACTIVITY_NEXT_STAGE = (
  payload: ActivityNextStagePayload
): ActivityNextStageAction => {
  return {
    type: ActivityStateActionType.ActivityNextStage,
    payload,
  };
};

export const ACTIVITY_SET_ARBITRARY_SCORE = (
  payload?: any
): ActivitySetArbitraryStateAction => {
  return {
    type: ActivityStateActionType.ActivitySetArbitraryState,
    payload,
  };
};

export const ACTIVITY_SET_STARTED_PROPERLY = (
  payload: ActivitySetStartedProperlyPayload
): ActivitySetStartedProperlyAction => {
  return {
    type: ActivityStateActionType.ActivitySetStartedProperly,
    payload,
  };
};
