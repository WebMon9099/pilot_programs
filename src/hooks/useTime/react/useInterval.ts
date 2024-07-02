import { useEffect, useRef } from 'react';
import { Callback } from '../../../types';
import Clock, { TimeNodeControl } from '../core';

function useInterval(
  callback: Callback,
  interval: number,
  paused: boolean,
  name?: string
) {
  const event = useRef<TimeNodeControl>();

  useEffect(() => {
    event.current = Clock.setInterval(callback, interval, name);

    return event.current.cancel;
  }, [callback, interval, name]);

  useEffect(() => {
    if (event.current) {
      if (paused) event.current.pause();
      else event.current.resume();
    }
  }, [paused]);
}

export default useInterval;
