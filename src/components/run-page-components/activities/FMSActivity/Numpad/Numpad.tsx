import { Delete } from 'react-feather';
import { PushButton } from '../../../../core';

type Number = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

interface NumpadProps extends React.HTMLAttributes<HTMLDivElement> {
  onNumber: (key: Number) => void;
  onDelete: () => void;
  onSubmit: () => void;
}

const Numpad: React.FC<NumpadProps> = ({
  onNumber,
  onDelete,
  onSubmit,
  ...rest
}) => {
  return (
    <div className="numpad font-inter" {...rest}>
      <PushButton onClick={() => onNumber('1')}>1</PushButton>
      <PushButton onClick={() => onNumber('2')}>2</PushButton>
      <PushButton onClick={() => onNumber('3')}>3</PushButton>
      <PushButton onClick={() => onNumber('5')}>5</PushButton>
      <PushButton onClick={() => onNumber('6')}>6</PushButton>
      <PushButton onClick={() => onNumber('4')}>4</PushButton>
      <PushButton onClick={() => onNumber('7')}>7</PushButton>
      <PushButton onClick={() => onNumber('8')}>8</PushButton>
      <PushButton onClick={() => onNumber('9')}>9</PushButton>
      <PushButton className="delete" onClick={onDelete}>
        <Delete color="white" />
      </PushButton>
      <PushButton onClick={() => onNumber('0')}>0</PushButton>
      <PushButton className="ok" onClick={onSubmit}>
        OK
      </PushButton>
    </div>
  );
};

export default Numpad;
