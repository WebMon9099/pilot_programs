import { useCallback, useEffect, useLayoutEffect } from 'react';
import { useIntervalState } from '../../../hooks';
import { appendClass } from '../../../lib';
import { Callback } from '../../../types';
import { Countdown } from '../../core';

interface SessionCounterProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  onFinish: Callback;
  paused: boolean;
  time: number;
}

const SessionCounter: React.FC<SessionCounterProps> = ({
  label,
  onFinish,
  paused,
  time,
  ...rest
}) => {
  const [sessionCountdownTime] = useIntervalState(
    time * 1000,
    useCallback((sessionCountdownTime) => sessionCountdownTime - 1000, []),
    useCallback(() => 1000, []),
    paused,
    'SessionCounter'
  );

  useLayoutEffect(() => {
    if (time === 0) onFinish();
  }, [onFinish, time]);

  useEffect(() => {
    if (sessionCountdownTime <= 0) onFinish();
  }, [sessionCountdownTime, time, onFinish]);

  return (
    <div {...rest} className={appendClass('session-counter', rest.className)}>
      <Countdown label={label} currentSecond={sessionCountdownTime / 1000} />
    </div>
  );
};

export default SessionCounter;
