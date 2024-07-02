import { SetState } from '../../types';
import {
  ActiveGamepadOptions,
  Axis,
  ConnectedGamepad,
  ControlsContextState,
  OnScreenJoystickPosition,
  OnScreenJoystickSize,
} from './types';

export const CONTROLS_CONTEXT_INITIAL_STATE: ControlsContextState = {
  onScreenJoystickPosition: OnScreenJoystickPosition.Right,
  onScreenJoystickSize: OnScreenJoystickSize.M,
  mouseSensitivity: 50,
  availableGamepads: [],
  leftActiveGamepad: undefined,
  rightActiveGamepad: undefined,
  setOnScreenJoystickPosition: function (
    position: OnScreenJoystickPosition
  ): void {
    throw new Error('Function not implemented.');
  } as SetState<OnScreenJoystickPosition>,
  setOnScreenJoystickSize: function (position: OnScreenJoystickSize): void {
    throw new Error('Function not implemented.');
  } as SetState<OnScreenJoystickSize>,
  setMouseSensitivity: function (sensitivity: number): void {
    throw new Error('Function not implemented.');
  } as SetState<number>,
  setMouseTrackDiv: function (div: HTMLDivElement | null) {
    throw new Error('Function not implemented.');
  } as SetState<HTMLDivElement | null>,
  addControlEventListener: function (e, handler) {
    throw new Error('Function not implemented.');
  },
  removeControlEventListener: function (ids) {
    throw new Error('Function not implemented.');
  },
  updateLogicalAxes: function (axis: Axis): void {
    throw new Error('Function not implemented.');
  },
  updateSpeed: function (speed: number): void {
    throw new Error('Function not implemented.');
  },
  save: function (): void {
    throw new Error('Function not implemented.');
  },
  load: function (): void {
    throw new Error('Function not implemented.');
  },
  setLeftActiveGamepad: function (gamepad?: ConnectedGamepad): void {
    throw new Error('Function not implemented.');
  },
  setRightActiveGamepad: function (gamepad?: ConnectedGamepad): void {
    throw new Error('Function not implemented.');
  },
  setLeftGamepadOptions: function (
    options: Partial<ActiveGamepadOptions>
  ): void {
    throw new Error('Function not implemented.');
  },
  setRightGamepadOptions: function (
    options: Partial<ActiveGamepadOptions>
  ): void {
    throw new Error('Function not implemented.');
  },
};
