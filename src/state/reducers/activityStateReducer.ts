import _ from 'lodash';
import {
  ACTIVITY_SPEEDS,
  INITIAL_ACTIVITY_STATE,
  MAX_ACTIVITY_SPEED,
  MIN_ACTIVITY_SPEED,
} from '../../constants';
import { ActivityState } from '../../types/state';
import { ActivityAction, ActivityStateActionType } from '../action-types';
import {
  ACTIVITY_INCREASE_SPEED_ACTION,
  ACTIVITY_RESUME_ACTION,
} from '../actions';

function activityStateReducer(
  state: ActivityState = INITIAL_ACTIVITY_STATE(),
  action: ActivityAction
): ActivityState {
  switch (action.type) {
    case ActivityStateActionType.ActivityPrepare:
      return {
        ...INITIAL_ACTIVITY_STATE(),
        trainingMode: action.payload.withTrainingMode,
        startedProperly: true,
      };
    case ActivityStateActionType.ActivityPause:
      return {
        ...state,
        clock: {
          ...state.clock,
          stoppedAt: Date.now(),
        },
        paused: true,
      };
    case ActivityStateActionType.ActivityResume:
      const clock =
        state.clock.start === undefined
          ? {
              ...INITIAL_ACTIVITY_STATE().clock,
              start: Date.now(),
              sessionStart: Date.now(),
            }
          : {
              ...state.clock,
              start: _.floor(
                state.clock.start + (Date.now() - state.clock.stoppedAt)
              ),
              sessionStart: _.floor(
                state.clock.sessionStart + (Date.now() - state.clock.stoppedAt)
              ),
              stoppedAt: -1,
            };

      return {
        ...state,
        clock,
        paused: false,
      };
    case ActivityStateActionType.ActivityFreeze:
      return {
        ...state,
        freezed: true,
      };
    case ActivityStateActionType.ActivityUnfreeze:
      return {
        ...state,
        freezed: false,
      };
    case ActivityStateActionType.ActivitySetSubmit:
      return {
        ...state,
        submitted: action.payload.submitted,
        sessionsScore: [...state.sessionsScore, action.payload.increaseScoreBy],
        score: state.score + action.payload.increaseScoreBy,
      };
    case ActivityStateActionType.ActivityIncreaseSpeed:
      const upSpeedIndex = _.min([
        ACTIVITY_SPEEDS.indexOf(state.speed) + 1,
        ACTIVITY_SPEEDS.length - 1,
      ])!;

      return {
        ...state,
        speed: ACTIVITY_SPEEDS[upSpeedIndex],
      };
    case ActivityStateActionType.ActivityDecreaseSpeed:
      const downSpeedIndex = _.max([
        ACTIVITY_SPEEDS.indexOf(state.speed) - 1,
        0,
      ])!;
      return {
        ...state,
        speed: ACTIVITY_SPEEDS[downSpeedIndex],
      };
    case ActivityStateActionType.ActivityNextSpeed:
      if (state.speed === MAX_ACTIVITY_SPEED)
        return {
          ...state,
          speed: MIN_ACTIVITY_SPEED,
        };
      else
        return {
          ...activityStateReducer(state, ACTIVITY_INCREASE_SPEED_ACTION),
        };
    case ActivityStateActionType.ActivitySetTrainingMode:
      return {
        ...state,
        trainingMode: action.payload.to,
      };
    case ActivityStateActionType.ActivityIncreaseScore:
      return {
        ...state,
        score: state.score + action.payload.by,
      };
    case ActivityStateActionType.ActivityIncreaseMaxScore:
      return {
        ...state,
        maxScore: state.maxScore + action.payload.by,
      };
    case ActivityStateActionType.ActivityNextSession:
      return {
        ...state,
        session: state.session + 1,
        submitted: false,
      };
    case ActivityStateActionType.ActivityStartSession:
      const stateAfterResume = activityStateReducer(
        state,
        ACTIVITY_RESUME_ACTION
      );
      return {
        ...stateAfterResume,
        clock: {
          ...stateAfterResume.clock,
          sessionStart: Date.now(),
        },
      };
    case ActivityStateActionType.ActivityFinish:
      return {
        ...state,
        finished: true,
      };
    case ActivityStateActionType.ActivityNextStage:
      return {
        ...state,
        stage: action.payload,
      };
    case ActivityStateActionType.ActivitySetArbitraryState:
      return {
        ...state,
        arbitraryState: action.payload,
      };
    case ActivityStateActionType.ActivitySetStartedProperly:
      return {
        ...state,
        startedProperly: action.payload,
      };
    default:
      return state;
  }
}

export default activityStateReducer;
