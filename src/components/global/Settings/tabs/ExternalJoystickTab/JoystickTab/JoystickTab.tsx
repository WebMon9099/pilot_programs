import { useControls } from "../../../../../../hooks";
import {
  Dropdown,
  HorizontalRadio,
  LabeledBox,
  NewSlider,
} from "../../../../../core";
import { JOYSTICK_TEXT } from "../constants";
import JoystickTester from "../JoystickTester";

interface JoystickTabProps {
  of: "Left" | "Right";
}

const JoystickTab: React.FC<JoystickTabProps> = ({ of }) => {
  const {
    availableGamepads,
    leftActiveGamepad,
    rightActiveGamepad,
    leftGamepadOptions,
    rightGamepadOptions,
    setLeftActiveGamepad,
    setRightActiveGamepad,
    updateLeftGamepadOptions,
    updateRightGamepadOptions,
  } = useControls();

  const axisBoxesStyle = {
    opacity: availableGamepads.length === 0 ? 0.5 : undefined,
    filter: availableGamepads.length === 0 ? "grayscale(1)" : undefined,
    pointerEvents: availableGamepads.length === 0 ? "none" : undefined,
  } as React.CSSProperties;

  const relevantGamepad =
    of === "Left" ? leftActiveGamepad : rightActiveGamepad;
  const relevantOptions =
    of === "Left" ? leftGamepadOptions : rightGamepadOptions;
  const relevantOptionsUpdateDispatch =
    of === "Left" ? updateLeftGamepadOptions : updateRightGamepadOptions;

  return (
    <>
      <div className="left !justify-start">
        <p>{JOYSTICK_TEXT}</p>
        <div className="device-choose-container mt-auto">
          <span className="mr-[2rem] text-[14px] font-semibold text-[#afafaf]">
            Joystick selected:
          </span>
          <Dropdown
            options={availableGamepads.map((gamepad) => ({
              key: gamepad.id,
              label: gamepad.name,
            }))}
            emptyLabel="No Devices Found"
            selected={relevantGamepad?.id || ""}
            onSelection={(option) => {
              const gamepad = availableGamepads.find(
                (gamepad) => gamepad?.id === option
              );

              of === "Left"
                ? setLeftActiveGamepad(gamepad)
                : setRightActiveGamepad(gamepad);
            }}
            align="left"
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
                value={relevantOptions.sensitivityX || 50}
                onValueChange={(sensitivityX) => {
                  if (!relevantGamepad) return;

                  relevantOptionsUpdateDispatch({ sensitivityX });
                }}
              />
            </div>
            <div className="invert-container">
              <span>Invert Axis:</span>
              <HorizontalRadio
                className="shrink-0"
                options={["Yes", "No"]}
                chosen={relevantOptions.invertX ? "Yes" : "No"}
                onChoiceChange={(choice) => {
                  if (!relevantGamepad) return;

                  relevantOptionsUpdateDispatch({ invertX: choice === "Yes" });
                }}
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
                value={relevantOptions.sensitivityY || 50}
                onValueChange={(sensitivityY) => {
                  if (!relevantGamepad) return;

                  relevantOptionsUpdateDispatch({ sensitivityY });
                }}
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
                options={["Yes", "No"]}
                chosen={relevantOptions.invertY ? "Yes" : "No"}
                onChoiceChange={(choice) => {
                  if (!relevantGamepad) return;

                  relevantOptionsUpdateDispatch({ invertY: choice === "Yes" });
                }}
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
