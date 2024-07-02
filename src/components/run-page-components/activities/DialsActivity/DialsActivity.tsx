import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useStaticActivity } from '../../../../hooks';
import { appendClass } from '../../../../lib';
import { ActivityComponent } from '../../../../types';
import { PushButton } from '../../../core';
import {
  AVAILABLE_CATEGORIES,
  NUMBER_OF_IMAGES,
  SHOW_CATEGORY_TIME,
  SHOW_GRID_TIME,
  SHOW_QUESTIONS_TIME,
} from './constants';
import images from './images';
import { Stages, State } from './types';

const DialsActivity: ActivityComponent = ({
  activityActions,
  activityObject,
  activityState,
  ...rest
}) => {
  const [gameState, setGameState] = useState<{
    category: string;
    imageSrcs: string[];
  }>({ category: '', imageSrcs: [] });
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const {
    stage,
    state: answers,
    choices,
    userAnswer,
    setUserAnswer,
    submitActivity,
  } = useStaticActivity(
    {
      stages: [
        {
          name: Stages.ShowCategory,
          time: SHOW_CATEGORY_TIME,
        },
        {
          name: Stages.Display,
          time: SHOW_GRID_TIME,
        },
        {
          name: Stages.Question,
          time: SHOW_QUESTIONS_TIME,
        },
      ],
      stateCreator: useCallback(() => {
        const answers: (number | 'nr')[] = [];

        var readCount = 0;

        for (let i = 0; i < NUMBER_OF_IMAGES; ++i) {
          const answer =
            readCount < 4
              ? (_.sample([1, 2, 3, 5, 6, 7, 'nr', 'nr', 'nr', 'nr'])! as
                  | number
                  | 'nr')
              : 'nr';

          if (answer !== 'nr') readCount += 1;

          answers.push(answer);
        }

        activityActions.activityIncreaseMaxScore(NUMBER_OF_IMAGES);

        return answers;
      }, [activityActions]),
      stateChangeHandler: useCallback((state: State) => {
        const category =
          AVAILABLE_CATEGORIES[_.random(AVAILABLE_CATEGORIES.length - 1)];

        const categoriesAmount: { [key: string]: number } = {
          'Black Squares': 0,
          'Black Circles': 0,
          'White Squares': 0,
          'White Circles': 0,
        };

        const newImageSrcs = state.map((answer) => {
          let releventImages = images;

          do {
            if (answer === 'nr')
              releventImages = releventImages.filter(
                (image) => !image.category.includes(category)
              );
            else
              releventImages = releventImages.filter(
                (image) =>
                  image.value === answer && image.category.includes(category)
              );

            var selectedImage = _.sample(releventImages)!;
          } while (categoriesAmount[selectedImage.category] >= 4);

          categoriesAmount[selectedImage.category] += 1;

          return selectedImage.src;
        });

        setGameState({ category, imageSrcs: newImageSrcs });
      }, []),
      choicesCreator: useCallback(
        () => [1, 2, 3, 4, 5, 6, 7, 8, 'nr'] as State,
        []
      ),
      initialUserAnswer: [],
      getScore: useCallback((state: State, userAnswer: State) => {
        let score = 0;
        for (let i = 0; i < userAnswer.length; ++i)
          if (userAnswer[i] === state[i]) score += 1;

        return score;
      }, []),
    },
    activityObject,
    activityState,
    activityActions
  );

  useEffect(() => {
    if (userAnswer.length === NUMBER_OF_IMAGES) submitActivity();
  }, [submitActivity, userAnswer]);

  const jsx = (() => {
    if (stage === Stages.ShowCategory) {
      return (
        <div className="text-container font-inter">
          <h1
            style={{
              fontSize: '60px',
              color: '#494949',
              fontWeight: 300,
            }}
          >
            {gameState.category}
          </h1>
        </div>
      );
    } else if (
      stage === Stages.Display ||
      (activityState.submitted && activityState.trainingMode)
    ) {
      return (
        <div className="images-grid">
          {gameState.imageSrcs.map((src, index) => (
            <img
              src={src}
              style={{
                border: activityState.submitted
                  ? userAnswer[index] === answers[index]
                    ? `5px solid #92e744`
                    : `5px solid #f1504c`
                  : undefined,
              }}
              key={index}
              alt="dial_img"
            />
          ))}
        </div>
      );
    } else if (stage === Stages.Question) {
      return (
        <div className="question-container">
          <div className="display-container font-inter">
            <h1>
              What did Instrument <b>{currentQuestion + 1}</b> show?
            </h1>
          </div>
          <div className="numpad-container">
            <div className="numpad font-inter">
              {choices.map((choice, index) => (
                <PushButton
                  disabled={activityState.submitted || activityState.paused}
                  className={
                    choice === 'nr'
                      ? 'not-read-key col-span-full'
                      : 'number-key'
                  }
                  onClick={() => {
                    setUserAnswer([...userAnswer, choice]);

                    if (currentQuestion < NUMBER_OF_IMAGES - 1)
                      setCurrentQuestion(currentQuestion + 1);
                  }}
                  key={index}
                >
                  {choice === 'nr' ? 'Instrument Not Read' : choice}
                </PushButton>
              ))}
            </div>
          </div>
        </div>
      );
    }
  })();

  return (
    <div
      {...rest}
      className={appendClass('activity direction-activity', rest.className)}
    >
      {jsx}
    </div>
  );
};

export default DialsActivity;
