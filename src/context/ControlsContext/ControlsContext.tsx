import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { animate } from '../../lib';
import { CONTROLS_CONTEXT_INITIAL_STATE } from './constants';
import {
  ActiveGamepad,
  ActiveGamepadOptions,
  AddControlEventListenerFunction,
  ArrowKeysListener,
  AxesChangeCallback,
  Axis,
  ConnectedGamepad,
  ControlsContextState,
  EventListener,
  OnScreenJoystickPosition,
  OnScreenJoystickSize,
  RemoveControlEventListenerFunction,
  SpeedChangeCallback,
  WASDKeysListener,
} from './types';

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

  const [availableGamepads, setAvailableGamepads] = useState<
    ConnectedGamepad[]
  >(CONTROLS_CONTEXT_INITIAL_STATE.availableGamepads);
  const [leftActiveGamepad, _setLeftActiveGamepad] = useState<
    ActiveGamepad | undefined
  >(CONTROLS_CONTEXT_INITIAL_STATE.leftActiveGamepad);
  const [rightActiveGamepad, _setRightActiveGamepad] = useState<
    ActiveGamepad | undefined
  >(CONTROLS_CONTEXT_INITIAL_STATE.rightActiveGamepad);
  const [mouseTrackDiv, setMouseTrackDiv] = useState<HTMLDivElement | null>(
    null
  );

  const setLeftActiveGamepad = useCallback(
    (selectedGamepad?: ConnectedGamepad) => {
      if (!selectedGamepad) _setLeftActiveGamepad(undefined);
      else
        _setLeftActiveGamepad((gamepad) => ({
          gamepad: selectedGamepad,
          invertX: gamepad?.invertX || false,
          invertY: gamepad?.invertY || false,
          sensitivityX: gamepad?.sensitivityX || 50,
          sensitivityY: gamepad?.sensitivityY || 50,
        }));
    },
    []
  );

  const setLeftGamepadOptions = useCallback(
    (options: Partial<ActiveGamepadOptions>) => {
      if (!leftActiveGamepad) return;

      _setLeftActiveGamepad({ ...leftActiveGamepad, ...options });
    },
    [leftActiveGamepad]
  );

  const setRightActiveGamepad = useCallback(
    (selectedGamepad?: ConnectedGamepad) => {
      if (!selectedGamepad) _setRightActiveGamepad(undefined);
      else
        _setRightActiveGamepad((gamepad) => ({
          gamepad: selectedGamepad,
          invertX: gamepad?.invertX || false,
          invertY: gamepad?.invertY || false,
          sensitivityX: gamepad?.sensitivityX || 50,
          sensitivityY: gamepad?.sensitivityY || 50,
        }));
    },
    []
  );

  const setRightGamepadOptions = useCallback(
    (options: Partial<ActiveGamepadOptions>) => {
      if (!rightActiveGamepad) return;

      _setRightActiveGamepad({ ...rightActiveGamepad, ...options });
    },
    [rightActiveGamepad]
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

  const updateOnScreenJoystickAxes = useCallback((axis: Axis) => {
    onScreenJoystickAxes.x = axis.x;
    onScreenJoystickAxes.y = axis.y;
  }, []);

  const updateSpeed = useCallback((newSpeed: number) => {
    speed = newSpeed;
  }, []);

  const save = useCallback(() => {
    localStorage.setItem(
      'on-screen-joystick-position',
      onScreenJoystickPosition.toString()
    );
    localStorage.setItem(
      'on-screen-joystick-size',
      onScreenJoystickSize.toString()
    );
    localStorage.setItem('mouse-sensitivity', mouseSensitivity.toString());

    if (leftActiveGamepad)
      localStorage.setItem(
        'left-active-gamepad',
        JSON.stringify(leftActiveGamepad)
      );

    if (rightActiveGamepad)
      localStorage.setItem(
        'right-active-gamepad',
        JSON.stringify(rightActiveGamepad)
      );
  }, [
    mouseSensitivity,
    onScreenJoystickPosition,
    onScreenJoystickSize,
    leftActiveGamepad,
    rightActiveGamepad,
  ]);

  const load = useCallback(() => {
    setOnScreenJoystickPosition(
      (localStorage.getItem(
        'on-screen-joystick-position'
      ) as OnScreenJoystickPosition) ||
        CONTROLS_CONTEXT_INITIAL_STATE.onScreenJoystickPosition
    );
    setOnScreenJoystickSize(
      (localStorage.getItem(
        'on-screen-joystick-size'
      ) as OnScreenJoystickSize) ||
        CONTROLS_CONTEXT_INITIAL_STATE.onScreenJoystickSize
    );
    setMouseSensitivity(
      parseInt(
        localStorage.getItem('mouse-sensitivity') ||
          CONTROLS_CONTEXT_INITIAL_STATE.mouseSensitivity.toString() ||
          CONTROLS_CONTEXT_INITIAL_STATE.mouseSensitivity.toString()
      )
    );

    const savedLeftActiveGamepad = localStorage.getItem('left-active-gamepad');
    if (savedLeftActiveGamepad && savedLeftActiveGamepad !== 'undefined')
      _setLeftActiveGamepad(JSON.parse(savedLeftActiveGamepad));

    const savedRightActiveGamepad = localStorage.getItem(
      'right-active-gamepad'
    );
    if (savedRightActiveGamepad && savedRightActiveGamepad !== 'undefined')
      _setRightActiveGamepad(JSON.parse(savedRightActiveGamepad));
  }, []);

  useEffect(() => load(), [load]);

  useEffect(() => {
    function gamepadChangeHandler() {
      const gamepads = [...navigator.getGamepads()]
        .filter((gamepad) => gamepad !== null)
        .map((gamepad) => ({
          name: gamepad!.id.slice(0, gamepad!.id.indexOf('(') - 1),
          index: gamepad!.index,
        }));

      setAvailableGamepads(gamepads);

      if (!leftActiveGamepad && gamepads.length >= 1)
        setLeftActiveGamepad(gamepads[0]);

      if (!rightActiveGamepad && gamepads.length >= 2)
        setRightActiveGamepad(gamepads[1]);
    }

    window.addEventListener('gamepadconnected', gamepadChangeHandler);
    window.addEventListener('gamepaddisconnected', gamepadChangeHandler);

    return () => {
      window.removeEventListener('gamepadconnected', gamepadChangeHandler);
      window.removeEventListener('gamepaddisconnected', gamepadChangeHandler);
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
        if (listener.event === 'arrow-key-press') {
          const handler = listener.handler as ArrowKeysListener;

          handler({ ...arrowKeysState });
        } else if (
          listener.event === 'mouse-axes-change' ||
          listener.event === 'on-screen-joystick-axes-change' ||
          listener.event === 'left-physical-axes-change' ||
          listener.event === 'right-physical-axes-change'
        ) {
          const handler = listener.handler as AxesChangeCallback;

          if (listener.event === 'mouse-axes-change') handler(mouseAxes);
          else if (listener.event === 'on-screen-joystick-axes-change')
            handler(onScreenJoystickAxes);
          else if (
            listener.event === 'left-physical-axes-change' &&
            leftActiveGamepad
          ) {
            const gamepad = [...navigator.getGamepads()][
              leftActiveGamepad.gamepad.index
            ];

            if (gamepad) {
              handler({
                x: gamepad.axes[0] * (leftActiveGamepad.invertX ? -1 : 1),
                y: gamepad.axes[1] * (leftActiveGamepad.invertY ? -1 : 1),
              });
            }
          } else if (
            listener.event === 'right-physical-axes-change' &&
            rightActiveGamepad
          ) {
            const gamepad = [...navigator.getGamepads()][
              rightActiveGamepad.gamepad.index
            ];

            if (gamepad) {
              handler({
                x: gamepad.axes[0] * (rightActiveGamepad.invertX ? -1 : 1),
                y: gamepad.axes[1] * (rightActiveGamepad.invertY ? -1 : 1),
              });
            }
          }
        } else if (listener.event === 'speed-change') {
          const handler = listener.handler as SpeedChangeCallback;

          handler(speed);
        } else if (listener.event === 'wasd-key-press') {
          const handler = listener.handler as WASDKeysListener;

          handler({ ...wasdKeysState });
        }
      });
    });
  }, [leftActiveGamepad, rightActiveGamepad, onScreenJoystickPosition]);

  useEffect(() => {
    function arrowKeyDownHandler(e: KeyboardEvent) {
      if (e.key === 'ArrowUp') arrowKeysState.up = true;
      else if (e.key === 'ArrowRight') arrowKeysState.right = true;
      else if (e.key === 'ArrowDown') arrowKeysState.down = true;
      else if (e.key === 'ArrowLeft') arrowKeysState.left = true;
    }

    function arrowKeyUpHandler(e: KeyboardEvent) {
      if (e.key === 'ArrowUp') arrowKeysState.up = false;
      else if (e.key === 'ArrowRight') arrowKeysState.right = false;
      else if (e.key === 'ArrowDown') arrowKeysState.down = false;
      else if (e.key === 'ArrowLeft') arrowKeysState.left = false;
    }

    window.addEventListener('keydown', arrowKeyDownHandler);
    window.addEventListener('keyup', arrowKeyUpHandler);

    return () => {
      window.removeEventListener('keydown', arrowKeyDownHandler);
      window.removeEventListener('keyup', arrowKeyUpHandler);
    };
  }, []);

  useEffect(() => {
    function wasdKeyDownHandler(e: KeyboardEvent) {
      if (e.key === 'w' || e.key === 'W') wasdKeysState.w = true;
      else if (e.key === 'a' || e.key === 'A') wasdKeysState.a = true;
      else if (e.key === 's' || e.key === 'S') wasdKeysState.s = true;
      else if (e.key === 'd' || e.key === 'D') wasdKeysState.d = true;
    }

    function wasdKeyUpHandler(e: KeyboardEvent) {
      if (e.key === 'w' || e.key === 'W') wasdKeysState.w = false;
      else if (e.key === 'a' || e.key === 'A') wasdKeysState.a = false;
      else if (e.key === 's' || e.key === 'S') wasdKeysState.s = false;
      else if (e.key === 'd' || e.key === 'D') wasdKeysState.d = false;
    }

    window.addEventListener('keydown', wasdKeyDownHandler);
    window.addEventListener('keyup', wasdKeyUpHandler);

    return () => {
      window.removeEventListener('keydown', wasdKeyDownHandler);
      window.removeEventListener('keyup', wasdKeyUpHandler);
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
      mouseTrackDiv.addEventListener('mousemove', onMouseMove);
      mouseTrackDiv.style.cursor = 'none';

      return () => {
        mouseTrackDiv.removeEventListener('mousemove', onMouseMove);
        mouseTrackDiv.style.cursor = 'inherit';
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
        setMouseTrackDiv,
        setOnScreenJoystickPosition,
        setOnScreenJoystickSize,
        setMouseSensitivity,
        setLeftActiveGamepad,
        setLeftGamepadOptions,
        setRightActiveGamepad,
        setRightGamepadOptions,
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
};
