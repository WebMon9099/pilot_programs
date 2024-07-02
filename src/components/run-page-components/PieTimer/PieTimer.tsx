import { useCallback, useEffect } from 'react';
import { TARGET_FRAME_RATE } from '../../../constants';
import { useIntervalState } from '../../../hooks';
import useOverrideTime from '../../../hooks/useOverrideTime';
import { appendClass } from '../../../lib';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from './constants';

interface PieTimerProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number;
  paused: boolean;
  width?: number;
  stage: {
    name: string;
    time: number;
  };
}

const PieTimer: React.FC<PieTimerProps> = ({
  height = DEFAULT_HEIGHT,
  paused,
  width = DEFAULT_WIDTH,
  stage,
  ...rest
}) => {
  const [progress, setProgress] = useIntervalState(
    0,
    useCallback((progress) => {
      return progress + 1000 / TARGET_FRAME_RATE;
    }, []),
    useCallback(() => 1000 / TARGET_FRAME_RATE, []),
    paused,
    'PieTimer'
  );

  const overrideTime = useOverrideTime();

  const finalTime = overrideTime !== undefined ? overrideTime : stage.time;

  useEffect(() => {
    setProgress(0);
  }, [stage.name, finalTime, setProgress]);

  return (
    <div {...rest} className={appendClass('pie-timer', rest.className)}>
      <svg width={width} height={height} viewBox="0 0 20 20">
        <circle
          r="10"
          cx="10"
          cy="10"
          fill="#727272"
          shapeRendering="geometricPrecision"
        />
        <circle
          r="5"
          cx="10"
          cy="10"
          fill="transparent"
          stroke="#d3d3d3"
          strokeWidth="10"
          strokeDasharray={`${(1 - progress / finalTime) * 31.4} 31.4`}
          transform="rotate(-90) translate(-20)"
          shapeRendering="geometricPrecision"
        />
      </svg>
    </div>
  );
};

export default PieTimer;
