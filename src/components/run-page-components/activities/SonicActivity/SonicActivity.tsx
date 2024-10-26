import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useIntervalActivity, useSound } from '../../../../hooks';
import { appendClass } from '../../../../lib';
import { ActivityComponent } from '../../../../types';
import { ToggleButton } from '../../../core';
import DetectTriangle from './DetectTriangle';
import Math from './Math';
import Sound from './Sound';
import {
  POSSIBLE_MATH_OPS,
  POSSIBLE_SHAPES,
  SOUND_BASE_DELAY_AMOUNT,
  LETTERS_SERIES_LENGTH,
  SHAPE_SERIES_LENGTH,
  ALPHABETA_LETTERS
} from './constants';
import { MathOp, ShapeType, State } from './types';

const SonicActivity: ActivityComponent = ({
  activityObject,
  activityState,
  activityActions,
  ...rest
}) => {
  const [numbersState, setNumbersState] = useState<{
    numbers: number[];
    op: MathOp;
  }>({ numbers: [], op: '+' });
  const [shapes, setShapes] = useState<ShapeType[]>([]);
  const [letters, setLetters] = useState<String[]>([]);
  const [playingSounds, setPlayingSounds] = useState<String[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);

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
          soundCheckGood: null,
          detectTriangleGood: null,
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

        const newShapes: ShapeType[] = [];
        let shape_num = SHAPE_SERIES_LENGTH;
        while(shape_num > 0){
          let new_item = _.sample(POSSIBLE_SHAPES)!;
          if (shape_num === 1){
            if (new_item !== 'left-triangle' && new_item !== 'right-triangle' && !newShapes.includes('right-triangle') && !newShapes.includes('left-triangle')){
              continue;
            }  
          }
          
          if (new_item === 'left-triangle'){
            if (newShapes.includes('right-triangle')){
              continue;
            }
          }
          if (new_item === 'right-triangle'){
            if (newShapes.includes('left-triangle')){
              continue;
            }
          }
          newShapes.push(new_item);
          shape_num--;
        }

        const newLetters: String[] = [];
        const newPlayingSounds: String[] = [];
        for (var i = 0; i < LETTERS_SERIES_LENGTH; i++){
          let item = _.sample(ALPHABETA_LETTERS)!;
          newLetters.push(item);
          newPlayingSounds.push(item + ".wav");
        }

        setNumbersState({ numbers: newNumbers, op: mathOp });
        setShapes(newShapes);
        setLetters(newLetters);
        setPlayingSounds(newPlayingSounds);
      }, []),
      choicesCreator: useCallback(() => {}, []),
      initialUserAnswer: { mathSame: null, soundCheckGood: null, detectTriangleGood: null },
      getScore: useCallback(
        (state: State, answer: State) => {
          let score = 0;

          if (answer.mathSame === state.mathSame && showTopRight) {
            score += 1;
          }
          if (answer.soundCheckGood && showBottomRight) {
            score += 1;
          }
          if (answer.detectTriangleGood && showLeft) {
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

  const setDetectTriangleGood = useCallback(
    (detectTriangleGood: boolean) => setUserAnswer({ ...userAnswer, detectTriangleGood }),
    [setUserAnswer, userAnswer]
  );

  const setMathSame = useCallback(
    (mathSame: boolean) => setUserAnswer({ ...userAnswer, mathSame }),
    [setUserAnswer, userAnswer]
  );

  const setSoundCheck = useCallback(
    (soundCheckGood: boolean) => setUserAnswer({ ...userAnswer, soundCheckGood }),
    [setUserAnswer, userAnswer]
  );

  useEffect(() => {
    if (showBottomRight) setVolume(1);
    else setVolume(0);
  }, [setVolume, showBottomRight]);

  useEffect(() => {
    if (playingSounds.length === 0) return;
    setIsPlayingAudio(true);
    if (isPlayingAudio){
      (function playSounds(index: number) {
        if (playingSounds.length === 0) return;
        const currentSound = playingSounds[index];
        
        playSound(
          `${process.env.PUBLIC_URL}/sounds/alphabeta/${currentSound}`,
          function afterStart() {
            setTimeout(() => {
              if (index < playingSounds.length - 1) {
                if(isPlayingAudio){
                  playSounds(index + 1);
                  setIsPlayingAudio(true);
                }
              } else {
                setIsPlayingAudio(false);
                setPlayingSounds([]);
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
    }
    
  }, [sound, playSound, state, letters, isPlayingAudio]);

  const createNewAudios = () => {
    setLetters([]);
    setPlayingSounds([]);
    setIsPlayingAudio(false);
    if (sound){
      sound.pause();
    }
    setTimeout(() => {
      const newLetters: String[] = [];
      const newPlayingSounds: String[] = [];
      for (var i = 0; i < LETTERS_SERIES_LENGTH; i++){
        let item = _.sample(ALPHABETA_LETTERS)!;
        newLetters.push(item);
        newPlayingSounds.push(item + '.wav');
      }
      setLetters(newLetters);
      setPlayingSounds(newPlayingSounds);
    }, 100);
  }

  return (
    <div
      {...rest}
      className={appendClass('activity sonic-activity', rest.className)}
    >
      <div className="left">
        <DetectTriangle
          disabled={userAnswer.detectTriangleGood !== null || activityState.paused}
          setDetectTriangleGood={setDetectTriangleGood}
          shapes={shapes}
          interval = {10000}
        />
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
          <Sound
            disabled={userAnswer.soundCheckGood !== null || activityState.paused}
            letters={letters}
            setSoundCheck={setSoundCheck}
            isPlayingAudio={isPlayingAudio}
            createNewAudios = {createNewAudios}
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

export default SonicActivity;
