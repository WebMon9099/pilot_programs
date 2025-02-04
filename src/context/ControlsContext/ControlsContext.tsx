import React, { useCallback, useEffect, useMemo, useState } from "react";
import { animate } from "../../lib";
import { CONTROLS_CONTEXT_INITIAL_STATE } from "./constants";
import {
  Gamepad,
  AddControlEventListenerFunction,
  ArrowKeysListener,
  AxesChangeCallback,
  Axis,
  ControlsContextState,
  EventListener,
  OnScreenJoystickPosition,
  OnScreenJoystickSize,
  RemoveControlEventListenerFunction,
  SpeedChangeCallback,
  WASDKeysListener,
  GamepadOptions,
} from "./types";

export const ControlsContext = React.createContext(
  CONTROLS_CONTEXT_INITIAL_STATE
);

const arrowKeysState = {
  up: false,
  right: false,
  down: false,
  left: false,
};

const wasdKeysState = {
  w: false,
  a: false,
  s: false,
  d: false,
};

const onScreenJoystickAxes = {
  x: 0,
  y: 0,
};

const mouseAxes = {
  x: 0,
  y: 0,
};

var speed = 0;

var eventListeners: EventListener[] = [];

export const ControlsProvider: React.FC<
  React.ProviderProps<ControlsContextState>
