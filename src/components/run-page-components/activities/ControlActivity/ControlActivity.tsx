import { useCallback, useEffect, useRef, useState } from 'react';
import { useControls, useIntervalActivity } from '../../../../hooks';
import { appendClass } from '../../../../lib';
import { ActivityComponent } from '../../../../types';
import { PushButton, ToggleButton } from '../../../core';
import Bar from './Bar';
import { State } from './types';

const ControlActivity: ActivityComponent = ({
  activityObject,
  activityState,
  activityActions,
  activityParams,
  ...rest
}) => {
  const button = useRef<HTMLButtonElement>(null);

  const { addControlEventListener, removeControlEventListener } = useControls();

  const leftStates = useRef<number[]>([]);
  const rightStates = useRef<number[]>([]);

  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  const [upPressed, setUpPressed] = useState(false);
  const [downPressed, setDownPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);
  const [leftPressed, setLeftPressed] = useState(false);

  useIntervalActivity(
    {
      stateCreator: useCallback(() => ({ left: 50, right: 50 }), []),
      stateChangeHandler: useCallback(() => {}, []),
      choicesCreator: useCallback(() => {}, []),
      initialUserAnswer: { left: 50, right: 50 },
      getScore: useCallback(
        (state: State) => {
          var score = 0;

          const leftGood = leftStates.current.reduce((sum, leftState) => {
            return (
              sum +
              (leftState > state.left - 5 && leftState < state.left + 5 ? 1 : 0)
            );
          }, 0);

          const rightGood = rightStates.current.reduce((sum, rightState) => {
            return (
              sum +
              (rightState > state.right - 5 && rightState < state.right + 5
                ? 1
                : 0)
            );
          }, 0);

          activityActions.activityIncreaseMaxScore(2);

          if (leftGood >= leftStates.current.length / 7) score += 1;
          if (rightGood >= rightStates.current.length / 7) score += 1;

          leftStates.current = [];
          rightStates.current = [];

          return score;
        },
        [activityActions]
      ),
      options: {
        interval: 5000,
        increaseScoreTiming: 'OnStateChange',
      },
    },
    activityObject,
    activityState,
    activityActions
  );

  useEffect(() => {
    const arrowKeyPressed = {
      up: false,
      right: false,
      down: false,
      left: false,
    };

    const arrowKeyPressEventListener = addControlEventListener(
      'arrow-key-press',
      (keys) => {
        arrowKeyPressed.up = keys.up;
        setUpPressed(keys.up);
        arrowKeyPressed.down = keys.down;
        setDownPressed(keys.down);
        arrowKeyPressed.right = keys.right;
        setRightPressed(keys.right);
        arrowKeyPressed.left = keys.left;
        setLeftPressed(keys.left);
      }
    );

    const wasdKeyPressEventListener = addControlEventListener(
      'wasd-key-press',
      (keys) => {
        setUpPressed(keys.w || arrowKeyPressed.up);
        setDownPressed(keys.s || arrowKeyPressed.down);
        setRightPressed(keys.d || arrowKeyPressed.right);
        setLeftPressed(keys.a || arrowKeyPressed.left);
      }
    );

    const leftJoystickAxesChangeListener = addControlEventListener(
      "left-physical-axes-change",
      (axes) => {
        // if (axes.x > 0.5){
        //   setRightPressed(true);
        //   setLeftPressed(false);
        // } else if(axes.x < -0.5){
        //   setRightPressed(false);
        //   setLeftPressed(true);
        // } else {
        //   setRightPressed(false);
        //   setLeftPressed(false);
        // }

        if (axes.y > 0.5){
          setUpPressed(true);
          setDownPressed(false);
        } else if(axes.y < -0.5){
          setUpPressed(false);
          setDownPressed(true);
        } else {
          setUpPressed(false);
          setDownPressed(false);
        }
      }
    );

    const rightJoystickAxesChangeListener = addControlEventListener(
      "right-physical-axes-change",
      (axes) => {
        if (axes.x > 0.5){
          setRightPressed(true);
          setLeftPressed(false);
        } else if(axes.x < -0.5){
          setRightPressed(false);
          setLeftPressed(true);
        } else {
          setRightPressed(false);
          setLeftPressed(false);
        }

        // if (axes.y > 0.5){
        //   setUpPressed(true);
        //   setDownPressed(false);
        // } else if(axes.y < -0.5){
        //   setUpPressed(false);
        //   setDownPressed(true);
        // } else {
        //   setUpPressed(false);
        //   setDownPressed(false);
        // }
      }
    );

    return () => {
      removeControlEventListener(arrowKeyPressEventListener);
      removeControlEventListener(wasdKeyPressEventListener);
      removeControlEventListener(leftJoystickAxesChangeListener);
      removeControlEventListener(rightJoystickAxesChangeListener);
    };
  }, [addControlEventListener, removeControlEventListener]);

  return (
    <div
      {...rest}
      className={appendClass('activity control-activity', rest.className)}
    >
      <div className={`bar-container left ${showLeft ? 'activated' : ''}`}>
        {showLeft ? (
          <>
            <div className="buttons-container">
              <PushButton
                ref={button}
                disabled={activityState.paused || activityState.submitted}
                onHold={() => setUpPressed(true)}
                onHoldRelease={() => setUpPressed(false)}
                overrideClick={upPressed}
              >
                <span>Up</span>
                <img
                  src={require('./images/svgs/arrow.svg').default}
                  alt="Up Arrow"
                />
              </PushButton>
              <PushButton
                disabled={activityState.paused || activityState.submitted}
                onHold={() => setDownPressed(true)}
                onHoldRelease={() => setDownPressed(false)}
                overrideClick={downPressed}
              >
                <span>Down</span>
                <img
                  src={require('./images/svgs/arrow.svg').default}
                  alt="Up Arrow"
                  style={{ transform: 'rotate(180deg)' }}
                />
              </PushButton>
            </div>
            <Bar
              upperForce={(() => {
                if (upPressed) return -1;
                else if (downPressed) return 1;
                else return 0;
              })()}
              setUpperState={(state) => leftStates.current.push(state)}
              paused={activityState.paused}
              side="left"
              type={activityParams?.type}
            />
          </>
        ) : (
          <img
            className="no-entry-icon"
            src={require('./images/svgs/no_entry_sign.svg').default}
            alt="Disabled"
          />
        )}
        {activityState.trainingMode && (
          <ToggleButton
            toggled={showLeft}
            disabled={activityState.paused}
            onToggleChange={setShowLeft}
            showText={false}
          />
        )}
      </div>
      <div className={`bar-container right ${showRight ? 'activated' : ''}`}>
        {showRight ? (
          <>
            <Bar
              upperForce={(() => {
                if (rightPressed) return 1;
                else if (leftPressed) return -1;
                else return 0;
              })()}
              setUpperState={(state) => rightStates.current.push(state)}
              paused={activityState.paused}
              side="right"
              type={activityParams?.type}
            />
            <div className="buttons-container">
              <PushButton
                disabled={activityState.paused || activityState.submitted}
                onHold={() => setLeftPressed(true)}
                onHoldRelease={() => setLeftPressed(false)}
                overrideClick={leftPressed}
              >
                <img
                  src={require('./images/svgs/arrow.svg').default}
                  alt="Up Arrow"
                  style={{ transform: 'rotate(-90deg)' }}
                />
                <span>Left</span>
              </PushButton>
              <PushButton
                disabled={activityState.paused || activityState.submitted}
                onHold={() => setRightPressed(true)}
                onHoldRelease={() => setRightPressed(false)}
                overrideClick={rightPressed}
              >
                <span>Right</span>
                <img
                  src={require('./images/svgs/arrow.svg').default}
                  alt="Up Arrow"
                  style={{ transform: 'rotate(90deg)' }}
                />
              </PushButton>
            </div>
          </>
        ) : (
          <img
            className="no-entry-icon"
            src={require('./images/svgs/no_entry_sign.svg').default}
            alt="Disabled"
          />
        )}
        {activityState.trainingMode && (
          <ToggleButton
            toggled={showRight}
            disabled={activityState.paused}
            onToggleChange={setShowRight}
            showText={false}
          />
        )}
      </div>
    </div>
  );
};

export default ControlActivity;
