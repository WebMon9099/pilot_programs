import _ from "lodash";
import { useCallback, useMemo, useRef } from "react";
import { useSound, useStaticActivity } from "../../../../hooks";
import { appendClass } from "../../../../lib";
import { ActivityComponent } from "../../../../types";
import { PushButton } from "../../../core";
import {
  KEYCODE_MAX_LENGTH_NORMAL,
  KEYCODE_MAX_LENGTH_TRAINING,
  KEYCODE_MIN_LENGTH_NORMAL,
  KEYCODE_MIN_LENGTH_TRAINING,
  SOUND_BASE_DELAY_AMOUNT,
  USER_INPUT_TIME,
} from "./constants";
import { Stages } from "./types";

const NumbersActivity: ActivityComponent = ({
  activityActions,
  activityObject,
  activityState,
  ...rest
}) => {
  const generatedNumberSequenceLength = useRef(
    _.random(
      1,
      activityState.trainingMode
        ? KEYCODE_MAX_LENGTH_TRAINING - KEYCODE_MIN_LENGTH_TRAINING
        : KEYCODE_MAX_LENGTH_NORMAL - KEYCODE_MIN_LENGTH_NORMAL
    ) +
      (activityState.trainingMode
        ? KEYCODE_MIN_LENGTH_TRAINING
        : KEYCODE_MIN_LENGTH_NORMAL)
  ).current;

  const { sound, playSound } = useSound();

  const {
    stage,
    state: generatedNumberSequence,
    choices,
    userAnswer,
    setUserAnswer,
    submitActivity,
  } = useStaticActivity(
    {
      stages: [
        {
          name: Stages.Audio,
          time: generatedNumberSequenceLength * 1250,
        },
        {
          name: Stages.Question,
          time: USER_INPUT_TIME,
        },
      ],
      stateCreator: useCallback(() => {
        let newSequenceLength = generatedNumberSequenceLength;

        let newGeneratedNumberSequence = "";
        while (newSequenceLength-- > 0)
          newGeneratedNumberSequence += _.random(1, 9);

        activityActions.activityIncreaseMaxScore(1);

        return newGeneratedNumberSequence;
      }, [activityActions, generatedNumberSequenceLength]),
      stateChangeHandler: useCallback(
        (generatedNumberSequence: string) => {
          (function playSounds(index: number) {
            const currentSound = generatedNumberSequence.charAt(index);

            playSound(
              `${process.env.REACT_APP_PUBLIC_URL}/sounds/${currentSound}.mp3`,
              function afterStart() {
                setTimeout(() => {
                  playSounds(index + 1);
                }, 1000 * sound.duration + SOUND_BASE_DELAY_AMOUNT);
              },
              function errorWhilePlaying(reason) {
                console.log(
                  "Audio play has not been started for the following reason: ",
                  reason.toString()
                );
              }
            );
          })(0);
        },
        [sound, playSound]
      ),
      choicesCreator: useCallback(
        () => ({
          numbers: ["7", "8", "9", "4", "5", "6", "1", "2", "3"],
          del: "DEL",
          zero: "0",
          ok: "OK",
        }),
        []
      ),
      initialUserAnswer: "",
      getScore: useCallback(
        (generatedNumberSequence: string, userAnswer: string) =>
          generatedNumberSequence === userAnswer.split("").reverse().join("")
            ? 1
            : 0,
        []
      ),
    },
    activityObject,
    activityState,
    activityActions
  );

  const numpadJsx = (
    <>
      {choices.numbers.map((number, index) => (
        <PushButton
          onClick={() => setUserAnswer(userAnswer + number)}
          key={index}
        >
          {number}
        </PushButton>
      ))}
      <PushButton
        className="action delete"
        onClick={() =>
          setUserAnswer(userAnswer.substring(0, userAnswer.length - 1))
        }
      >
        {choices.del}
      </PushButton>
      <PushButton onClick={() => setUserAnswer(userAnswer + choices.zero)}>
        {choices.zero}
      </PushButton>
      <PushButton className="action ok" onClick={submitActivity}>
        {choices.ok}
      </PushButton>
    </>
  );

  const userAnswerAfterSubmit = useMemo(
    () =>
      userAnswer.split("").map((currentChar, i) => (
        <span
          style={{
            color:
              currentChar ===
              generatedNumberSequence.split("").reverse().join("").charAt(i)
                ? "#92e744"
                : "#f1504c",
          }}
          key={i}
        >
          {currentChar}
        </span>
      )),
    [generatedNumberSequence, userAnswer]
  );

  return (
    <div
      {...rest}
      className={appendClass("activity numbers-activity", rest.className)}
    >
      {stage === Stages.Audio ? (
        <div className="icon-container">
          <img
            src={require("./images/svgs/audio_icon.svg").default}
            alt={"audio_icon"}
          />
        </div>
      ) : (
        <>
          <div className="display-container">
            <div className="display font-inter">
              <h1>
                <p>
                  {activityState.submitted && activityState.trainingMode
                    ? userAnswerAfterSubmit
                    : userAnswer}
                </p>
                <p className="correct-answer">
                  {activityState.submitted && activityState.trainingMode
                    ? generatedNumberSequence.split("").reverse().join("")
                    : undefined}
                </p>
              </h1>
            </div>
          </div>
          <div className="numpad-container font-inter">
            <div
              className={`numpad ${
                (activityState.submitted || activityState.paused) && "disabled"
              }`}
            >
              {numpadJsx}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NumbersActivity;
