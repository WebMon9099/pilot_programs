import { useCallback, useEffect, useMemo, useState } from "react";
import { COLORS } from "../../../constants";
import { appendClass } from "../../../lib";
import {
  ActivityActions,
  ActivityObject,
  ActivityState,
  SetState,
} from "../../../types";
import { PushButton, ToggleButton } from "../../core";
import Menu from "./Menu";
import { ScoreIndicator } from "./ScoreIndicator";
import Timer from "./Timer";

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  actionsDisabled: boolean;
  activityActions: ActivityActions;
  activityObject: ActivityObject;
  activityState: ActivityState;
  pauseElapsedTime: boolean;
  setShowSettings: SetState<boolean>;
  setShowExitModal: SetState<boolean>;
  setShowTrainingModeModal: SetState<boolean>;
  helpHyperlink: string;
}

const Navbar: React.FC<NavbarProps> = ({
  actionsDisabled,
  activityActions,
  activityObject,
  activityState,
  pauseElapsedTime,
  setShowSettings,
  setShowExitModal,
  setShowTrainingModeModal,
  helpHyperlink,
  ...rest
}) => {
  const [mobile] = useState(window.innerWidth <= 1024);

  const [showMenu, setShowMenu] = useState(false);
  const [showRemaining, setShowRemaining] = useState(false);

  useEffect(() => {
    function dismissMenu() {
      setShowMenu(false);
    }

    window.addEventListener("click", dismissMenu);

    return () => {
      window.removeEventListener("click", dismissMenu);
    };
  }, []);

  const togglePause = useCallback(() => {
    if (activityState.paused) activityActions.activityResume();
    else activityActions.activityPause();
  }, [activityState.paused, activityActions]);

  const toggleShowRemaining = useCallback(
    () => setShowRemaining(!showRemaining),
    [showRemaining]
  );

  const showSettings = useCallback(() => {
    setShowSettings(true);

    setShowMenu(false);
  }, [setShowSettings]);

  const timerJSX = (
    <Timer
      mobile={mobile}
      totalTime={activityObject.sessions * activityObject.sessionLength}
      showRemaining={showRemaining}
      overrideStart={activityState.clock.start}
      paused={pauseElapsedTime}
      resetList={useMemo(
        () => [activityState.trainingMode],
        [activityState.trainingMode]
      )}
    />
  );

  return (
    <nav
      {...rest}
      className={appendClass(
        `navbar ${showMenu ? "z-[100000]" : ""}`,
        rest.className
      )}
      style={{
        backgroundColor: activityState.trainingMode ? "#82DD47" : "#3793D1",
      }}
    >
      <div
        className="icon-button-container"
        onClick={(e) => {
          e.stopPropagation();

          setShowMenu(!showMenu);
        }}
      >
        <PushButton>
          <img
            src={require("./images/svgs/logo_roundel.svg").default}
            height={36}
            width={36}
            alt="Menu Icon"
          />
        </PushButton>
      </div>
      <div
        className={`${
          mobile ? "mobile " : ""
        }middle-panel-section font-inter text-[18px]`}
      >
        {!activityObject.ignoreSessions &&
          `${mobile ? "S" : "Session "}${activityState.session}`}
      </div>
      <div
        className={`${mobile ? "mobile " : ""} training-mode-section`}
        style={{
          backgroundColor: activityState.trainingMode ? "#74d73c" : "#1b8ac0",
        }}
        id="training-mode-section"
      >
        <img
          className="mh-40 !h-[22px]"
          src={require("./images/svgs/icon_mortarboard.svg").default}
          alt="Training Mode Icon"
        />
        <span className="font-inter">Training Mode</span>
        <ToggleButton
          className="h-[28px] w-[65px]"
          toggled={activityState.trainingMode}
          onToggleChange={() => setShowTrainingModeModal(true)}
          colors={{
            onColors: {
              background: COLORS.white,
              toggle: activityState.trainingMode ? "#82dd47" : "#3793d1",
              text: activityState.trainingMode ? "#82dd47" : "#3793d1",
            },
            offColors: {
              background: COLORS.white,
              toggle: activityState.trainingMode ? "#82dd47" : "#3793d1",
              text: activityState.trainingMode ? "#82dd47" : "#3793d1",
            },
          }}
        />
      </div>
      <div className={`${mobile ? "mobile " : ""}right-panel-section`}>
        <div className="control-buttons">
          <PushButton
            disabled={
              !activityState.trainingMode || activityState.clock.start === -1
            }
            onClick={togglePause}
          >
            <img
              src={require("./images/svgs/icon_playpause.svg").default}
              alt="Play/Pause Icon"
            />
          </PushButton>
          <PushButton
            onClick={() => setShowSettings(true)}
            disabled={!activityObject.settings}
          >
            <img
              src={require("./images/svgs/icon_settings.svg").default}
              alt="Settings Icon"
            />
          </PushButton>
          <PushButton disabled>
            <img
              src={require("./images/svgs/icon_performance.svg").default}
              alt="Performance Icon"
            />
          </PushButton>
          <PushButton onClick={() => window.open(helpHyperlink)}>
            <img
              src={require("./images/svgs/icon_help.svg").default}
              alt="Help Icon"
            />
          </PushButton>
          <PushButton onClick={() => setShowExitModal(true)}>
            <img
              src={require("./images/svgs/icon_exit.svg").default}
              alt="Exit Icon"
            />
          </PushButton>
        </div>
        <div className="stats font-inter text-white/80">
          <PushButton
            disabled={!activityState.trainingMode || !activityObject.hasSpeed}
            onClick={activityActions.activityNextSpeed}
          >
            <span>{`${mobile ? "Sp" : "Speed"}: `}</span>
            {activityObject.hasSpeed ? (
              <span>{activityState.speed}x</span>
            ) : (
              <span>N/A</span>
            )}
          </PushButton>
          {activityState.trainingMode ? (
            timerJSX
          ) : (
            <PushButton onClick={toggleShowRemaining}>{timerJSX}</PushButton>
          )}
          {activityObject.customNavbarData &&
            Object.entries(activityObject.customNavbarData).map(
              ([key, value]) => (
                <span key={key}>
                  <span className="opacity-40">
                    {mobile ? value.mobileLabel : value.label}:
                  </span>{" "}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: activityState.arbitraryState
                        ? activityState.arbitraryState[key]
                        : "",
                    }}
                  ></span>
                  {/* {`${mobile ? value.mobileLabel : value.label}: ${
                    activityState.arbitraryState
                      ? activityState.arbitraryState[key]
                      : 0
                  }`} */}
                </span>
              )
            )}
          <span id="scoreSpan" className="score-span">
            <span className="opacity-40">{`${mobile ? "Sc" : "Score"}:`}</span>{" "}
            <span>{activityState.score}</span>
          </span>
          <ScoreIndicator
            disabled={actionsDisabled && activityState.session === 1}
            score={activityState.score}
            session={activityState.session}
            sessions={activityObject.sessions}
          />
        </div>
      </div>
      <Menu
        actionsDisabled={actionsDisabled}
        activityIncreaseSpeed={activityActions.activityIncreaseSpeed}
        activityDecreaseSpeed={activityActions.activityDecreaseSpeed}
        activityPause={togglePause}
        clockModeToggle={toggleShowRemaining}
        trainingMode={activityState.trainingMode}
        hasSettings={activityObject.settings}
        showSettings={showSettings}
        speedDisabled={!activityObject.hasSpeed}
        style={
          showMenu ? { opacity: 1, zIndex: 10000 } : { opacity: 0, zIndex: -1 }
        }
      />
      {showMenu && <div className="menu-overlay" />}
    </nav>
  );
};

export default Navbar;
