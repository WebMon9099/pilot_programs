import _ from "lodash";
import { useCallback, useMemo, useState } from "react";
import { useIntervalActivity } from "../../../../hooks";
import { appendClass } from "../../../../lib";
import { ActivityComponent } from "../../../../types";
import { PushButton, ToggleButton } from "../../../core";
import Instrument from "./Instrument";
import {
  AIRSPEED_BASE_SPEED,
  ALTIMETER_BASE_SPEED,
  HEADING_BASE_SPEED,
  MAX_AIRSPEED,
  MAX_ALTIMETER,
  MIN_AIRSPEED,
  MIN_ALTIMETER,
  MISTAKE_ACCEPTANCE_OFFSET,
  STATES_CHANGE_AVERAGE_INTERVAL,
} from "./constants";
import { State } from "./types";

const InstrumentsActivity: ActivityComponent = ({
  activityActions,
  activityObject,
  activityState,
  ...rest
}) => {
  const [airspeedEnabled, setAirspeedEnabled] = useState(true);
  const [altimeterEnabled, setAltimeterEnabled] = useState(true);
  const [headingEnabled, setHeadingEnabled] = useState(true);

  const { state, userAnswer, setUserAnswer } = useIntervalActivity(
    {
      stateCreator: useCallback(
        (previousState: State | undefined) => {
          var airspeed = previousState
            ? previousState.airspeed
            : _.random(8, 34) * 5;
          var altimeter = previousState
            ? previousState.altimeter
            : _.random(15, 95) * 100;
          var heading = previousState
            ? previousState.heading
            : _.random(71) * 5;

          const changed = _.sample(["airspeed", "altimeter", "heading"])!;

          if (changed === "airspeed") airspeed = _.random(8, 34) * 5;
          else if (changed === "altimeter") altimeter = _.random(15, 95) * 100;
          else if (changed === "heading") heading = _.random(71) * 5;

          activityActions.activityIncreaseMaxScore(3);

          return {
            airspeed,
            altimeter,
            heading,
          };
        },
        [activityActions]
      ),
      choicesCreator: useCallback(() => {}, []),
      initialUserAnswer: { airspeed: 90, altimeter: 5000, heading: 0 },
      getScore: useCallback(
        (state: State, userAnswer: State) => {
          let score = 0;

          const heading = userAnswer.heading % 360;

          if (
            userAnswer.airspeed >= state.airspeed - MISTAKE_ACCEPTANCE_OFFSET &&
            userAnswer.airspeed <= state.airspeed + MISTAKE_ACCEPTANCE_OFFSET
          )
            if (airspeedEnabled) score += 1;
          if (state.altimeter === userAnswer.altimeter)
            if (altimeterEnabled) score += 1;
          if (
            heading <= state.heading + MISTAKE_ACCEPTANCE_OFFSET &&
            heading >= state.heading - MISTAKE_ACCEPTANCE_OFFSET
          )
            if (headingEnabled) score += 1;

          return score;
        },
        [airspeedEnabled, altimeterEnabled, headingEnabled]
      ),
      options: {
        interval: useMemo(
          () =>
            _.random(
              STATES_CHANGE_AVERAGE_INTERVAL - 1000,
              STATES_CHANGE_AVERAGE_INTERVAL + 1000
            ) / activityState.speed,
          [activityState.speed]
        ),
        increaseScoreTiming: "OnStateChange",
      },
    },
    activityObject,
    activityState,
    activityActions
  );

  return (
    <div
      {...rest}
      className={appendClass("activity instruments-activity", rest.className)}
    >
      <div className="text-container font-inter">
        <p style={{ opacity: airspeedEnabled ? 1 : 0 }}>
          Maintain <b>{state.airspeed}kt</b>
        </p>
        <p style={{ opacity: headingEnabled ? 1 : 0 }}>
          Maintain <b>{state.heading}°</b>
        </p>
        <p style={{ opacity: altimeterEnabled ? 1 : 0 }}>
          Maintain <b>{state.altimeter}ft</b>
        </p>
      </div>
      <div className="dials">
        <div className="dial">
          <Instrument
            type="AIRSPEED"
            state={userAnswer.airspeed}
            neededState={state.airspeed}
            activated={airspeedEnabled}
          />
          {activityState.trainingMode ? (
            <ToggleButton
              toggled={airspeedEnabled}
              onToggleChange={setAirspeedEnabled}
              showText={false}
              disabled={activityState.submitted || activityState.paused}
            />
          ) : null}
        </div>
        <div className="dial">
          <Instrument
            type="HEADING"
            state={userAnswer.heading}
            neededState={state.heading}
            activated={headingEnabled}
          />
          {activityState.trainingMode ? (
            <ToggleButton
              toggled={headingEnabled}
              onToggleChange={setHeadingEnabled}
              showText={false}
              disabled={activityState.submitted || activityState.paused}
            />
          ) : null}
        </div>
        <div className="dial">
          <Instrument
            type="ALTIMETER"
            state={userAnswer.altimeter}
            neededState={state.altimeter}
            activated={altimeterEnabled}
          />
          {activityState.trainingMode ? (
            <ToggleButton
              toggled={altimeterEnabled}
              onToggleChange={setAltimeterEnabled}
              showText={false}
              disabled={activityState.submitted || activityState.paused}
            />
          ) : null}
        </div>
      </div>
      <div className="buttons-container">
        <div className="vertical buttons">
          <PushButton
            className="horizontal transition hover:scale-105 active:scale-95 active:brightness-95"
            onClick={() =>
              setUserAnswer({
                ...userAnswer,
                airspeed:
                  userAnswer.airspeed +
                  (userAnswer.airspeed < MAX_AIRSPEED ? 2 : 0),
              })
            }
            onHold={() => {
              setUserAnswer({
                ...userAnswer,
                airspeed:
                  userAnswer.airspeed +
                  (userAnswer.airspeed < MAX_AIRSPEED ? 2 : 0),
              });
            }}
            interval={AIRSPEED_BASE_SPEED}
            delay={200}
            disabled={
              activityState.submitted ||
              activityState.paused ||
              !airspeedEnabled
            }
          >
            <img
              src={require("./images/svgs/arrow.svg").default}
              width={15}
              alt="arrow"
            />
            Inc. Speed
          </PushButton>
          <PushButton
            className="horizontal transition hover:scale-105 active:scale-95 active:brightness-95"
            onClick={() =>
              setUserAnswer({
                ...userAnswer,
                airspeed:
                  userAnswer.airspeed -
                  (userAnswer.airspeed > MIN_AIRSPEED ? 5 : 0),
              })
            }
            onHold={() =>
              setUserAnswer({
                ...userAnswer,
                airspeed:
                  userAnswer.airspeed -
                  (userAnswer.airspeed > MIN_AIRSPEED ? 5 : 0),
              })
            }
            interval={AIRSPEED_BASE_SPEED}
            delay={200}
            disabled={
              activityState.submitted ||
              activityState.paused ||
              !airspeedEnabled
            }
          >
            <img
              src={require("./images/svgs/arrow.svg").default}
              width={15}
              style={{ transform: "rotate(180deg)" }}
              alt="arrow"
            />
            Dec. Speed
          </PushButton>
        </div>
        <div className="horizontal buttons">
          <PushButton
            className="vertical transition hover:scale-105 active:scale-95 active:brightness-95"
            onClick={() => {
              setUserAnswer({
                ...userAnswer,
                heading: userAnswer.heading - 5,
              });
            }}
            onHold={() => {
              setUserAnswer({
                ...userAnswer,
                heading: userAnswer.heading - 5,
              });
            }}
            interval={1000 / HEADING_BASE_SPEED}
            delay={200}
            disabled={
              activityState.submitted || activityState.paused || !headingEnabled
            }
          >
            <img
              src={require("./images/svgs/arrow.svg").default}
              width={15}
              style={{
                transform: "rotate(-90deg)",
                marginRight: "16px",
              }}
              alt="arrow"
            />
            Left
          </PushButton>
          <PushButton
            className="vertical transition hover:scale-105 active:scale-95 active:brightness-95"
            onClick={() => {
              setUserAnswer({
                ...userAnswer,
                heading: userAnswer.heading + 5,
              });
            }}
            onHold={() => {
              setUserAnswer({
                ...userAnswer,
                heading: userAnswer.heading + 5,
              });
            }}
            interval={1000 / HEADING_BASE_SPEED}
            delay={200}
            disabled={
              activityState.submitted || activityState.paused || !headingEnabled
            }
          >
            Right
            <img
              src={require("./images/svgs/arrow.svg").default}
              width={15}
              style={{
                transform: "rotate(90deg)",
                marginLeft: "16px",
              }}
              alt="arrow"
            />
          </PushButton>
        </div>
        <div className="vertical buttons">
          <PushButton
            className="horizontal transition hover:scale-105 active:scale-95 active:brightness-95"
            onClick={() =>
              setUserAnswer({
                ...userAnswer,
                altimeter:
                  userAnswer.altimeter +
                  (userAnswer.altimeter < MAX_ALTIMETER ? 100 : 0),
              })
            }
            onHold={() =>
              setUserAnswer({
                ...userAnswer,
                altimeter:
                  userAnswer.altimeter +
                  (userAnswer.altimeter < MAX_ALTIMETER ? 500 : 0),
              })
            }
            interval={
              1000 /
              (ALTIMETER_BASE_SPEED * (userAnswer.airspeed / MAX_AIRSPEED))
            }
            delay={200}
            disabled={
              activityState.submitted ||
              activityState.paused ||
              !altimeterEnabled
            }
          >
            <img
              src={require("./images/svgs/arrow.svg").default}
              width={15}
              alt="arrow"
            />
            Inc. Alt
          </PushButton>
          <PushButton
            className="horizontal transition hover:scale-105 active:scale-95 active:brightness-95"
            onClick={() =>
              setUserAnswer({
                ...userAnswer,
                altimeter:
                  userAnswer.altimeter -
                  (userAnswer.altimeter > MIN_ALTIMETER ? 100 : 0),
              })
            }
            onHold={() =>
              setUserAnswer({
                ...userAnswer,
                altimeter:
                  userAnswer.altimeter -
                  (userAnswer.altimeter > MIN_ALTIMETER ? 500 : 0),
              })
            }
            interval={
              1000 /
              (ALTIMETER_BASE_SPEED * (userAnswer.airspeed / MAX_AIRSPEED))
            }
            delay={200}
            disabled={
              activityState.submitted ||
              activityState.paused ||
              !altimeterEnabled
            }
          >
            <img
              src={require("./images/svgs/arrow.svg").default}
              width={15}
              style={{ transform: "rotate(180deg)" }}
              alt="arrow"
            />
            Dec. Alt
          </PushButton>
        </div>
      </div>
    </div>
  );
};

export default InstrumentsActivity;
