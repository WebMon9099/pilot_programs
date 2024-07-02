import _ from 'lodash';
import { useCallback } from 'react';
import { useStaticActivity } from '../../../../hooks';
import { appendClass } from '../../../../lib';
import { ActivityComponent } from '../../../../types';
import CardsBoard from './CardsBoard';
import QuickDisplay from './QuickDisplay';
import {
  IMAGES_SHOW_PART_LENGTH,
  MAX_FLASHCARD_AMOUNT,
  MIN_FLASHCARD_AMOUNT,
  TOTAL_IMAGES_AMOUNT,
  USER_INPUT_LENGTH,
} from './constants';
import images from './images';
import { Stages } from './types';

const FlashcardsActivity: ActivityComponent = ({
  activityActions,
  activityObject,
  activityState,
  ...rest
}) => {
  const {
    stage,
    state: flashcardsIndexes,
    choices,
    userAnswer,
    setUserAnswer,
    submitActivity,
  } = useStaticActivity(
    {
      stages: [
        {
          name: Stages.ShowImages,
          time: IMAGES_SHOW_PART_LENGTH,
        },
        {
          name: Stages.Pick,
          time: USER_INPUT_LENGTH,
        },
      ],
      stateCreator: useCallback(() => {
        const newState: number[] = [];
        for (
          let i = 0;
          i < _.sample([MIN_FLASHCARD_AMOUNT, MAX_FLASHCARD_AMOUNT])!;
          ++i
        ) {
          let newIndex = -1;

          do {
            newIndex = _.random(images.length - 1);
          } while (newState.includes(newIndex));

          newState.push(newIndex);
        }

        activityActions.activityIncreaseMaxScore(1);

        return newState;
      }, [activityActions]),
      choicesCreator: useCallback((imageIndexes: number[]) => {
        const newChoices = [...imageIndexes];
        for (let i = 0; i < TOTAL_IMAGES_AMOUNT - imageIndexes.length; ++i) {
          let newIndex = -1;

          do {
            newIndex = _.random(images.length - 1);
          } while (newChoices.includes(newIndex));

          newChoices.push(newIndex);
        }

        return _.shuffle(newChoices);
      }, []),
      initialUserAnswer: [],
      getScore: useCallback(
        (state: number[], userAnswer: number[]) =>
          userAnswer.reduce(
            (flag, answer) => state.includes(answer) && flag,
            true
          )
            ? 1
            : 0,
        []
      ),
    },
    activityObject,
    activityState,
    activityActions
  );

  return (
    <div
      {...rest}
      className={appendClass('activity flashcards-activity', rest.className)}
    >
      {stage === Stages.Pick ? (
        <CardsBoard
          flashcardsIndexes={flashcardsIndexes}
          choices={choices}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          submitActivity={submitActivity}
          paused={activityState.paused}
          submitted={activityState.submitted}
        />
      ) : (
        <QuickDisplay
          images={flashcardsIndexes.map((imageIndex) => images[imageIndex])}
          time={IMAGES_SHOW_PART_LENGTH}
          paused={activityState.paused}
        />
      )}
    </div>
  );
};

export default FlashcardsActivity;
