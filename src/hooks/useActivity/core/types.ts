import { Callback } from '../../../types';

export type StateCreatorCallback<S> = (previousState?: S) => S;
export type StateChangeHandler<S> = (newState: S) => void;
export type ChoicesCreatorCallback<S, C> = (state: S) => C;
export type GetScoreCallback<S> = (state: S, userAnswer: S) => number | void;
export type SetUserAnswerCaller<S> = React.Dispatch<React.SetStateAction<S>>;
export type SubmitActivityCaller = Callback;

export interface UseActivityParams<S, C, O> {
  stateCreator: StateCreatorCallback<S>;
  stateChangeHandler?: StateChangeHandler<S>;
  choicesCreator: ChoicesCreatorCallback<S, C>;
  initialUserAnswer: S;
  getScore: GetScoreCallback<S>;
  options?: O;
}

export interface UseActivityReturnValue<S, C> {
  state: S;
  choices: C;
  userAnswer: S;
  setUserAnswer: SetUserAnswerCaller<S>;
  submitActivity: SubmitActivityCaller;
}
