import { COLORS } from '../../../../../constants';
import { appendClass } from '../../../../../lib';
import { Callback, SetState } from '../../../../../types';
import { PushButton } from '../../../../core';
import images from '../images';

interface CardsBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  flashcardsIndexes: number[];
  choices: number[];
  submitActivity: Callback;
  userAnswer: number[];
  setUserAnswer: SetState<number[]>;
  paused: boolean;
  submitted: boolean;
}

const CardsBoard: React.FC<CardsBoardProps> = ({
  flashcardsIndexes: state,
  choices,
  submitActivity,
  userAnswer,
  setUserAnswer,
  paused,
  submitted,
  ...rest
}) => {
  const cardElements = (() =>
    choices.map((choice, index) => (
      <PushButton
        key={index}
        className="card"
        disabled={submitted || paused}
        style={{
          ...(userAnswer.includes(choice)
            ? { backgroundColor: COLORS.blue }
            : {
                backgroundColor: submitted ? COLORS.white : undefined,
              }),
          ...(submitted
            ? userAnswer.includes(choice)
              ? state.includes(choice)
                ? {
                    border: `5px solid #92e744`,
                    backgroundColor: COLORS.white,
                  }
                : {
                    border: `5px solid #f1504c`,
                    backgroundColor: COLORS.white,
                  }
              : state.includes(choice)
              ? {
                  border: `5px solid ${COLORS.orange}`,
                  backgroundColor: COLORS.white,
                }
              : {
                  backgroundColor: COLORS.disabled,
                }
            : undefined),
        }}
        onClick={() => {
          if (userAnswer.includes(choice))
            setUserAnswer(userAnswer.filter((answer) => answer !== choice));
          else if (userAnswer.length < state.length)
            setUserAnswer([...userAnswer, choice]);
        }}
      >
        <img
          src={images[choice]}
          alt=""
          style={{
            ...{
              opacity: state.includes(choice) && submitted ? 1 : undefined,
            },
            ...(userAnswer.includes(choice)
              ? {
                  opacity: submitted ? 1 : undefined,
                  filter: submitted
                    ? ''
                    : 'invert(100%) sepia(100%) saturate(38%) hue-rotate(321deg) brightness(110%) contrast(110%)',
                  objectFit: 'fill',
                }
              : undefined),
          }}
        />
      </PushButton>
    )))();

  return (
    <div
      {...rest}
      className={appendClass('cards-board display', rest.className)}
    >
      <div className="cards">{cardElements}</div>
      <PushButton
        className="pv-40 ph-160 transition hover:scale-105 active:scale-95 active:brightness-95"
        disabled={submitted || paused}
        onClick={submitActivity}
      >
        <span>Commit</span>
      </PushButton>
    </div>
  );
};

export default CardsBoard;
