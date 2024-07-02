import { useEffect, useRef, useState } from 'react';
import Clock, { TimeNodeControl } from '../core';

type StateReducer<S> = (state: S) => S;
type TimeReducer<S> = (state: S) => number;

function useTimeoutState<S>(
  initialState: S,
  stateReducer: StateReducer<S>,
  timeReducer: TimeReducer<S>,
  paused: boolean,
  name?: string
): [S, React.Dispatch<React.SetStateAction<S>>] {
  const event = useRef<TimeNodeControl>();

  const [state, setState] = useState(initialState);

  useEffect(() => {
    event.current = Clock.setTimeout(
      () => setState(stateReducer(state)),
      timeReducer(state),
      name
    );

    return event.current.cancel;
  }, [name, stateReducer, timeReducer, state]);

  useEffect(() => {
    if (event.current) {
      if (paused) event.current.pause();
      else event.current.resume();
    }
  }, [state, paused]);

  return [state, setState];
}

export default useTimeoutState;
