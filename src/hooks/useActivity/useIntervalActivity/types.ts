import { Callback } from '../../../types';
import { UseActivityParams, UseActivityReturnValue } from '../core/types';

export type NextStateCaller = Callback;
export interface UseIntervalActivityOptions {
  interval?: number;
  increaseScoreTiming?: 'OnStateChange' | 'OnUserAnswerChange';
  resetUserAnswerOnStateChange?: boolean;
}

export type UseIntervalActivityParams<S, C> = UseActivityParams<
  S,
  C,
  UseIntervalActivityOptions
>;

export interface UseIntervalActivityReturnValue<S, C>
  extends UseActivityReturnValue<S, C> {
  nextState: NextStateCaller;
}
