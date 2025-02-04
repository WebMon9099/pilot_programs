import { Callback, SetState } from "../../types";

export enum ArrowKey {
  Up,
  Right,
  Down,
  Left,
}

export enum WASDKey {
  W,
  A,
  S,
  D,
}

export enum OnScreenJoystickPosition {
  Left = "Left",
  Right = "Right",
  Disabled = "Disabled",
}

export enum OnScreenJoystickSize {
  S = "S",
  M = "M",
  L = "L",
}

export type Axis = { x: number; y: number };
export type AxesChangeCallback = (axes: Axis) => void;
export type ArrowKeysListener = (keys: {
  up: boolean;
  right: boolean;
  down: boolean;
  left: boolean;
}) => void;
export type WASDKeysListener = (keys: {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
}) => void;
export type SpeedChangeCallback = (newSpeed: number) => void;

export interface EventHandlersMap {
  "left-physical-axes-change": AxesChangeCallback;
  "right-physical-axes-change": AxesChangeCallback;
  "on-screen-joystick-axes-change": AxesChangeCallback;
  "mouse-axes-change": AxesChangeCallback;
  "arrow-key-press": ArrowKeysListener;
  "wasd-key-press": WASDKeysListener;
  "speed-change": SpeedChangeCallback;
}

export type AddControlEventListenerFunction = <
  E extends keyof EventHandlersMap,
>(
  event: E,
  handler: EventHandlersMap[E]
) => number;

export type RemoveControlEventListenerFunction = (...ids: number[]) => void;

export interface EventListener {
  id: number;
  event: keyof EventHandlersMap;
  handler: EventHandlersMap[keyof EventHandlersMap];
}

export interface GamepadOptions {
  invertX: boolean;
  invertY: boolean;
  sensitivityX: number;
  sensitivityY: number;
}

export interface Gamepad {
  id: string;
  name: string;
  index: number;
}

export interface ControlsContextState {
  onScreenJoystickPosition: OnScreenJoystickPosition;
  onScreenJoystickSize: OnScreenJoystickSize;
  mouseSensitivity: number;
  availableGamepads: Gamepad[];
  leftActiveGamepad: Gamepad | undefined;
  rightActiveGamepad: Gamepad | undefined;
  leftGamepadOptions: GamepadOptions;
  rightGamepadOptions: GamepadOptions;
  setLeftActiveGamepad: (gamepad?: Gamepad) => void;
  setRightActiveGamepad: (gamepad?: Gamepad) => void;
  updateLeftGamepadOptions: (options: Partial<GamepadOptions>) => void;
  updateRightGamepadOptions: (options: Partial<GamepadOptions>) => void;
  setOnScreenJoystickPosition: SetState<OnScreenJoystickPosition>;
  setOnScreenJoystickSize: SetState<OnScreenJoystickSize>;
  setMouseSensitivity: SetState<number>;
  setMouseTrackDiv: SetState<HTMLDivElement | null>;
  addControlEventListener: AddControlEventListenerFunction;
  removeControlEventListener: RemoveControlEventListenerFunction;
  updateLogicalAxes: (axis: Axis) => void;
  updateSpeed: (newSpeed: number) => void;
  save: Callback;
  load: Callback;
}
