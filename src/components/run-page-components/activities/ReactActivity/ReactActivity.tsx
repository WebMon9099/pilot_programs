import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntervalActivity } from '../../../../hooks';
import { appendClass } from '../../../../lib';
import { ActivityComponent } from '../../../../types';
import { PushButton } from '../../../core';
import Sliders from './Sliders';
import { IMAGES_CHANGE_BASE_INTERVAL } from './constants';
import images from './images';
import { Answer } from './types';
import Utils from './utils';

const ReactActivity: ActivityComponent = ({
  activityActions,
  activityObject,
  activityState,
  ...rest
}) => {
  const [gameState, setGameState] = useState({
    leftImageIndex: -1,
    rightImageIndex: -1,
  });
  const spacebarButtonRef = useRef<HTMLButtonElement>(null);
  const isSpacebarPressed = useRef(false);

  const {
    state: isSame,
    userAnswer,
    setUserAnswer,
  } = useIntervalActivity(
    {
      stateCreator: useCallback(() => {
        // activityActions.activityIncreaseMaxScore(1);

        return _.sample([Answer.Same, Answer.Different, Answer.Different])!;
      }, [activityActions]),
      stateChangeHandler: useCallback((isSame: Answer) => {
        const newLeftImageIndex = _.random(images.length - 1);
        const newRightImageIndex =
          isSame === Answer.Same
            ? newLeftImageIndex
            : (() => {
                let index;
                do {
                  index = _.random(images.length - 1);
                } while (index === newLeftImageIndex);

                return index;
              })();

        setGameState({
          leftImageIndex: newLeftImageIndex,
          rightImageIndex: newRightImageIndex,
        });
      }, []),
      choicesCreator: useCallback(() => {}, []),
      initialUserAnswer: Answer.Neutral,
      getScore: useCallback(
        (answer: Answer, userAnswer: Answer) => {
          if (answer == Answer.Same && userAnswer === Answer.Neutral){
            activityActions.activityIncreaseMaxScore(1);
          }
          return (answer === userAnswer ? 1 : 0)
        },
        []
      ),
      options: {
        interval: IMAGES_CHANGE_BASE_INTERVAL / activityState.speed,
        increaseScoreTiming: 'OnUserAnswerChange',
        resetUserAnswerOnStateChange: true,
      },
    },
    activityObject,
    activityState,
    activityActions
  );

  useEffect(() => {
    const spacebarDownHandler = Utils.createSpacebarHandler(() =>
      spacebarButtonRef.current?.click()
    );

    document.addEventListener('keydown', spacebarDownHandler);

    return () => document.removeEventListener('keydown', spacebarDownHandler);
  }, []);

  const imageBackgroundColor = (() => {
    if (userAnswer === Answer.Same && isSame === Answer.Different) {
      return '#f1504c';
    } else if (userAnswer === Answer.Same && isSame === Answer.Same) {
      return '#92e744';
    }
  })();

  return (
    <div
      {...rest}
      className={appendClass('activity react-activity', rest.className)}
    >
      <div className="main">
        <div
          className="image-container left"
          style={{
            backgroundColor: activityState.trainingMode
              ? imageBackgroundColor
              : undefined,
          }}
        >
          <img
            src={images[gameState.leftImageIndex]}
            style={{
              filter: activityState.trainingMode
                ? userAnswer !== Answer.Neutral
                  ? 'brightness(400%)'
                  : ''
                : '',
            }}
            alt="left"
          />
        </div>
        <Sliders paused={activityState.paused} speed={activityState.speed} />
        <div
          className="image-container right"
          style={{
            backgroundColor: activityState.trainingMode
              ? imageBackgroundColor
              : undefined,
          }}
        >
          <img
            src={images[gameState.rightImageIndex]}
            style={{
              filter: activityState.trainingMode
                ? userAnswer !== Answer.Neutral
                  ? 'brightness(400%)'
                  : ''
                : '',
            }}
            alt="right"
          />
        </div>
      </div>
      <PushButton
        disabled={
          activityState.submitted ||
          activityState.paused ||
          isSpacebarPressed.current ||
          userAnswer !== Answer.Neutral
        }
        className="transition hover:scale-105 active:scale-95 active:brightness-95"
        onClick={() => setUserAnswer(Answer.Same)}
        ref={spacebarButtonRef}
      >
        <span>Match</span>
      </PushButton>
    </div>
  );
};

export default ReactActivity;
