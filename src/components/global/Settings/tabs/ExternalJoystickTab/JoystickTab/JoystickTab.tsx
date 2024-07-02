import { useControls } from '../../../../../../hooks';
import {
  Dropdown,
  HorizontalRadio,
  LabeledBox,
  NewSlider,
} from '../../../../../core';
import { JOYSTICK_TEXT } from '../constants';
import JoystickTester from '../JoystickTester';

interface JoystickTabProps {
  of: 'Left' | 'Right';
}

const JoystickTab: React.FC<JoystickTabProps> = ({ of }) => {
  const {
    availableGamepads,
    leftActiveGamepad,
    rightActiveGamepad,
    setLeftActiveGamepad,
    setLeftGamepadOptions,
    setRightActiveGamepad,
    setRightGamepadOptions,
  } = useControls();

  const axisBoxesStyle = {
    opacity: availableGamepads.length === 0 ? 0.5 : undefined,
    filter: availableGamepads.length === 0 ? 'grayscale(1)' : undefined,
    pointerEvents: availableGamepads.length === 0 ? 'none' : undefined,
  } as React.CSSProperties;

  const relevantGamepad =
    of === 'Left' ? leftActiveGamepad : rightActiveGamepad;
  const relaventOptionsDispatch =
    of === 'Left' ? setLeftGamepadOptions : setRightGamepadOptions;

  return (
    <>
      <div className="left !justify-start">
        <p>{JOYSTICK_TEXT}</p>
        <div className="device-choose-container mt-auto">
          <span className="mr-[2rem] text-[14px] font-semibold text-[#afafaf]">
            Joystick selected:
          </span>
          <Dropdown
            options={availableGamepads.map((gamepad) => gamepad.name)}
            emptyLabel="No Devices Found"
            selected={relevantGamepad?.gamepad.name || ''}
            onSelection={(option) => {
              const gamepad = availableGamepads.find(
                (gamepad) => gamepad?.name === option
              );

              of === 'Left'
                ? setLeftActiveGamepad(gamepad)
                : setRightActiveGamepad(gamepad);
            }}
          />
        </div>
        <div className="my-auto h-[1px] bg-[#ddd]" />
        <div className="axis-container mb-auto">
          <LabeledBox label="X Axis Options:" style={axisBoxesStyle}>
            <div className="sensitivity-container">
              <span>Sensitivity:</span>
              {/* <Slider
                overrideValue={relevantGamepad?.sensitivityX}
                onValueChange={(sensitivityX) =>
                  relaventOptionsDispatch({ sensitivityX })
                }
              /> */}
              <NewSlider
                className="h-[12px] flex-1 px-0 pt-[4px]"
                min={0}
                max={100}
                value={relevantGamepad?.sensitivityX || 50}
                onValueChange={(sensitivityX) =>
                  relaventOptionsDispatch({ sensitivityX })
                }
              />
            </div>
            <div className="invert-container">
              <span>Invert Axis:</span>
              <HorizontalRadio
                className="shrink-0"
                options={['Yes', 'No']}
                chosen={relevantGamepad?.invertX ? 'Yes' : 'No'}
                onChoiceChange={(choice) =>
                  relaventOptionsDispatch({ invertX: choice === 'Yes' })
                }
              />
              {/* <Checkbox
                overrideChecked={relevantGamepad?.invertX}
                onCheckedChange={(invertX) =>
                  relaventOptionsDispatch({ invertX })
                }
              /> */}
            </div>
          </LabeledBox>
          <LabeledBox label="Y Axis Options:" style={axisBoxesStyle}>
            <div className="sensitivity-container">
              <span>Sensitivity:</span>
              <NewSlider
                className="h-[12px] flex-1 px-0 pt-[4px]"
                min={0}
                max={100}
                value={relevantGamepad?.sensitivityY || 50}
                onValueChange={(sensitivityY) =>
                  relaventOptionsDispatch({ sensitivityY })
                }
              />
              {/* <Slider
                overrideValue={relevantGamepad?.sensitivityY}
                onValueChange={(sensitivityY) =>
                  relaventOptionsDispatch({ sensitivityY })
                }
              /> */}
            </div>
            <div className="invert-container">
              <span>Invert Axis:</span>
              <HorizontalRadio
                className="shrink-0"
                options={['Yes', 'No']}
                chosen={relevantGamepad?.invertY ? 'Yes' : 'No'}
                onChoiceChange={(choice) =>
                  relaventOptionsDispatch({ invertY: choice === 'Yes' })
                }
              />
              {/* <Checkbox
                overrideChecked={relevantGamepad?.invertY}
                onCheckedChange={(invertY) =>
                  relaventOptionsDispatch({ invertY })
                }
              /> */}
            </div>
          </LabeledBox>
        </div>
        {/* <p className="bottom-text">
        {BOTTOM_TEXT}
          </p> */}
      </div>
      <div className="right">
        <JoystickTester of={of} />
      </div>
    </>
  );
};

export default JoystickTab;
