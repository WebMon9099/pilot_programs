import { useState } from "react";
import { appendClass } from "../../../../../lib";
import JoystickTab from "./JoystickTab";

const ExternalJoystickTab: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...rest
}) => {
  const [selectedJoystickTab, setSelectedJoystickTab] = useState<
    "Left" | "Right"
  >("Left");

  return (
    <div
      {...rest}
      className={appendClass("external-joystick-tab tab", rest.className)}
    >
      <div className="joystick-selection-tabbar">
        <button
          className={selectedJoystickTab === "Left" ? "selected" : ""}
          onClick={() => setSelectedJoystickTab("Left")}
        >
          Left Joystick
        </button>
        <button
          className={selectedJoystickTab === "Right" ? "selected" : ""}
          onClick={() => setSelectedJoystickTab("Right")}
        >
          Right Joystick
        </button>
      </div>
      <div className="row">
        <JoystickTab of={selectedJoystickTab} />
      </div>
    </div>
  );
};

export default ExternalJoystickTab;
