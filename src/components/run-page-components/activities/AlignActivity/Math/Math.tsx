import { appendClass } from '../../../../../lib';
import { PushButton } from '../../../../core';
import { MathOp } from '../types';

interface MathProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled: boolean;
  numbers: number[];
  op: MathOp;
  setMathSame: (mathSame: boolean) => void;
}

const Math: React.FC<MathProps> = ({
  disabled,
  numbers,
  op,
  setMathSame,
  ...rest
}) => {
  return (
    <div {...rest} className={appendClass('math', rest.className)}>
      <h1 className="font-inter">
        {numbers.slice(0, numbers.length - 1).map((number, index) => (
          <span key={index}>
            {index === 0 && op === '-' && '- '}
            {number}
            {index < numbers.length - 2 ? ` ${op} ` : ''}
          </span>
        ))}
        <span> = {numbers[numbers.length - 1]}</span>
      </h1>
      <div className="buttons-container">
        <PushButton
          className="font-inter transition hover:scale-105 active:scale-95 active:brightness-95"
          disabled={disabled}
          onClick={() => setMathSame(true)}
        >
          Correct
        </PushButton>
        <PushButton
          className="font-inter transition hover:scale-105 active:scale-95 active:brightness-95"
          disabled={disabled}
          onClick={() => setMathSame(false)}
        >
          Incorrect
        </PushButton>
      </div>
    </div>
  );
};

export default Math;
