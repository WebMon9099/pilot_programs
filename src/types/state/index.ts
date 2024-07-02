import { Action } from "redux";
import { Callback } from "../convenience";

export interface PayloadAction<T extends string, P> extends Action<T> {
  payload: P;
}

export interface ActivityState {
  clock: {
    start: number;
    sessionStart: number;
    stoppedAt: number;
  };
  speed: number;
  score: number;
  maxScore: number;
  paused: boolean;
  freezed: boolean;
  session: number;
  sessionsScore: number[];
  trainingMode: boolean;
  submitted: boolean;
  finished: boolean;
  stage: {
    name: string;
    time: number;
  };
  arbitraryState?: { [key: string]: any };
  startedProperly: boolean;
}

export interface ActivityActions {
  activityPrepare: (withTrainingMode: boolean) => void;
  activityPause: Callback;
  activityResume: Callback;
  activityFreeze: Callback;
  activityUnfreeze: Callback;
  activitySetSubmit: (submitted: boolean, increaseScoreBy?: number) => void;
  activityIncreaseSpeed: Callback;
  activityDecreaseSpeed: Callback;
  activityNextSpeed: Callback;
  activityIncreaseScore: (by: number) => void;
  activityIncreaseMaxScore: (by: number) => void;
  activitySetTrainingMode: (trainingMode: boolean) => void;
  activityNextSession: Callback;
  activityStartSession: Callback;
  activityFinish: Callback;
  activityNextStage: (name: string, time: number) => void;
  activitySetArbitraryState: (any?: any) => void;
  activitySetStartedProperly: (properly: boolean) => void;
}
