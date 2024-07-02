import { appendClass } from '../../../../../lib';
import { SetState } from '../../../../../types';
import { PushButton } from '../../../../core';

interface NumbersContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  availableNumbers: number[];
  disabled: boolean;
  setAvailableNumbers: SetState<number[]>;
  onNumberDrop: (value: string) => void;
  onNumberClick: (value: string) => void;
}

const NumbersContainer: React.FC<NumbersContainerProps> = ({
  availableNumbers,
  disabled,
  setAvailableNumbers,
  onNumberDrop,
  onNumberClick,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={appendClass('numbers-container', rest.className)}
      onDrop={(e) => {
        if (disabled) return;

        rest.onDrop?.(e);

        e.preventDefault();

        const type = e.dataTransfer.getData('type');

        if (type === 'droppedNumber') {
          const droppedNumber = Number(e.dataTransfer.getData('number'));
          const droppedElement = document.getElementById(
            e.dataTransfer.getData('targetId')
          ) as HTMLElement;

          if (droppedNumber !== 0)
            setAvailableNumbers(
              [...availableNumbers, droppedNumber].sort((a, b) => a - b)
            );

          droppedElement.innerHTML = '';

          onNumberDrop(e.dataTransfer.getData('number'));

          const element = e.target as HTMLElement;

          element.style.backgroundColor = 'unset';
        }
      }}
      onDragOver={(e) => {
        if (disabled) return;

        rest.onDragOver?.(e);

        e.preventDefault();

        const element = e.target as HTMLElement;

        element.style.backgroundColor = '#DDDDDD';
      }}
      onDragLeave={(e) => {
        if (disabled) return;

        rest.onDragLeave?.(e);

        e.preventDefault();

        const element = e.target as HTMLElement;

        element.style.backgroundColor = 'unset';
      }}
    >
      {availableNumbers.map((number, index) => (
        <PushButton
          className="font-inter"
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.setData('number', `${number}`);
            e.dataTransfer.setData('type', 'availableNumber');
          }}
          onDrop={(e) => e.stopPropagation()}
          onDragOver={(e) => e.stopPropagation()}
          onDragLeave={(e) => e.stopPropagation()}
          onClick={() => onNumberClick(`${number}`)}
          key={index}
        >
          {number}
        </PushButton>
      ))}
    </div>
  );
};

export default NumbersContainer;
