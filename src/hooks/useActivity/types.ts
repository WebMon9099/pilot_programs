import { Callback } from '../../types';
import { NextStageCaller, Stage, StageChangeHandler } from './hooks';

export type StateCreatorCallback<S> = () => S;
export type StateChangeHandler<S> = (newState: S) => void;
export type ChoicesCreatorCallback<S, C> = (state: S) => C;
export type GetScoreCallback<S> = (state: S, userAnswer: S) => number | void;
export type UseActivityOptions = {
  type?: 'static' | 'interval';
  submitOnSelect?: boolean;
};
export type SetUserAnswerCaller<S> = (userAnswer: S) => void;
export type SubmitActivityCaller = Callback;

export interface UseActivityParams<S, C> {
  stages?: Stage[];
  stageChangeHandler?: StageChangeHandler;
  stateCreator: StateCreatorCallback<S>;
  stateChangeHandler: StateChangeHandler<S>;
  choicesCreator: ChoicesCreatorCallback<S, C>;
  initialUserAnswer: S;
  getScore: GetScoreCallback<S>;
  options?: UseActivityOptions;
}

export interface UseActivityReturnValue<S, C> {
  stage: string;
  nextStage: NextStageCaller;
  state: S;
  choices: C;
  userAnswer: S;
  setUserAnswer: SetUserAnswerCaller<S>;
  submitActivity: SubmitActivityCaller;
}
