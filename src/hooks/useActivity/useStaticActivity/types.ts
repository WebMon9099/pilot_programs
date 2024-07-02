import { UseActivityParams, UseActivityReturnValue } from '../core/types';
import { NextStageCaller, Stage, StageChangeHandler } from '../hooks';

export type UseStaticActivityOptions = {
  submitOnSelect?: boolean;
};

export interface UseStaticActivityParams<S, C>
  extends UseActivityParams<S, C, UseStaticActivityOptions> {
  stages?: Stage[];
  stageChangeHandler?: StageChangeHandler;
}

export interface UseStaticActivityReturnValue<S, C>
  extends UseActivityReturnValue<S, C> {
  stage: string;
  nextStage: NextStageCaller;
}
