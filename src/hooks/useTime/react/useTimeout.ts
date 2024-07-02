import { useEffect, useRef } from 'react';
import { Callback } from '../../../types';
import Clock, { TimeNodeControl } from '../core';

function useTimeout(
  callback: Callback,
  time: number,
  paused: boolean,
  activated: boolean
) {
  const event = useRef<TimeNodeControl>();

  useEffect(() => {
    if (activated) {
      event.current = Clock.setTimeout(callback, time);

      return event.current.cancel;
    }
  }, [activated, callback, time]);

  useEffect(() => {
    if (event.current) {
      if (paused) event.current.pause();
      else event.current.resume();
    }
  }, [paused]);
}

export default useTimeout;
