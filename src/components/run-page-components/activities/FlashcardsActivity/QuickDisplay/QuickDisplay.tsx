import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useIntervalState } from '../../../../../hooks';
import { appendClass } from '../../../../../lib';

interface QuickDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  images: string[];
  paused: boolean;
  time: number;
}

const QuickDisplay: React.FC<QuickDisplayProps> = ({
  images,
  paused,
  time,
  ...rest
}) => {
  const [ready, setReady] = useState(false);

  const [imageState] = useIntervalState(
    {
      index: 0,
      location: {
        top: _.random(20, 80),
        left: _.random(20, 80),
      },
    },
    useCallback(
      (imageState) => ({
        index: imageState.index + 1,
        location: {
          top: _.random(20, 80),
          left: _.random(20, 80),
        },
      }),
      []
    ),
    useCallback(() => time / images.length, [time, images.length]),
    paused
  );

  useEffect(() => setReady(false), [imageState]);

  return (
    <div
      {...rest}
      className={appendClass('quick-display display', rest.className)}
    >
      <div
        className="card"
        style={{
          top: `${imageState.location.top}%`,
          left: `${imageState.location.left}%`,
          display: ready ? 'flex' : 'none',
        }}
      >
        <img
          src={images[imageState.index]}
          alt=""
          onLoad={() => setReady(true)}
        />
      </div>
    </div>
  );
};

export default QuickDisplay;
