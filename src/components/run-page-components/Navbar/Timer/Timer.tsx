import { useCallback, useEffect } from 'react';
import { useIntervalState } from '../../../../hooks';
import Utils from './utils';

interface TimerProps extends React.HTMLAttributes<HTMLSpanElement> {
  mobile: boolean;
  overrideStart: number;
  paused: boolean;
  resetList: boolean[];
  showRemaining: boolean;
  totalTime: number;
}

const Timer: React.FC<TimerProps> = ({
  mobile,
  overrideStart,
  paused,
  resetList,
  showRemaining,
  totalTime,
  ...rest
}) => {
  const [elapsedTime, setElapsedTime] = useIntervalState(
    0,
    useCallback((elapsedTime) => elapsedTime + 1000, []),
    useCallback(() => 1000, []),
    paused,
    'Timer'
  );

  useEffect(() => {
    setElapsedTime(0);
  }, [resetList, setElapsedTime]);

  return (
    <span {...rest} className="">
      {/* {showRemaining ? 'Remaining' : 'Elapsed'}:{' '} */}
      <span className="opacity-40">{`${
        mobile
          ? showRemaining
            ? 'R'
            : 'E'
          : showRemaining
          ? 'Remaining'
          : 'Elapsed'
      }: `}</span>
      <span>
        {Utils.secondsToTimeString(
          (showRemaining ? totalTime - elapsedTime : elapsedTime) / 1000
        )}
      </span>
    </span>
  );
};

export default Timer;
