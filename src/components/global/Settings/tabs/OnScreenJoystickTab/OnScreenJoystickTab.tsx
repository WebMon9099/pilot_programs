import {
  OnScreenJoystickPosition,
  OnScreenJoystickSize,
} from '../../../../../context/ControlsContext/types';
import { useControls } from '../../../../../hooks';
import { appendClass } from '../../../../../lib';
import { HorizontalRadio } from '../../../../core';
import { POSITION_TEXT, SIZE_TEXT } from './constants';

const OnScreenJoystickTab: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...rest
}) => {
  const {
    onScreenJoystickPosition,
    onScreenJoystickSize,
    setOnScreenJoystickPosition,
    setOnScreenJoystickSize,
  } = useControls();

  return (
    <div
      {...rest}
      className={appendClass('on-screen-joystick-tab tab', rest.className)}
    >
      <div className="row">
        <div className="top">
          <b className="title">Position</b>
        </div>
        <div className="bottom">
          <div className="left">
            <p className="description">{POSITION_TEXT}</p>
          </div>
          <div className="right shrink-0">
            <HorizontalRadio
              className="min-w-[247px]"
              options={Object.values(OnScreenJoystickPosition)}
              chosen={onScreenJoystickPosition}
              onChoiceChange={(choice) =>
                setOnScreenJoystickPosition(choice as OnScreenJoystickPosition)
              }
            />
          </div>
        </div>
      </div>
      <div className="max-h-[16px] flex-1" />
      <div className="row">
        <div className="top">
          <b className="title">Size</b>
        </div>
        <div className="bottom">
          <div className="left">
            <p className="description">{SIZE_TEXT}</p>
          </div>
          <div className="right">
            <HorizontalRadio
              options={Object.values(OnScreenJoystickSize)}
              chosen={onScreenJoystickSize}
              onChoiceChange={(choice) =>
                setOnScreenJoystickSize(choice as OnScreenJoystickSize)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnScreenJoystickTab;
