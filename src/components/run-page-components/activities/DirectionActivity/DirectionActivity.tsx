import _ from "lodash";
import { useCallback } from "react";
import { useStaticActivity } from "../../../../hooks";
import { appendClass } from "../../../../lib";
import { ActivityComponent } from "../../../../types";
import { PushButton } from "../../../core";
import Instrument from "./Instrument";
import { State } from "./types";

const aircraftImage = require("./images/svgs/aircraft.svg").default;
// const selectedAircraftImage =
//   require('./images/svgs/direction_imgaircraft_orientation_selected.svg').default;

const DirectionActivity: ActivityComponent = ({
  activityActions,
  activityObject,
  activityState,
  ...rest
}) => {
  const { state, choices, userAnswer, setUserAnswer, submitActivity } =
    useStaticActivity(
      {
        stateCreator: useCallback(() => {
          const newGyroState = _.sample([0, 90, 180, 270])!;
          const newRbiState = _.sample([1, 2, 3, 4, 5, 6, 7, 8])!;

          activityActions.activityIncreaseMaxScore(2);

          return { gyro: newGyroState, rbi: newRbiState };
        }, [activityActions]),
        choicesCreator: useCallback(() => {
          return {
            gyro: [0, 90, 180, 270],
            rbi: [
              [8, 1, 2, 7],
              [3, 6, 5, 4],
            ],
          };
        }, []),
        initialUserAnswer: { gyro: -1, rbi: -1 },
        getScore: useCallback((state: State, userAnswer: State) => {
          let score = 0;
          if (userAnswer.gyro === state.gyro) score += 1;
          if (userAnswer.rbi === state.rbi) score += 1;

          return score;
        }, []),
      },
      activityObject,
      activityState,
      activityActions
    );

  const numberButtons = (() => {
    return (
      <>
        {choices.rbi[0].map((number, index) => (
          <PushButton
            className="item"
            disabled={activityState.submitted || activityState.paused}
            style={{
              backgroundColor: activityState.submitted
                ? number === userAnswer.rbi
                  ? number === state.rbi
                    ? "#92e744"
                    : "#f1504c"
                  : number === state.rbi
                  ? "#92e744"
                  : undefined
                : number === userAnswer.rbi
                ? "white"
                : undefined,
              color:
                number === userAnswer.rbi ||
                (activityState.submitted && number === state.rbi)
                  ? "#494949"
                  : undefined,
              boxShadow:
                number === userAnswer.rbi
                  ? "0 4px 6px -1px rgba(0, 0, 0, .1)"
                  : undefined,
              fontSize: number === userAnswer.rbi ? 32 : undefined,
            }}
            onClick={() =>
              setUserAnswer({ rbi: number, gyro: userAnswer.gyro })
            }
            key={index}
          >
            <span style={{ opacity: activityState.submitted ? 1 : undefined }}>
              {number}
            </span>
          </PushButton>
        ))}
        <img
          className="item"
          src={require("./images/svgs/direction_imgbeacon.svg").default}
          alt="direction_imgbeacon"
        />
        {choices.rbi[1].map((number, index) => (
          <PushButton
            className="item"
            disabled={activityState.submitted || activityState.paused}
            style={{
              backgroundColor: activityState.submitted
                ? number === userAnswer.rbi
                  ? number === state.rbi
                    ? "#92e744"
                    : "#f1504c"
                  : number === state.rbi
                  ? "#92e744"
                  : undefined
                : number === userAnswer.rbi
                ? "white"
                : undefined,
              color:
                number === userAnswer.rbi ||
                (activityState.submitted && number === state.rbi)
                  ? "#494949"
                  : undefined,
              boxShadow:
                number === userAnswer.rbi
                  ? "0 4px 6px -1px rgba(0, 0, 0, .1)"
                  : undefined,
              fontSize: number === userAnswer.rbi ? 32 : undefined,
            }}
            onClick={() =>
              setUserAnswer({ rbi: number, gyro: userAnswer.gyro })
            }
            key={index}
          >
            <span style={{ opacity: activityState.submitted ? 1 : undefined }}>
              {number}
            </span>
          </PushButton>
        ))}
      </>
    );
  })();

  const rotationButtons = (() => {
    return choices.gyro.map((rotation, index) => (
      <PushButton
        className="item"
        disabled={activityState.submitted || activityState.paused}
        onClick={() => setUserAnswer({ rbi: userAnswer.rbi, gyro: rotation })}
        style={{
          backgroundColor: activityState.submitted
            ? rotation === userAnswer.gyro
              ? rotation === state.gyro
                ? "#92e744"
                : "#f1504c"
              : rotation === state.gyro
              ? "#92e744"
              : undefined
            : rotation === userAnswer.gyro
            ? "white"
            : undefined,
          boxShadow:
            rotation === userAnswer.gyro ||
            (activityState.submitted && state.gyro === rotation)
              ? "0 4px 6px 1px rgba(0, 0, 0, .1)"
              : undefined,
        }}
        key={index}
      >
        <img
          src={aircraftImage}
          style={{
            opacity: activityState.submitted ? 1 : undefined,
            transform: `rotate(${-rotation}deg`,
          }}
          alt="direction_imgaircraft_orientation"
        />
      </PushButton>
    ));
  })();

  return (
    <div
      {...rest}
      className={appendClass("activity direction-activity", rest.className)}
    >
      <div className="top-instruments">
        <Instrument type="GYRO" state={state.gyro} />
        <Instrument
          type="RBI"
          state={(() => {
            const targetRotation = ((state.rbi - 1 + 4) % 8) * 45;

            return 360 - (360 - state.gyro - targetRotation);
          })()}
        />
      </div>
      <div className="bottom-actions">
        <div className="number-buttons">{numberButtons}</div>
        <div className="orientations">{rotationButtons}</div>
      </div>
      <PushButton
        className="mv-80 pv-40 ph-160 transition hover:scale-105 active:scale-95 active:brightness-95"
        disabled={activityState.submitted || activityState.paused}
        onClick={submitActivity}
      >
        <span>Commit</span>
      </PushButton>
    </div>
  );
};

export default DirectionActivity;
