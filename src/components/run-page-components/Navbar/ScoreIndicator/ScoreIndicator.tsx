import { useEffect, useRef, useState } from 'react';
import { appendClass } from '../../../../lib';
import { DISPLAY_DURATION } from './constants';

interface ScoreIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  disabled: boolean;
  score: number;
  session: number;
  sessions: number;
}

const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({
  disabled,
  score,
  session,
  sessions,
  ...rest
}) => {
  const lastScore = useRef(score);

  const [show, setShow] = useState(false);
  const [change, setChange] = useState(0);

  useEffect(() => {
    setChange(score - lastScore.current);

    lastScore.current = score;

    const timeout = setTimeout(() => setShow(false), DISPLAY_DURATION);

    return () => clearTimeout(timeout);
  }, [sessions, score]);

  useEffect(() => {
    if (change !== 0) setShow(true);
    else setShow(false);
  }, [change]);

  useEffect(() => {
    if (disabled) setChange(0);
  }, [disabled]);

  if (disabled) return null;

  return (
    <span
      {...rest}
      className={appendClass(
        `score-indicator ${show ? 'display' : 'hidden'}`,
        rest.className
      )}
      style={{ position: change === 0 ? 'absolute' : 'relative' }}
      onTransitionEnd={() => {
        if (!show) setChange(0);
      }}
    >{`+${change}`}</span>
  );
};

export default ScoreIndicator;
