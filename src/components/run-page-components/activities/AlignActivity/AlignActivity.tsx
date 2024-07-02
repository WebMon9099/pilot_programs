import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useIntervalActivity, useSound } from '../../../../hooks';
import { appendClass } from '../../../../lib';
import { ActivityComponent } from '../../../../types';
import { ToggleButton } from '../../../core';
import Math from './Math';
import Shapes from './Shapes';
import {
  POSSIBLE_COLORS,
  POSSIBLE_MATH_OPS,
  POSSIBLE_SHAPES,
  SOUND_BASE_DELAY_AMOUNT,
} from './constants';
import { CatchingBalls, Slalom } from './left-game-components';
import { MathOp, Shape, State } from './types';

const AlignActivity: ActivityComponent = ({
  activityObject,
  activityState,
  activityActions,
  activityParams,
  ...rest
}) => {
  const [numbersState, setNumbersState] = useState<{
    numbers: number[];
    op: MathOp;
  }>({ numbers: [], op: '+' });
  const [shapes, setShapes] = useState<Shape[]>([]);

  const [showLeft, setShowLeft] = useState(true);
  const [showTopRight, setShowTopRight] = useState(true);
  const [showBottomRight, setShowBottomRight] = useState(true);

  const { setVolume, sound, playSound } = useSound();

  const { state, userAnswer, setUserAnswer } = useIntervalActivity(
    {
      stateCreator: useCallback(() => {
        activityActions.activityIncreaseMaxScore(3);

        return {
          mathSame: _.sample([true, false])!,
          shapesSame: _.sample([true, false])!,
          gameGood: true,
        } as State;
      }, [activityActions]),
      stateChangeHandler: useCallback((state: State) => {
        const mathOp = _.sample(POSSIBLE_MATH_OPS)!;
        const numbersAmount = mathOp === '+' || mathOp === '-' ? 3 : 2;

        const newNumbers: number[] = _.times(numbersAmount, () =>
          _.random(1, 9)
        );
        const correctAnswer = newNumbers.reduce((sum, num) => {
          switch (mathOp) {
            case '+':
              return sum + num;
            case '-':
              return sum - num;
            case '*':
              return (sum === 0 ? 1 : sum) * num;
            default:
              return 0;
          }
        }, 0);

        if (state.mathSame) newNumbers.push(correctAnswer);
        else {
          let lastNumber;
          do {
            lastNumber = _.random(
              correctAnswer - (mathOp === '+' || mathOp === '-' ? 10 : 5),
              correctAnswer + (mathOp === '+' || mathOp === '-' ? 10 : 5)
            );
          } while (lastNumber === correctAnswer);

          newNumbers.push(lastNumber);
        }

        const newShapes: Shape[] = [];
        for (let i = 0; i < 3; ++i) {
          newShapes.push({
            type: _.sample(POSSIBLE_SHAPES)!,
            color: _.sample(POSSIBLE_COLORS)!,
          });
        }

        setNumbersState({ numbers: newNumbers, op: mathOp });
        setShapes(newShapes);
      }, []),
      choicesCreator: useCallback(() => {}, []),
      initialUserAnswer: { mathSame: null, shapesSame: false, gameGood: true },
      getScore: useCallback(
        (state: State, answer: State) => {
          let score = 0;

          if (answer.mathSame === state.mathSame && showTopRight) {
            score += 1;
          }
          if (answer.shapesSame === state.shapesSame && showBottomRight) {
            score += 1;
          }
          if (answer.gameGood && showLeft) {
            score += 1;
          }

          return score;
        },
        [showBottomRight, showLeft, showTopRight]
      ),
      options: {
        interval: 10000,
        increaseScoreTiming: 'OnStateChange',
        resetUserAnswerOnStateChange: true,
      },
    },
    activityObject,
    activityState,
    activityActions
  );

  const setGameGood = useCallback(
    (gameGood: boolean) => setUserAnswer({ ...userAnswer, gameGood }),
    [setUserAnswer, userAnswer]
  );

  const setMathSame = useCallback(
    (mathSame: boolean) => setUserAnswer({ ...userAnswer, mathSame }),
    [setUserAnswer, userAnswer]
  );

  const setShapesSame = useCallback(
    (shapesSame: boolean) => setUserAnswer({ ...userAnswer, shapesSame }),
    [setUserAnswer, userAnswer]
  );

  useEffect(() => {
    if (showBottomRight) setVolume(1);
    else setVolume(0);
  }, [setVolume, showBottomRight]);

  useEffect(() => {
    const sounds: string[] = [];

    var allRight = true;
    for (let i = 0; i < shapes.length; ++i) {
      const rightSound = `${shapes[i].color}_${shapes[i].type}.mp3`;

      if (state.shapesSame) sounds.push(rightSound);
      else {
        var badSound = '';
        do {
          badSound = `${_.sample(POSSIBLE_COLORS)}_${_.sample(
            POSSIBLE_SHAPES
          )}.mp3`;
        } while (badSound === rightSound);

        if (allRight) {
          sounds.push(badSound);
          allRight = false;
        } else {
          allRight = _.sample([false, true])!;
          if (allRight) sounds.push(rightSound);
          else sounds.push(badSound);
        }
      }
    }

    if (sounds.length === 0) return;

    (function playSounds(index: number) {
      const currentSound = sounds[index];

      playSound(
        `${process.env.PUBLIC_URL}/sounds/${currentSound}`,
        function afterStart() {
          setTimeout(() => {
            if (index < sounds.length - 1) {
              playSounds(index + 1);
            }
          }, 1000 * sound.duration + SOUND_BASE_DELAY_AMOUNT);
        },
        function errorWhilePlaying(reason) {
          console.log(
            'Audio play has not been started for the following reason: ',
            reason.toString()
          );
        }
      );
    })(0);
  }, [sound, playSound, state, shapes]);

  return (
    <div
      {...rest}
      className={appendClass('activity align-activity', rest.className)}
    >
      <div className="left">
        {activityParams?.type === 'Vertical' ? (
          <CatchingBalls
            activityState={activityState}
            paused={activityState.paused || !showLeft}
            setGameGood={setGameGood}
            style={{ display: showLeft ? 'inherit' : 'none' }}
          />
        ) : (
          <Slalom
            activityState={activityState}
            paused={activityState.paused || !showLeft}
            setGameGood={setGameGood}
            style={{ display: showLeft ? 'inherit' : 'none' }}
          />
        )}
        {!showLeft ? (
          <img
            className="no-entry-icon"
            src={require('./images/svgs/no_entry_sign.svg').default}
            alt="Disabled"
          />
        ) : null}
      </div>
      <div className="top-right">
        {showTopRight ? (
          <Math
            disabled={userAnswer.mathSame !== null || activityState.paused}
            numbers={numbersState.numbers}
            op={numbersState.op}
            setMathSame={setMathSame}
          />
        ) : (
          <img
            className="no-entry-icon"
            src={require('./images/svgs/no_entry_sign.svg').default}
            alt="Disabled"
          />
        )}
      </div>
      <div className="bottom-right">
        {showBottomRight ? (
          <Shapes
            disabled={userAnswer.shapesSame !== false || activityState.paused}
            shapes={shapes}
            setShapesSame={setShapesSame}
          />
        ) : (
          <img
            className="no-entry-icon"
            src={require('./images/svgs/no_entry_sign.svg').default}
            alt="Disabled"
          />
        )}
      </div>
      {activityState.trainingMode && (
        <>
          <ToggleButton
            className="show-left-toggle-button"
            disabled={activityState.paused}
            toggled={showLeft}
            onToggleChange={setShowLeft}
            showText={false}
          />
          <ToggleButton
            className="show-top-right-toggle-button"
            disabled={activityState.paused}
            toggled={showTopRight}
            onToggleChange={setShowTopRight}
            showText={false}
          />
          <ToggleButton
            className="show-botom-right-toggle-button"
            disabled={activityState.paused}
            toggled={showBottomRight}
            onToggleChange={setShowBottomRight}
            showText={false}
          />
        </>
      )}
    </div>
  );
};

export default AlignActivity;
