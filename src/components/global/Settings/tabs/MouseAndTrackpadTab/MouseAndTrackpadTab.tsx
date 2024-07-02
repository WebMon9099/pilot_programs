import { useControls } from '../../../../../hooks';
import { appendClass } from '../../../../../lib';
import { NewSlider } from '../../../../core';
import { SENSITIVITY_TEXT } from './constants';

const MouseAndTrackpadTab: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...rest
}) => {
  const { mouseSensitivity, setMouseSensitivity } = useControls();

  return (
    <div {...rest} className={appendClass('tab', rest.className)}>
      <div className="row">
        <div className="top">
          <b className="title">Sensitivity</b>
        </div>
        <div className="bottom">
          <div className="left">
            <p className="description">{SENSITIVITY_TEXT}</p>
          </div>
          <div className="right">
            <NewSlider
              className="mt-[12px] h-[12px] flex-1 pt-0"
              min={0}
              max={100}
              value={mouseSensitivity}
              onValueChange={setMouseSensitivity}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MouseAndTrackpadTab;
