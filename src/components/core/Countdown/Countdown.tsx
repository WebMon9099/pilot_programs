import { appendClass } from '../../../lib';

interface CountdownProps extends React.HTMLAttributes<HTMLDivElement> {
  currentSecond: number;
  label: string;
}

const Countdown: React.FC<CountdownProps> = ({
  currentSecond,
  label,
  ...rest
}) => {
  return (
    <div {...rest} className={appendClass('countdown', rest.className)}>
      <span className="font-inter">{label}</span>
      <p className="font-inter">{currentSecond}</p>
    </div>
  );
};

export default Countdown;
