import _ from 'lodash';
import { useEffect, useState } from 'react';
import { appendClass } from '../../../../../lib';
import Slider from './Slider';

interface SlidersProps extends React.HTMLAttributes<HTMLDivElement> {
  paused: boolean;
  speed: number;
}

const Sliders: React.FC<SlidersProps> = ({ paused, speed, ...rest }) => {
  //  The position of each moving slider:
  const [slidersPositions, setSlidersPositions] = useState([0, 0, 0, 0]);

  //  At first render, and each time the activity speed changes:
  useEffect(() => {
    const randomizeSlidersPosition = () => {
      //  Randomize the next sliders positions:
      let newPositions = [];
      for (let i = 0; i < slidersPositions.length; ++i)
        newPositions.push(_.random(100));

      //  Update the sliders positions state:
      setSlidersPositions(newPositions);
    };

    //  If the activity isn't paused:
    if (!paused) {
      //  Set an interval of a second divided by the activity speed, to randomize
      //  - the next positions of the sliders:
      randomizeSlidersPosition();
      const intervalId = setInterval(
        randomizeSlidersPosition,
        SLIDERS_POSITION_CHANGE_BASE_INTERVAL / speed
      );

      return () => clearInterval(intervalId);
    }
  }, [paused, speed, slidersPositions.length]);

  //  Create the sliders jsx elements:
  const sliders = slidersPositions.map((position, index) => {
    return <Slider position={position} key={index} />;
  });

  return (
    <div {...rest} className={appendClass('react-sliders', rest.className)}>
      {sliders}
    </div>
  );
};

export default Sliders;

const SLIDERS_POSITION_CHANGE_BASE_INTERVAL = 500;
