import { useCallback, useEffect, useRef } from 'react';
import { useIntervalState } from '../../../useTime/react';
import { UseStageParams, UseStageReturnValue } from './types';

function useStage({
  stages: _stages,
  stageChangeHandler: _stageChangeHandler,
  paused,
}: UseStageParams): UseStageReturnValue {
  const stages = useRef(_stages).current;
  const stageChangeHandler = useRef(_stageChangeHandler).current;

  const [stageIndex, setStageIndex] = useIntervalState(
    0,
    useCallback(
      (stageIndex) =>
        stageIndex < stages.length ? stageIndex + 1 : stageIndex,
      [stages.length]
    ),
    useCallback(
      (stageIndex) => (stages[stageIndex] ? stages[stageIndex].time : 0),
      [stages]
    ),
    paused
  );

  useEffect(() => {
    if (stageIndex > 0 && stageChangeHandler)
      stageChangeHandler(stages[stageIndex - 1], 'end', stageIndex - 1);

    if (stageIndex < stages.length && stageChangeHandler)
      stageChangeHandler(stages[stageIndex], 'start', stageIndex);
  }, [stageChangeHandler, stages, stageIndex]);

  return [
    stages[stageIndex] ? stages[stageIndex].name : stages[stageIndex - 1].name,
    () => setStageIndex(stageIndex + 1),
  ];
}

export default useStage;
