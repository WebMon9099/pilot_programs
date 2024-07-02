import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useIntervalActivity } from '../../../../hooks';
import { appendClass } from '../../../../lib';
import { ActivityComponent } from '../../../../types';
import { PushButton } from '../../../core';
import LetterCard from './LetterCard';
import { SHOW_ANSWER_TIME } from './constants';
import { Answer } from './types';
import Utils from './utils';

const CharactersActivity: ActivityComponent = ({
  activityObject,
  activityState,
  activityActions,
  ...rest
}) => {
  const [gameState, setGameState] = useState({
    question: '',
    letter: '',
    dotsNumber: 0,
  });
  const {
    state: isSame,
    nextState,
    choices,
    userAnswer,
    setUserAnswer,
  } = useIntervalActivity(
    {
      stateCreator: useCallback(() => _.sample([Answer.Yes, Answer.No])!, []),
      stateChangeHandler: useCallback(
        (shouldBeSame: Answer) => {
          const letter = Utils.generateRandomLetter();
          const dotsNumber = Utils.generateRandomDotsNumber();

          const shownLetter =
            shouldBeSame === Answer.Yes
              ? letter
              : Utils.generateRandomLetter(letter);
          const shownDotsNumber =
            shouldBeSame === Answer.Yes
              ? dotsNumber
              : Utils.generateRandomDotsNumber(dotsNumber);

          const question =
            shouldBeSame === Answer.Yes
              ? Utils.generateQuestion(shownLetter, shownDotsNumber)
              : Utils.generateQuestion(letter, dotsNumber);

          setGameState({
            question,
            letter: shownLetter,
            dotsNumber: shownDotsNumber,
          });

          activityActions.activityIncreaseMaxScore(1);
        },
        [activityActions]
      ),
      choicesCreator: useCallback(() => [Answer.Yes, Answer.No], []),
      initialUserAnswer: Answer.Neutral,
      getScore: useCallback(
        (shouldBeSame: Answer, userAnswer: Answer) =>
          shouldBeSame === userAnswer ? 1 : 0,
        []
      ),
      options: {
        resetUserAnswerOnStateChange: true,
      },
    },
    activityObject,
    activityState,
    activityActions
  );

  useEffect(() => {
    if (userAnswer !== Answer.Neutral) {
      const timeout = setTimeout(nextState, SHOW_ANSWER_TIME);

      return () => clearTimeout(timeout);
    }
  }, [userAnswer, nextState]);

  return (
    <div
      {...rest}
      className={appendClass('activity characters-activity', rest.className)}
    >
      <div className="display-container">
        <p className="title">{gameState.question}</p>
        <LetterCard
          isSame={isSame}
          userAnswer={userAnswer}
          letter={gameState.letter}
          dots={Utils.getDotsObject(gameState.dotsNumber)}
          trainingMode={activityState.trainingMode}
        />
      </div>
      <div className="buttons-container">
        <div className="buttons">
          {choices.map((choice, index) => (
            <PushButton
              key={index}
              className="font-inter transition hover:scale-105 active:scale-95 active:brightness-95"
              disabled={
                activityState.submitted ||
                activityState.paused ||
                userAnswer !== Answer.Neutral
              }
              onClick={() => setUserAnswer(choice)}
            >
              {[choice]}
            </PushButton>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharactersActivity;
