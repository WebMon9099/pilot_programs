import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import {
  OnScreenJoystick,
  OnScreenSlider,
  Settings,
} from "../../components/global";
import {
  Navbar,
  PauseBeacon,
  PieTimer,
  SessionCounter,
} from "../../components/run-page-components";
import {
  ExitModal,
  TrainingModeModal,
} from "../../components/run-page-components/modals";
import { ACTIVITIES, SESSION_START_COUNTDOWN_TIME } from "../../constants";
import { OnScreenJoystickPosition } from "../../context/ControlsContext/types";
import { useControls, useIntervalState, useTimeout } from "../../hooks";
import { appendClass } from "../../lib";
import {
  ACTIVITY_DECREASE_SPEED_ACTION,
  ACTIVITY_FINISH_ACTION,
  ACTIVITY_FREEZE_ACTION,
  ACTIVITY_INCREASE_MAX_SCORE_ACTION,
  ACTIVITY_INCREASE_SCORE_ACTION,
  ACTIVITY_INCREASE_SPEED_ACTION,
  ACTIVITY_NEXT_SESSION_ACTION,
  ACTIVITY_NEXT_SPEED_ACTION,
  ACTIVITY_NEXT_STAGE,
  ACTIVITY_PAUSE_ACTION,
  ACTIVITY_PREPARE_ACTION,
  ACTIVITY_RESUME_ACTION,
  ACTIVITY_SET_ARBITRARY_SCORE,
  ACTIVITY_SET_STARTED_PROPERLY,
  ACTIVITY_SET_SUBMIT_ACTION,
  ACTIVITY_SET_TRAINING_MODE_ACTION,
  ACTIVITY_START_SESSION_ACTION,
  ACTIVITY_UNFREEZE_ACTION,
} from "../../state/actions";
import { RootDispatch, RootState } from "../../store";
import { ActivityActions, ActivityState } from "../../types";

interface RunPageProps extends React.HTMLAttributes<HTMLDivElement> {
  activityActions: ActivityActions;
  activityState: ActivityState;
  helpHyperlink: string;
}

interface RunPageLocation {
  pathname: string;
  state: { trainingMode: boolean };
  search: string;
}

const enum Stage {
  SessionCountdown,
  Activity,
}

