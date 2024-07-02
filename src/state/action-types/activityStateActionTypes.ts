import { Action } from 'redux';
import { PayloadAction } from '../../types';

export enum ActivityStateActionType {
  ActivityPrepare = 'ActivityPrepare',
  ActivityPause = 'ActivityPause',
  ActivityResume = 'ActivityResume',
  ActivityFreeze = 'ActivityFreeze',
  ActivityUnfreeze = 'ActivityUnfreeze',
  ActivitySetSubmit = 'ActivitySetSubmit',
  ActivityIncreaseSpeed = 'ActivityIncreaseSpeed',
  ActivityDecreaseSpeed = 'ActivityDecreaseSpeed',
  ActivityNextSpeed = 'ActivityNextSpeed',
  ActivityIncreaseScore = 'ActivityIncreaseScore',
  ActivityIncreaseMaxScore = 'ActivityIncreaseMaxScore',
  ActivitySetTrainingMode = 'ActivitySetTrainingMode',
  ActivityNextSession = 'ActivityNextSession',
  ActivityStartSession = 'ActivityStartSession',
  ActivityFinish = 'ActivityFinish',
  ActivityNextStage = 'ActivityNextStage',
  ActivitySetArbitraryState = 'ActivitySetArbitraryState',
  ActivitySetStartedProperly = 'ActivityStartedProperly',
}

export interface ActivityPreparePayload {
  withTrainingMode: boolean;
}

export type ActivityPrepareAction = PayloadAction<
  ActivityStateActionType.ActivityPrepare,
  ActivityPreparePayload
>;

export type ActivityPauseAction = Action<ActivityStateActionType.ActivityPause>;

export type ActivityResumeAction =
  Action<ActivityStateActionType.ActivityResume>;

export type ActivityFreezeAction =
  Action<ActivityStateActionType.ActivityFreeze>;

export type ActivityUnfreezeAction =
  Action<ActivityStateActionType.ActivityUnfreeze>;

export interface ActivitySetSubmitPayload {
  submitted: boolean;
  increaseScoreBy: number;
}

export type ActivitySetSubmitAction = PayloadAction<
  ActivityStateActionType.ActivitySetSubmit,
  ActivitySetSubmitPayload
>;

export type ActivityIncreaseSpeedAction =
  Action<ActivityStateActionType.ActivityIncreaseSpeed>;

export type ActivityDecreaseSpeedAction =
  Action<ActivityStateActionType.ActivityDecreaseSpeed>;

export type ActivityNextSpeedAction =
  Action<ActivityStateActionType.ActivityNextSpeed>;

export interface ActivityIncreaseScorePayload {
  by: number;
}

export type ActivityIncreaseScoreAction = PayloadAction<
  ActivityStateActionType.ActivityIncreaseScore,
  ActivityIncreaseScorePayload
>;

export interface ActivityIncreaseMaxScorePayload {
  by: number;
}

export type ActivityIncreaseMaxScoreAction = PayloadAction<
  ActivityStateActionType.ActivityIncreaseMaxScore,
  ActivityIncreaseMaxScorePayload
>;

export interface ActivitySetTrainingModePayload {
  to: boolean;
}

export type ActivitySetTrainingModeAction = PayloadAction<
  ActivityStateActionType.ActivitySetTrainingMode,
  ActivitySetTrainingModePayload
>;

export type ActivityNextSessionAction =
  Action<ActivityStateActionType.ActivityNextSession>;

export type ActivityStartSessionAction =
  Action<ActivityStateActionType.ActivityStartSession>;

export type ActivityFinishAction =
  Action<ActivityStateActionType.ActivityFinish>;

export interface ActivityNextStagePayload {
  name: string;
  time: number;
}

export type ActivityNextStageAction = PayloadAction<
  ActivityStateActionType.ActivityNextStage,
  ActivityNextStagePayload
>;

export type ActivitySetArbitraryStateAction = PayloadAction<
  ActivityStateActionType.ActivitySetArbitraryState,
  any
>;

export type ActivitySetStartedProperlyPayload = boolean;

export type ActivitySetStartedProperlyAction = PayloadAction<
  ActivityStateActionType.ActivitySetStartedProperly,
  ActivitySetStartedProperlyPayload
>;

export type ActivityAction =
  | ActivityPrepareAction
  | ActivityPauseAction
  | ActivityResumeAction
  | ActivityFreezeAction
  | ActivityUnfreezeAction
  | ActivitySetSubmitAction
  | ActivityIncreaseSpeedAction
  | ActivityDecreaseSpeedAction
  | ActivityNextSpeedAction
  | ActivityIncreaseScoreAction
  | ActivityIncreaseMaxScoreAction
  | ActivitySetTrainingModeAction
  | ActivityNextSessionAction
  | ActivityStartSessionAction
  | ActivityFinishAction
  | ActivityNextStageAction
  | ActivitySetArbitraryStateAction
  | ActivitySetStartedProperlyAction;