> = ({ children }) => {
  const [onScreenJoystickPosition, setOnScreenJoystickPosition] = useState(
    CONTROLS_CONTEXT_INITIAL_STATE.onScreenJoystickPosition
  );
  const [onScreenJoystickSize, setOnScreenJoystickSize] = useState(
    CONTROLS_CONTEXT_INITIAL_STATE.onScreenJoystickSize
  );
  const [mouseSensitivity, setMouseSensitivity] = useState(
    CONTROLS_CONTEXT_INITIAL_STATE.mouseSensitivity
  );

  const [availableGamepads, setAvailableGamepads] = useState<Gamepad[]>(
    CONTROLS_CONTEXT_INITIAL_STATE.availableGamepads
  );
  const [leftActiveGamepad, setLeftActiveGamepad] = useState<
    Gamepad | undefined
  >(CONTROLS_CONTEXT_INITIAL_STATE.leftActiveGamepad);
  const [leftGamepadOptions, setLeftGamepadOptions] = useState<GamepadOptions>({
    invertX: false,
    invertY: false,
    sensitivityX: 50,
    sensitivityY: 50,
  });
  const [rightActiveGamepad, setRightActiveGamepad] = useState<
    Gamepad | undefined
  >(CONTROLS_CONTEXT_INITIAL_STATE.rightActiveGamepad);
  const [rightGamepadOptions, setRightGamepadOptions] =
    useState<GamepadOptions>({
      invertX: false,
      invertY: false,
      sensitivityX: 50,
      sensitivityY: 50,
    });
  const [mouseTrackDiv, setMouseTrackDiv] = useState<HTMLDivElement | null>(
    null
  );

  const addControlEventListener: AddControlEventListenerFunction =
    useMemo(() => {
      var id = 0;

      return (event, handler) => {
        eventListeners.push({ id, event, handler });

        return id++;
      };
    }, []);

  const removeControlEventListener: RemoveControlEventListenerFunction =
    useCallback((...ids: number[]) => {
      ids.forEach((id) => {
        eventListeners = eventListeners.filter(
          (listener) => listener.id !== id
        );
      });
    }, []);

  const updateLeftGamepadOptions = useCallback(
    (options: Partial<GamepadOptions>) => {
      setLeftGamepadOptions((opt) => ({ ...opt, ...options }));
    },
    []
  );

  const updateRightGamepadOptions = useCallback(
    (options: Partial<GamepadOptions>) => {
      setRightGamepadOptions((opt) => ({ ...opt, ...options }));
    },
    []
  );

  const updateOnScreenJoystickAxes = useCallback((axis: Axis) => {
    onScreenJoystickAxes.x = axis.x;
    onScreenJoystickAxes.y = axis.y;
  }, []);

  const updateSpeed = useCallback((newSpeed: number) => {
    speed = newSpeed;
  }, []);

  const save = useCallback(() => {
    localStorage.setItem(
      "on-screen-joystick-position",
      onScreenJoystickPosition.toString()
    );
    localStorage.setItem(
      "on-screen-joystick-size",
      onScreenJoystickSize.toString()
    );
    localStorage.setItem("mouse-sensitivity", mouseSensitivity.toString());

    if (leftActiveGamepad) {
      localStorage.setItem("left-active-gamepad", leftActiveGamepad.id);
      localStorage.setItem(
        "left-active-gamepad-options",
        JSON.stringify({
          invertX: leftGamepadOptions.invertX,
          invertY: leftGamepadOptions.invertY,
          sensitivityX: leftGamepadOptions.sensitivityX,
          sensitivityY: leftGamepadOptions.sensitivityY,
        })
      );
    }

    if (rightActiveGamepad) {
      localStorage.setItem("right-active-gamepad", rightActiveGamepad.id);
      localStorage.setItem(
        "right-active-gamepad-options",
        JSON.stringify({
          invertX: rightGamepadOptions.invertX,
          invertY: rightGamepadOptions.invertY,
          sensitivityX: rightGamepadOptions.sensitivityX,
          sensitivityY: rightGamepadOptions.sensitivityY,
        })
      );
    }
  }, [
    leftActiveGamepad,
    leftGamepadOptions.invertX,
    leftGamepadOptions.invertY,
    leftGamepadOptions.sensitivityX,
    leftGamepadOptions.sensitivityY,
    mouseSensitivity,
    onScreenJoystickPosition,
    onScreenJoystickSize,
    rightActiveGamepad,
    rightGamepadOptions.invertX,
    rightGamepadOptions.invertY,
    rightGamepadOptions.sensitivityX,
    rightGamepadOptions.sensitivityY,
  ]);

  const load = useCallback(() => {
    setOnScreenJoystickPosition(
      (localStorage.getItem(
        "on-screen-joystick-position"
      ) as OnScreenJoystickPosition) ||
        CONTROLS_CONTEXT_INITIAL_STATE.onScreenJoystickPosition
    );
    setOnScreenJoystickSize(
      (localStorage.getItem(
        "on-screen-joystick-size"
      ) as OnScreenJoystickSize) ||
        CONTROLS_CONTEXT_INITIAL_STATE.onScreenJoystickSize
    );
    setMouseSensitivity(
      parseInt(
        localStorage.getItem("mouse-sensitivity") ||
          CONTROLS_CONTEXT_INITIAL_STATE.mouseSensitivity.toString() ||
          CONTROLS_CONTEXT_INITIAL_STATE.mouseSensitivity.toString()
      )
    );

    const savedLeftGamepad = localStorage.getItem("left-active-gamepad");

    // const savedRightGamepad = localStorage.getItem("right-active-gamepad");

    const availableGamepads = getAvailableGamepads();
    if (savedLeftGamepad) {
      const gamepadFound = availableGamepads.find(
        (gamepad) => gamepad.id === savedLeftGamepad
      );
      if (gamepadFound) {
      }
    }

    const savedOptions = localStorage.getItem("left-active-gamepad-options");
    if (savedOptions) {
      const savedOptionsObj = JSON.parse(savedOptions) as GamepadOptions;
      setLeftGamepadOptions(savedOptionsObj);
    }
  }, []);

  useEffect(() => load(), [load]);

  useEffect(() => {
    function gamepadChangeHandler() {
      const newAvailableGamepads = getAvailableGamepads();

      const replaceLeftActiveGamepad =
        !leftActiveGamepad ||
        !newAvailableGamepads.map((g) => g.id).includes(leftActiveGamepad.id);
      if (replaceLeftActiveGamepad) {
        if (newAvailableGamepads.length > 0)
          setLeftActiveGamepad(newAvailableGamepads[0]);
      }

      const replaceRightActiveGamepad =
        !rightActiveGamepad ||
        !newAvailableGamepads.map((g) => g.id).includes(rightActiveGamepad.id);
      if (replaceRightActiveGamepad) {
        if (newAvailableGamepads.length > 1)
          setRightActiveGamepad(newAvailableGamepads[1]);
        else if (newAvailableGamepads.length > 0)
          setRightActiveGamepad(newAvailableGamepads[0]);
      }

      setAvailableGamepads(newAvailableGamepads);
    }

    window.addEventListener("gamepadconnected", gamepadChangeHandler);
    window.addEventListener("gamepaddisconnected", gamepadChangeHandler);

    return () => {
      window.removeEventListener("gamepadconnected", gamepadChangeHandler);
      window.removeEventListener("gamepaddisconnected", gamepadChangeHandler);
    };
  }, [
    setLeftActiveGamepad,
    setRightActiveGamepad,
    leftActiveGamepad,
    rightActiveGamepad,
  ]);

  useEffect(() => {
    return animate(() => {
      eventListeners.forEach((listener) => {
        if (listener.event === "arrow-key-press") {
          const handler = listener.handler as ArrowKeysListener;

          handler({ ...arrowKeysState });
        } else if (
          listener.event === "mouse-axes-change" ||
          listener.event === "on-screen-joystick-axes-change" ||
          listener.event === "left-physical-axes-change" ||
          listener.event === "right-physical-axes-change"
        ) {
          const handler = listener.handler as AxesChangeCallback;

          if (listener.event === "mouse-axes-change") handler(mouseAxes);
          else if (listener.event === "on-screen-joystick-axes-change")
            handler(onScreenJoystickAxes);
          else if (
            listener.event === "left-physical-axes-change" &&
            leftActiveGamepad
          ) {
            const gamepad = [...navigator.getGamepads()][
              leftActiveGamepad.index
            ];

            if (gamepad) {
              handler({
                x: gamepad.axes[0] * (leftGamepadOptions.invertX ? -1 : 1),
                y: gamepad.axes[1] * (leftGamepadOptions.invertY ? -1 : 1),
              });
            }
          } else if (
            listener.event === "right-physical-axes-change" &&
            rightActiveGamepad
          ) {
            const gamepad = [...navigator.getGamepads()][
              rightActiveGamepad.index
            ];

            if (gamepad) {
              handler({
                x: gamepad.axes[0] * (rightGamepadOptions.invertX ? -1 : 1),
                y: gamepad.axes[1] * (rightGamepadOptions.invertY ? -1 : 1),
              });
            }
          }
        } else if (listener.event === "speed-change") {
          const handler = listener.handler as SpeedChangeCallback;

          handler(speed);
        } else if (listener.event === "wasd-key-press") {
          const handler = listener.handler as WASDKeysListener;

          handler({ ...wasdKeysState });
        }
      });
    });
  }, [
    leftActiveGamepad,
    leftGamepadOptions.invertX,
    leftGamepadOptions.invertY,
    onScreenJoystickPosition,
    rightActiveGamepad,
    rightGamepadOptions.invertX,
    rightGamepadOptions.invertY,
  ]);

  useEffect(() => {
    function arrowKeyDownHandler(e: KeyboardEvent) {
      if (e.key === "ArrowUp") arrowKeysState.up = true;
      else if (e.key === "ArrowRight") arrowKeysState.right = true;
      else if (e.key === "ArrowDown") arrowKeysState.down = true;
      else if (e.key === "ArrowLeft") arrowKeysState.left = true;
    }

    function arrowKeyUpHandler(e: KeyboardEvent) {
      if (e.key === "ArrowUp") arrowKeysState.up = false;
      else if (e.key === "ArrowRight") arrowKeysState.right = false;
      else if (e.key === "ArrowDown") arrowKeysState.down = false;
      else if (e.key === "ArrowLeft") arrowKeysState.left = false;
    }

    window.addEventListener("keydown", arrowKeyDownHandler);
    window.addEventListener("keyup", arrowKeyUpHandler);

    return () => {
      window.removeEventListener("keydown", arrowKeyDownHandler);
      window.removeEventListener("keyup", arrowKeyUpHandler);
    };
  }, []);

  useEffect(() => {
    function wasdKeyDownHandler(e: KeyboardEvent) {
      if (e.key === "w" || e.key === "W") wasdKeysState.w = true;
      else if (e.key === "a" || e.key === "A") wasdKeysState.a = true;
      else if (e.key === "s" || e.key === "S") wasdKeysState.s = true;
      else if (e.key === "d" || e.key === "D") wasdKeysState.d = true;
    }

    function wasdKeyUpHandler(e: KeyboardEvent) {
      if (e.key === "w" || e.key === "W") wasdKeysState.w = false;
      else if (e.key === "a" || e.key === "A") wasdKeysState.a = false;
      else if (e.key === "s" || e.key === "S") wasdKeysState.s = false;
      else if (e.key === "d" || e.key === "D") wasdKeysState.d = false;
    }

    window.addEventListener("keydown", wasdKeyDownHandler);
    window.addEventListener("keyup", wasdKeyUpHandler);

    return () => {
      window.removeEventListener("keydown", wasdKeyDownHandler);
      window.removeEventListener("keyup", wasdKeyUpHandler);
    };
  }, []);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!mouseTrackDiv) return;

      const x = e.offsetX - mouseTrackDiv.clientWidth / 2;
      const y = mouseTrackDiv.clientHeight / 2 - e.offsetY;

      mouseAxes.x = x / (mouseTrackDiv.clientWidth / 2);
      mouseAxes.y = y / (mouseTrackDiv.clientHeight / 2);
    }

    if (
      mouseTrackDiv &&
      onScreenJoystickPosition === OnScreenJoystickPosition.Disabled
    ) {
      mouseTrackDiv.addEventListener("mousemove", onMouseMove);
      mouseTrackDiv.style.cursor = "none";

      return () => {
        mouseTrackDiv.removeEventListener("mousemove", onMouseMove);
        mouseTrackDiv.style.cursor = "inherit";
      };
    }
  }, [onScreenJoystickPosition, mouseTrackDiv]);

  return (
    <ControlsContext.Provider
      value={{
        onScreenJoystickPosition,
        onScreenJoystickSize,
        mouseSensitivity,
        availableGamepads,
        leftActiveGamepad,
        rightActiveGamepad,
        leftGamepadOptions,
        rightGamepadOptions,
        setMouseTrackDiv,
        setOnScreenJoystickPosition,
        setOnScreenJoystickSize,
        setMouseSensitivity,
        setLeftActiveGamepad,
        setRightActiveGamepad,
        updateLeftGamepadOptions,
        updateRightGamepadOptions,
        addControlEventListener,
        removeControlEventListener,
        updateLogicalAxes: updateOnScreenJoystickAxes,
        updateSpeed,
        save,
        load,
      }}
    >
      {children}
    </ControlsContext.Provider>
  );

  function getAvailableGamepads() {
    const navigatorGamepads = [...navigator.getGamepads()].filter(
      (gamepad) => gamepad !== null
    );

    const newAvailableGamepadsNames: { [name: string]: number } = {};
    const newAvailableGamepads: Gamepad[] = [];
    for (const gamepad of navigatorGamepads) {
      let name = gamepad!.id.slice(0, gamepad!.id.indexOf("(") - 1);

      newAvailableGamepadsNames[name] =
        (newAvailableGamepadsNames[name] || 0) + 1;

      newAvailableGamepads.push({
        id: gamepad.id,
        name:
          name +
          (newAvailableGamepadsNames[name] === 1
            ? ""
            : " " + newAvailableGamepadsNames[name]),
        index: gamepad.index,
      });
    }

    return newAvailableGamepads;
  }
};
