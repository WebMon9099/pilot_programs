import { appendClass } from '../../../../../../lib';

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  position: number;
}

const Slider: React.FC<SliderProps> = ({ position, ...rest }) => {
  return (
    <div {...rest} className={appendClass('react-slider', rest.className)}>
      <div className="moving-rect" style={{ left: `${position}%` }} />
    </div>
  );
};

export default Slider;
