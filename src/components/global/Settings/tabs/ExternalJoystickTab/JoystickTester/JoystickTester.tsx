import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useControls } from '../../../../../../hooks';
import { appendClass } from '../../../../../../lib';
import { SIZE } from './constants';

interface JoystickTabProps extends React.HTMLAttributes<HTMLDivElement> {
  of: 'Left' | 'Right';
}

const JoystickTester: React.FC<JoystickTabProps> = ({ of, ...rest }) => {
  const { addControlEventListener, removeControlEventListener } = useControls();

  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);

  useEffect(() => {
    const physicalAxesChangeListener = addControlEventListener(
      of === 'Left'
        ? 'left-physical-axes-change'
        : 'right-physical-axes-change',
      (axes) => {
        setXPosition(SIZE * axes.x);
        setYPosition(SIZE * axes.y);
      }
    );

    return () => removeControlEventListener(physicalAxesChangeListener);
  }, [addControlEventListener, removeControlEventListener, of]);

  return (
    <div
      {...rest}
      className={appendClass('joystick-tester-container', rest.className)}
    >
      <div className="joystick-tester">
        <div className="coords-container">Current Joystick Pos:</div>
        <div
          className="dot"
          style={{
            top: `${100 - (50 + yPosition / (SIZE / 50))}%`,
            left: `${50 + xPosition / (SIZE / 50)}%`,
          }}
        />
        <div className="x-axis-line" />
        <div className="y-axis-line" />
        <div className="absolute bottom-[1rem] right-[1rem] text-[12px] text-[#bfbfbf]">
          <span>X: {_.round(xPosition)}</span>{' '}
          <span>Y: {_.round(yPosition)}</span>
        </div>
      </div>
    </div>
  );
};

export default JoystickTester;
