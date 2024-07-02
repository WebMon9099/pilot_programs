import { useRef } from 'react';
import { ActivityActions, ActivityObject, ActivityState } from '../../../types';
import { useStage } from '../hooks';

function useTimeActivity(
  activityObject: ActivityObject,
  activityState: ActivityState,
  activityActions: ActivityActions
) {
  const stages = useRef([
    {
      name: activityObject.name,
      time: activityObject.sessionLength,
    },
  ]).current;

  useStage({
    stages,
    stageChangeHandler: function (stage, stageState, index) {
      if (stageState === 'start') {
        activityActions.activityNextStage(stage.name, stage.time);
      } else if (stageState === 'end' && index === stages.length - 1) {
        activityActions.activitySetSubmit(true);
      }
    },
    paused: activityState.paused || activityState.freezed,
  });
}

export default useTimeActivity;
