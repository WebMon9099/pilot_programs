import { Callback } from '../../../../types';

export type Stage = {
  name: string;
  time: number;
};

export type StageState = 'start' | 'end';

export type StageChangeHandler = (
  stage: Stage,
  state: StageState,
  index: number
) => void;

export interface UseStageParams {
  stages: Stage[];
  stageChangeHandler?: StageChangeHandler;
  paused: boolean;
}

export type NextStageCaller = Callback;

export type UseStageReturnValue = [string, NextStageCaller];
