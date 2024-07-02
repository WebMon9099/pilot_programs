import { useEffect, useRef } from 'react';
import useRefState from '../../useRefState/useRefState';
import Clock, { TimeNodeControl } from '../core';

type StateReducer<S> = (state: S) => S;
type TimeReducer<S> = (state: S) => number;

function useIntervalState<S>(
  initialState: S,
  stateReducer: StateReducer<S>,
  timeReducer: TimeReducer<S>,
  paused: boolean,
  name?: string
): [S, React.Dispatch<React.SetStateAction<S>>, React.MutableRefObject<S>] {
  const event = useRef<TimeNodeControl>();

  const [state, setState, stateRef] = useRefState(initialState);

  useEffect(() => {
    event.current = Clock.setInterval(
      () => setState(stateReducer(state)),
      timeReducer(state),
      name
    );

    return event.current.cancel;
  }, [name, stateReducer, timeReducer, state, setState]);

  useEffect(() => {
    if (event.current) {
      if (paused) event.current.pause();
      else event.current.resume();
    }
  }, [state, paused]);

  return [state, setState, stateRef];
}

export default useIntervalState;
