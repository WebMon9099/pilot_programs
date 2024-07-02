import { useEffect, useState } from 'react';
import { CONTROLS_CONTEXT_INITIAL_STATE } from '../../../context/ControlsContext/constants';
import { useControls } from '../../../hooks';
import { appendClass } from '../../../lib';
import { Callback } from '../../../types';
import { PushButton } from '../../core';
import TabButtons from './TabButtons';
import { AVAILABLE_TABS } from './constants';
import {
  ExternalJoystickTab,
  MouseAndTrackpadTab,
  OnScreenJoystickTab,
} from './tabs';

interface SettingsProps extends React.HTMLAttributes<HTMLDivElement> {
  closeSettings: Callback;
}

const Settings: React.FC<SettingsProps> = ({ closeSettings, ...rest }) => {
  const {
    setOnScreenJoystickPosition,
    setOnScreenJoystickSize,
    setMouseSensitivity,
    setLeftGamepadOptions,
    setRightGamepadOptions,
    save,
    load,
  } = useControls();

  const [activatedTabIndex, setActivatedTabIndex] = useState(0);

  function resetDefaults(all = false) {
    if (activatedTabIndex === 0 || all) {
      setOnScreenJoystickPosition(
        CONTROLS_CONTEXT_INITIAL_STATE.onScreenJoystickPosition
      );
      setOnScreenJoystickSize(
        CONTROLS_CONTEXT_INITIAL_STATE.onScreenJoystickSize
      );
    }
    if (activatedTabIndex === 1 || all) {
      setMouseSensitivity(CONTROLS_CONTEXT_INITIAL_STATE.mouseSensitivity);
    }
    if (activatedTabIndex === 2 || all) {
      setLeftGamepadOptions({
        invertX: false,
        invertY: false,
        sensitivityX: 50,
        sensitivityY: 50,
      });

      setRightGamepadOptions({
        invertX: false,
        invertY: false,
        sensitivityX: 50,
        sensitivityY: 50,
      });
    }
  }

  function saveSettingsAndClose() {
    save();

    closeSettings();
  }

  useEffect(() => load(), [load]);

  return (
    <div {...rest} className={appendClass('settings', rest.className)}>
      <div className="bg-[#f7f7f7] px-[4vw] pt-[4vh]">
        <div className="header mb-[16px]">
          <h2>Settings</h2>
          <PushButton className="flex items-center rounded-full border border-[#eee] bg-[#eeeeee87] px-[24px] py-[8px] font-inter text-[15px] font-medium text-[#aaaaaa] hover:border-[#ddd] hover:!text-[#646464]">
            Get help with Settings
            <img
              className="ml-[8px] h-[20px] w-[20px]"
              src={require('./images/svgs/get_help.svg').default}
              alt="Help Icon"
            />
          </PushButton>
        </div>
        <TabButtons
          tabs={AVAILABLE_TABS}
          activatedTabIndex={activatedTabIndex}
          setActivatedTabIndex={setActivatedTabIndex}
        />
      </div>
      <div className="relative flex flex-1 flex-col border-t border-[#ddd] bg-white px-[4vw] pb-[4vh]">
        {activatedTabIndex === 0 && <OnScreenJoystickTab />}
        {activatedTabIndex === 1 && <MouseAndTrackpadTab />}
        {activatedTabIndex === 2 && <ExternalJoystickTab />}
        <div className="buttons mt-auto">
          <PushButton
            className="cancel-button"
            onClick={() => {
              load();

              closeSettings();
            }}
          >
            Cancel
          </PushButton>
          <PushButton className="reset-button" onClick={() => resetDefaults()}>
            Reset to Default
          </PushButton>
          <PushButton className="apply-button" onClick={saveSettingsAndClose}>
            Save & Apply Changes
          </PushButton>
        </div>
      </div>
    </div>
  );
};

export default Settings;
