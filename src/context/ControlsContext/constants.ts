import { SetState } from "../../types";
import {
  Axis,
  Gamepad,
  ControlsContextState,
  OnScreenJoystickPosition,
  OnScreenJoystickSize,
  GamepadOptions,
} from "./types";

export const CONTROLS_CONTEXT_INITIAL_STATE: ControlsContextState = {
  onScreenJoystickPosition: OnScreenJoystickPosition.Right,
  onScreenJoystickSize: OnScreenJoystickSize.M,
  mouseSensitivity: 50,
  availableGamepads: [],
  leftActiveGamepad: undefined,
  rightActiveGamepad: undefined,
  leftGamepadOptions: {
    invertX: false,
    invertY: false,
    sensitivityX: 50,
    sensitivityY: 50,
  },
  rightGamepadOptions: {
    invertX: false,
    invertY: false,
    sensitivityX: 50,
    sensitivityY: 50,
  },
  setOnScreenJoystickPosition: function (
    position: OnScreenJoystickPosition
  ): void {
    throw new Error("Function not implemented.");
  } as SetState<OnScreenJoystickPosition>,
  setOnScreenJoystickSize: function (position: OnScreenJoystickSize): void {
    throw new Error("Function not implemented.");
  } as SetState<OnScreenJoystickSize>,
  setMouseSensitivity: function (sensitivity: number): void {
    throw new Error("Function not implemented.");
  } as SetState<number>,
  setMouseTrackDiv: function (div: HTMLDivElement | null) {
    throw new Error("Function not implemented.");
  } as SetState<HTMLDivElement | null>,
  addControlEventListener: function (e, handler) {
    throw new Error("Function not implemented.");
  },
  removeControlEventListener: function (ids) {
    throw new Error("Function not implemented.");
  },
  updateLogicalAxes: function (axis: Axis): void {
    throw new Error("Function not implemented.");
  },
  updateSpeed: function (speed: number): void {
    throw new Error("Function not implemented.");
  },
  save: function (): void {
    throw new Error("Function not implemented.");
  },
  load: function (): void {
    throw new Error("Function not implemented.");
  },
  setLeftActiveGamepad: function (gamepad?: Gamepad): void {
    throw new Error("Function not implemented.");
  },
  setRightActiveGamepad: function (gamepad?: Gamepad): void {
    throw new Error("Function not implemented.");
  },

  updateLeftGamepadOptions: function (options: Partial<GamepadOptions>): void {
    throw new Error("Function not implemented.");
  },
  updateRightGamepadOptions: function (options: Partial<GamepadOptions>): void {
    throw new Error("Function not implemented.");
  },
};