const _RunPage: React.FC<RunPageProps> = ({
  activityActions,
  activityState,
  helpHyperlink,
  ...rest
}) => {
  const { onScreenJoystickPosition } = useControls();

  const location = useLocation() as RunPageLocation;

  const activityObject = useMemo(() => {
    const activityName = location.pathname.substring(
      1,
      location.pathname.length - 4
    );

    const object = _.cloneDeep(ACTIVITIES[activityName]);

    object.sessionLength *= 1000;
    if (object.showAnswerTime) object.showAnswerTime *= 1000;

    return object;
  }, [location.pathname]);

  const [params] = useSearchParams();
  const navigate = useNavigate();

  location.state = location.state || {
    trainingMode: false,
  };

  const [display, setDisplay] = useState(Stage.SessionCountdown);

  const [showSettings, setShowSettings] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showTrainingModeModal, setShowTrainingModeModal] = useState(false);

  const [, , durationRef] = useIntervalState(
    0,
    useCallback((duration) => duration + 1, []),
    useCallback(() => 1000, []),
    activityState.paused || display !== Stage.Activity,
    "Timer"
  );
  // const scoreRef = useRef(0);
  // const maxScoreRef = useRef(0);

  const activityParams = useMemo(() => {
    return (
      activityObject.queries &&
      Object.entries(activityObject.queries).reduce(
        (obj, [key]) => ({ ...obj, [key]: params.get(key) }),
        {}
      )
    );
  }, [activityObject.queries, params]);

  useTimeout(
    activityActions.activityNextSession,
    activityState.trainingMode ? activityObject.showAnswerTime : 0,
    activityState.paused,
    activityState.submitted
  );

  const exitCallback = useCallback(() => {
    if (activityObject.name !== 'Tracking'){
      activityActions.activityFinish();
    }

    navigate(`/${activityObject.path}/complete${location.search}`, {
      state: {
        activityCompleted: true,
        // score: Math.floor((scoreRef.current / maxScoreRef.current) * 100),
        duration: durationRef.current,
      },
    });
  }, [navigate, activityObject, activityActions, location.search, durationRef]);

  // useEffect(() => {
  //   scoreRef.current = activityState.score;
  //   maxScoreRef.current = activityState.maxScore;
  // }, [activityState.score, activityState.maxScore]);

  useEffect(() => {
    document.title = activityObject.name;
  }, [activityObject.name]);

  useEffect(() => {
    if (display === Stage.Activity) activityActions.activityStartSession();
  }, [activityActions, display]);

  useEffect(() => {
    activityActions.activityPrepare(location.state.trainingMode || false);

    setDisplay(Stage.SessionCountdown);
  }, [activityActions, location.state.trainingMode]);

  useEffect(() => {
    if (activityState.session > 1) {
      if (
        activityState.session > activityObject.sessions &&
        // !activityState.trainingMode &&
        !activityState.finished
      )
        exitCallback();
      else setDisplay(Stage.SessionCountdown);
    }
  }, [
    activityActions,
    activityObject.sessions,
    activityState.session,
    activityState.finished,
    activityState.trainingMode,
    exitCallback,
  ]);

  useEffect(() => {
    if (activityState.submitted)
      activityActions.activityNextStage(
        "Commit",
        activityState.trainingMode ? activityObject.showAnswerTime : 0
      );
  }, [
    activityActions,
    activityObject.showAnswerTime,
    activityState.submitted,
    activityState.trainingMode,
  ]);

  useEffect(() => {
    if (showSettings) activityActions.activityPause();
    else activityActions.activityResume();
  }, [activityActions, showSettings]);

  const joystickAndSlider = useMemo(
    () => (
      <>
        {(activityObject.gear.joystick === true ||
          (typeof activityObject.gear.joystick !== "boolean" &&
            activityObject.gear.joystick?.onScreenJoystick)) && (
          <OnScreenJoystick activityObject={activityObject} />
        )}
        {(activityObject.gear.joystick === true ||
          (typeof activityObject.gear.joystick !== "boolean" &&
            activityObject.gear.joystick?.onScreenSlider)) && (
          <OnScreenSlider activityObject={activityObject} />
        )}
      </>
    ),
    [activityObject]
  );

  return (
    <div {...rest} className={appendClass("page run-page", rest.className)}>
      <Navbar
        actionsDisabled={display === Stage.SessionCountdown}
        activityObject={activityObject}
        activityState={activityState}
        activityActions={activityActions}
        pauseElapsedTime={
          !(display === Stage.Activity) ||
          activityState.paused ||
          activityState.submitted ||
          activityState.freezed
        }
        setShowSettings={setShowSettings}
        setShowExitModal={setShowExitModal}
        setShowTrainingModeModal={setShowTrainingModeModal}
        helpHyperlink={helpHyperlink}
      />
      {display === Stage.Activity && activityState.clock.start ? (
        <div id="activity-wrapper" className="activity-wrapper">
          <PieTimer
            className={`pie-timer-${activityObject.path}`}
            paused={activityState.paused}
            stage={activityState.stage}
          />
          {activityState.paused && <PauseBeacon />}
          <activityObject.component
            activityObject={activityObject}
            activityState={{
              ...activityState,
              paused: activityState.paused || activityState.submitted,
            }}
            activityActions={activityActions}
            activityParams={activityParams}
          />
          {activityObject.gear.joystick &&
            onScreenJoystickPosition !== OnScreenJoystickPosition.Disabled &&
            joystickAndSlider}
        </div>
      ) : (
        <SessionCounter
          label={
            !activityObject.ignoreSessions
              ? `Session ${activityState.session} Starting in:`
              : `Activity Starting in:`
          }
          time={
            activityState.session > 1
              ? activityObject.ignoreSessions
                ? 0
                : SESSION_START_COUNTDOWN_TIME
              : SESSION_START_COUNTDOWN_TIME
          }
          paused={!(display === Stage.SessionCountdown)}
          onFinish={() => setDisplay(Stage.Activity)}
        />
      )}
      <div
        className="settings-container"
        onClick={() => setShowSettings(false)}
        style={{
          ...(showSettings
            ? { opacity: 1, pointerEvents: "auto", zIndex: 1000 }
            : { opacity: 0, pointerEvents: "none", zIndex: -1 }),
        }}
      >
        <Settings
          onClick={(e) => e.stopPropagation()}
          closeSettings={() => setShowSettings(false)}
        />
      </div>
      <ExitModal
        show={showExitModal}
        onDismiss={() => setShowExitModal(false)}
        exitPath={`/${activityObject.path}`}
      />
      <TrainingModeModal
        trainingMode={activityState.trainingMode}
        exitPath={`/${activityObject.path}/run?${params
          .toString()
          .split("+")
          .join(" ")}`}
        show={showTrainingModeModal}
        onDismiss={() => setShowTrainingModeModal(false)}
      />
    </div>
  );
};

