import _ from 'lodash';
import { useCallback, useState } from 'react';
import { COLORS } from '../../../../constants';
import { useStaticActivity } from '../../../../hooks';
import { appendClass } from '../../../../lib';
import { ActivityComponent } from '../../../../types';
import { PushButton } from '../../../core';
import {
  CHANGING_IMAGES_NUMBER,
  TOTAL_IMAGES_AMOUNT,
  UNIQUE_IMAGES_NUMBER,
} from './constants';
import images from './images';

const MatrixActivity: ActivityComponent = ({
  activityActions,
  activityObject,
  activityState,
  ...rest
}) => {
  const [leftMatrixImages, setLeftMatrixImages] = useState<string[]>([]);

  const {
    state: changingImageIndexes,
    choices,
    userAnswer,
    setUserAnswer,
    submitActivity,
  } = useStaticActivity(
    {
      stateCreator: useCallback(() => {
        const newState: number[] = [];

        for (let i = 0; i < CHANGING_IMAGES_NUMBER; ++i) {
          newState.push(_.random(TOTAL_IMAGES_AMOUNT - 1));
        }

        activityActions.activityIncreaseMaxScore(1);

        return newState;
      }, [activityActions]),
      stateChangeHandler: useCallback(() => {
        const uniqueImages = _.sampleSize(images, UNIQUE_IMAGES_NUMBER);

        const newLeftMatrixImages: string[] = [];

        for (let i = 0; i < TOTAL_IMAGES_AMOUNT; ++i)
          newLeftMatrixImages.push(_.sample(uniqueImages));

        setLeftMatrixImages(newLeftMatrixImages);
      }, []),
      choicesCreator: useCallback(
        (changingImageIndexes: number[]) => {
          const choices = [...leftMatrixImages];

          changingImageIndexes.forEach((changingIndex) => {
            let changingImage;

            do {
              changingImage = _.sample(images);
            } while (leftMatrixImages.includes(changingImage));

            choices[changingIndex] = changingImage;
          });

          return choices;
        },
        [leftMatrixImages]
      ),
      initialUserAnswer: [],
      getScore: useCallback((state: number[], userAnswer: number[]) => {
        return state.reduce(
          (sum, index) => sum + (userAnswer.includes(index) ? 1 : 0),
          0
        ) === CHANGING_IMAGES_NUMBER
          ? 1
          : 0;
      }, []),
    },
    activityObject,
    activityState,
    activityActions
  );

  return (
    <div
      {...rest}
      className={appendClass('matrix-activity activity', rest.className)}
    >
      <div className="main">
        <div className="matrix">
          {leftMatrixImages.map((image, index) => (
            <div className="item" key={index}>
              <img src={image} alt="" />
            </div>
          ))}
        </div>
        <div className="matrix active">
          {choices.map((image, index) => (
            <PushButton
              className="item"
              disabled={activityState.submitted || activityState.paused}
              style={
                userAnswer.includes(index)
                  ? {
                      backgroundColor: activityState.submitted
                        ? userAnswer.includes(index)
                          ? changingImageIndexes.includes(index)
                            ? '#92e744'
                            : '#f1504c'
                          : COLORS.blue
                        : COLORS.blue,
                    }
                  : {
                      backgroundColor: activityState.submitted
                        ? changingImageIndexes.includes(index)
                          ? COLORS.orange
                          : COLORS.disabled
                        : undefined,
                    }
              }
              onClick={() => {
                if (userAnswer.includes(index)) {
                  setUserAnswer(
                    userAnswer.filter(
                      (selectedImageIndex) => index !== selectedImageIndex
                    )
                  );
                } else {
                  if (userAnswer.length < CHANGING_IMAGES_NUMBER) {
                    setUserAnswer([...userAnswer, index]);
                  }
                }
              }}
              key={index}
            >
              <img
                src={image}
                alt=""
                style={{
                  opacity: activityState.submitted ? 1 : undefined,
                  ...(userAnswer.includes(index)
                    ? {
                        filter: 'brightness(500%)',
                      }
                    : activityState.submitted
                    ? changingImageIndexes.includes(index)
                      ? {
                          filter: 'brightness(500%)',
                        }
                      : undefined
                    : undefined),
                }}
              />
            </PushButton>
          ))}
        </div>
      </div>
      <PushButton
        className="transition hover:scale-105 active:scale-95 active:brightness-95"
        disabled={activityState.submitted || activityState.paused}
        onClick={submitActivity}
      >
        <span>Commit</span>
      </PushButton>
    </div>
  );
};

export default MatrixActivity;
