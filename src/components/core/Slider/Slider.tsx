import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { appendClass } from '../../../lib';
import Holdable from '../Holdable';

interface SliderProps extends React.HTMLAttributes<HTMLButtonElement> {
  initialValue?: number;
  overrideValue?: number;
  onValueChange?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  initialValue = 0,
  overrideValue,
  onValueChange,
  ...rest
}) => {
  const sliderBackgroundRef = useRef<HTMLDivElement>(null);
  const sliderBackgroundPosition = useRef({ left: -1, right: 1 });

  const [hold, setHold] = useState(false);
  const [value, setValue] = useState(initialValue);

  function updateSlider(xPosition: number) {
    const newValue =
      ((xPosition - sliderBackgroundPosition.current.left) /
        (sliderBackgroundPosition.current.right -
          sliderBackgroundPosition.current.left)) *
      100;

    if (newValue > 0 && newValue < 100) {
      setValue(_.round(newValue));

      if (onValueChange) onValueChange(_.round(newValue));
    }
  }

  useEffect(() => {
    if (!sliderBackgroundRef.current) return;

    sliderBackgroundPosition.current.left =
      sliderBackgroundRef.current.getBoundingClientRect().left;
    sliderBackgroundPosition.current.right =
      sliderBackgroundRef.current.getBoundingClientRect().right;
  }, []);

  useEffect(() => {
    if (overrideValue) setValue(overrideValue);
  }, [overrideValue]);

  return (
    <Holdable
      {...rest}
      className={appendClass('slider', rest.className)}
      onHold={() => setHold(true)}
      onHoldRelease={() => setHold(false)}
      onMouseMove={(e) => {
        rest.onMouseMove?.(e);

        if (!hold) return;

        updateSlider(e.clientX);
      }}
      onTouchMove={(e) => {
        rest.onTouchMove?.(e);

        if (!hold) return;

        updateSlider(e.touches[0].clientX);
      }}
      onMouseDown={(e) => {
        rest.onMouseDown?.(e);

        updateSlider(e.clientX);
      }}
      sticky
    >
      <div className="background-container">
        <span>0</span>
        <div className="background" ref={sliderBackgroundRef}>
          <div
            className="moving"
            style={{
              marginLeft: `${value}%`,
            }}
          />
        </div>
        <span>100</span>
      </div>
    </Holdable>
  );
};

export default Slider;