//  Map relevant state properties to props:
const mapStateToProps = ({ activityState }: RootState) => ({
  activityState,
});

//  Map relevant actions to props:
const mapDispatchToProps = (
  dispatch: RootDispatch
): { activityActions: ActivityActions } => {
  return {
    activityActions: {
      activityPrepare: (withTrainingMode) =>
        dispatch(ACTIVITY_PREPARE_ACTION({ withTrainingMode })),
      activityPause: () => dispatch(ACTIVITY_PAUSE_ACTION),
      activityResume: () => dispatch(ACTIVITY_RESUME_ACTION),
      activityFreeze: () => dispatch(ACTIVITY_FREEZE_ACTION),
      activityUnfreeze: () => dispatch(ACTIVITY_UNFREEZE_ACTION),
      activitySetSubmit: (submitted, increaseScoreBy = 0) =>
        dispatch(ACTIVITY_SET_SUBMIT_ACTION({ submitted, increaseScoreBy })),
      activityIncreaseSpeed: () => dispatch(ACTIVITY_INCREASE_SPEED_ACTION),
      activityDecreaseSpeed: () => dispatch(ACTIVITY_DECREASE_SPEED_ACTION),
      activityNextSpeed: () => dispatch(ACTIVITY_NEXT_SPEED_ACTION),
      activityIncreaseScore: (score) =>
        dispatch(ACTIVITY_INCREASE_SCORE_ACTION({ by: score })),
      activityIncreaseMaxScore: (by) =>
        dispatch(ACTIVITY_INCREASE_MAX_SCORE_ACTION({ by })),
      activitySetTrainingMode: (trainingMode) =>
        dispatch(ACTIVITY_SET_TRAINING_MODE_ACTION({ to: trainingMode })),
      activityNextSession: () => dispatch(ACTIVITY_NEXT_SESSION_ACTION),
      activityStartSession: () => dispatch(ACTIVITY_START_SESSION_ACTION),
      activityFinish: () => dispatch(ACTIVITY_FINISH_ACTION),
      activityNextStage: (name, time) =>
        dispatch(ACTIVITY_NEXT_STAGE({ name, time })),
      activitySetArbitraryState: (score) =>
        dispatch(ACTIVITY_SET_ARBITRARY_SCORE(score)),
      activitySetStartedProperly: (properly) =>
        dispatch(ACTIVITY_SET_STARTED_PROPERLY(properly)),
    },
  };
};

const RunPage = connect(mapStateToProps, mapDispatchToProps)(_RunPage);

export default RunPage;
