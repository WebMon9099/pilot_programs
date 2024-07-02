import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import getEquations from '../../../../api/getEquations';
import { useLoadingScreen, useTimeout } from '../../../../hooks';
import { appendClass } from '../../../../lib';
import { ActivityComponent } from '../../../../types';
import { PushButton } from '../../../core';
import CompleteBox from './CompleteBox';
import NumbersContainer from './NumbersContainer';

interface Equation {
  question: string;
  answer: string;
}

var availableEquationsCache: Equation[] = [];
const pickedEquations: number[] = [];

const CalculateActivity: ActivityComponent = ({
  activityObject,
  activityState,
  activityActions,
  ...rest
}) => {
  const [availableEquationsLoading, setAvailableEquationsLoading] =
    useState(false);
  const [availableEquations, setAvailableEquations] = useState<Equation[]>(
    availableEquationsCache
  );
  const [currentEquation, setCurrentEquation] = useState<Equation | undefined>(
    undefined
  );
  const [state, setState] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9,
  ]);

  useTimeout(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(() => checkAnswer(), []),
    activityObject.sessionLength,
    activityState.paused,
    true
  );

  useEffect(() => {
    if (availableEquationsCache.length === 0)
      getEquations().then((equations) => {
        setAvailableEquations(equations);
        setAvailableEquationsLoading(false);

        availableEquationsCache = equations;
      });
  }, []);

  useEffect(() => {
    if (availableEquations.length === 0) return;

    activityActions.activityNextStage('Question', activityObject.sessionLength);

    do var equationIndex = _.random(0, availableEquations.length - 1);
    while (pickedEquations.includes(equationIndex));

    pickedEquations.push(equationIndex);

    const equation = availableEquations[equationIndex];

    let questionElements = equation.question
      .split(' ')
      .join('')
      .split('(')
      .join('')
      .split(')')
      .join('')
      .split('=')
      .join(',')
      .split('+')
      .join(',')
      .split('–')
      .join(',')
      .split('-')
      .join(',')
      .split('x')
      .join(',')
      .split('/')
      .join(',')
      .split(',');
    if (questionElements[0] === '') questionElements.splice(0, 1);

    let answerElements = equation.answer
      .split(' ')
      .join('')
      .split('(')
      .join('')
      .split(')')
      .join('')
      .split('=')
      .join(',')
      .split('+')
      .join(',')
      .split('–')
      .join(',')
      .split('-')
      .join(',')
      .split('x')
      .join(',')
      .split('/')
      .join(',')
      .split(',');
    if (answerElements[0] === '') answerElements.splice(0, 1);

    const newState: string[] = [];
    questionElements.forEach((e, i) => {
      if (e === 'NULL') newState.push(answerElements[i]);
    });

    activityActions.activityIncreaseMaxScore(1);

    equation.question = equation.question.split('NULL').join('Y');

    setState(newState);
    setCurrentEquation(equation);
  }, [activityObject.sessionLength, activityActions, availableEquations]);

  useLoadingScreen(availableEquationsLoading);

  return (
    <div
      {...rest}
      className={appendClass('activity calculate-activity', rest.className)}
    >
      <div
        className="equation-container"
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="equation">
          <h2>
            {(() => {
              var completeBoxIndex = 0;

              return currentEquation?.question.split('').map((c, i) => {
                if (c === 'Y') {
                  const index = completeBoxIndex++;

                  return (
                    <CompleteBox
                      availableNumbers={availableNumbers}
                      setAvailableNumbers={setAvailableNumbers}
                      disabled={activityState.submitted}
                      style={{
                        backgroundColor:
                          activityState.submitted && activityState.trainingMode
                            ? userAnswer[index] === state[index]
                              ? '#92e744'
                              : '#f1504c'
                            : undefined,
                        color:
                          activityState.submitted && activityState.trainingMode
                            ? 'white'
                            : undefined,
                      }}
                      onNumberDrop={(value) => {
                        const newUserAnswer = [...userAnswer];

                        newUserAnswer[index] = value;

                        setUserAnswer(newUserAnswer);
                      }}
                      onClick={() => {
                        if (!isNaN(parseInt(userAnswer[index]))) {
                          const newUserAnswer = [...userAnswer];

                          delete newUserAnswer[index];

                          setUserAnswer(newUserAnswer);
                          setAvailableNumbers(
                            [
                              ...availableNumbers,
                              parseInt(userAnswer[index]),
                            ].sort((a, b) => a - b)
                          );
                        }
                      }}
                      value={userAnswer[index]}
                      key={i}
                    />
                  );
                }

                return c;
              });
            })()}
            {/* -7 +{' '}
            <CompleteBox
              availableNumbers={availableNumbers}
              setAvailableNumbers={setAvailableNumbers}
            />{' '}
            = (8 + 4) /{' '}
            <CompleteBox
              availableNumbers={availableNumbers}
              setAvailableNumbers={setAvailableNumbers}
            /> */}
          </h2>
        </div>
      </div>
      <NumbersContainer
        availableNumbers={availableNumbers}
        setAvailableNumbers={setAvailableNumbers}
        disabled={activityState.submitted}
        onNumberDrop={(value) => {
          const newUserAnswer = [...userAnswer];

          const removeIndex = newUserAnswer.findIndex((v) => v === value);

          if (removeIndex !== -1) {
            delete newUserAnswer[removeIndex];

            setUserAnswer(newUserAnswer);
          }
        }}
        onNumberClick={(value) => {
          const newUserAnswer = [...userAnswer];

          var freeIndex = 0;
          while (newUserAnswer[freeIndex]) freeIndex += 1;

          if (freeIndex <= state.length - 1) {
            newUserAnswer[freeIndex] = value;

            const newAvailableNumbers = [...availableNumbers];
            newAvailableNumbers.splice(
              newAvailableNumbers.findIndex((v) => v === parseInt(value)),
              1
            );

            setUserAnswer(newUserAnswer);
            setAvailableNumbers(newAvailableNumbers);
          }
        }}
      />
      <PushButton
        className="pv-40 ph-160 transition hover:scale-105 active:scale-95 active:brightness-95"
        disabled={activityState.submitted || activityState.paused}
        onClick={checkAnswer}
      >
        <span>Commit</span>
      </PushButton>
    </div>
  );

  function checkAnswer() {
    var correct = true;
    userAnswer.forEach((v, i) => {
      if (v !== state[i]) correct = false;
    });

    activityActions.activitySetSubmit(true, correct ? 1 : 0);
  }
};

export default CalculateActivity;
