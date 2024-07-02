import { useEffect, useState } from 'react';
import { appendClass } from '../../../lib';
import { DEFAULT_INTERVAL } from './constants';

interface PauseBeaconProps extends React.HTMLAttributes<HTMLImageElement> {
  interval?: number;
}

const PauseBeacon: React.FC<PauseBeaconProps> = ({
  interval = DEFAULT_INTERVAL,
  ...rest
}) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => setHidden(!hidden), interval);

    return () => clearInterval(intervalId);
  }, [interval, hidden]);

  return (
    <img
      {...rest}
      className={appendClass('pause-beacon', rest.className)}
      src={require('./images/svgs/icon_pause.svg').default}
      alt="Pause Icon"
      width={48}
      height={48}
      style={{ display: hidden ? 'none' : 'inherit' }}
    />
  );
};

export default PauseBeacon;
