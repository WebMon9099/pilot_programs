import _ from 'lodash';
import { useRef } from 'react';
import { appendClass } from '../../../../../lib';
import { SetState } from '../../../../../types';

interface CompleteBoxProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  availableNumbers: number[];
  disabled: boolean;
  setAvailableNumbers: SetState<number[]>;
  onNumberDrop: (value: string) => void;
  value: string;
}

const CompleteBox: React.FC<CompleteBoxProps> = ({
  availableNumbers,
  disabled,
  value,
  setAvailableNumbers,
  onNumberDrop,
  ...rest
}) => {
  const id = useRef(_.uniqueId()).current;

  return (
    <div
      {...rest}
      className={appendClass('complete-box', rest.className)}
      id={rest.id || id}
      draggable={rest.draggable || true}
      onDragStart={(e) => {
        if (disabled) return;

        rest.onDragStart?.(e);

        const element = e.target as HTMLElement;

        e.dataTransfer.setData('number', element.innerHTML);
        e.dataTransfer.setData('type', 'droppedNumber');
        e.dataTransfer.setData('targetId', element.id);
      }}
      onDragOver={(e) => {
        if (disabled) return;

        rest.onDragOver?.(e);

        e.preventDefault();

        const element = e.target as HTMLElement;

        element.style.filter = 'brightness(0.9)';
        element.style.transform = 'scale(1.2)';
      }}
      onDragLeave={(e) => {
        if (disabled) return;

        rest.onDragLeave?.(e);

        e.preventDefault();

        const element = e.target as HTMLElement;

        element.style.filter = 'unset';
        element.style.transform = 'unset';
      }}
      onDrop={(e) => {
        if (disabled) return;

        rest.onDrop?.(e);

        e.preventDefault();

        const element = e.target as HTMLElement;

        const droppedNumber = Number(e.dataTransfer.getData('number'));

        const newAvailableNumbers = availableNumbers.filter(
          (number) => number !== droppedNumber
        );
        const possibleReturnedNumber = Number(element.innerHTML);

        if (
          possibleReturnedNumber !== 0 &&
          possibleReturnedNumber !== droppedNumber
        )
          newAvailableNumbers.push(possibleReturnedNumber);

        setAvailableNumbers(newAvailableNumbers.sort((a, b) => a - b));

        if (droppedNumber !== 0) {
          // element.innerHTML = `${droppedNumber}`;
          onNumberDrop(`${droppedNumber}`);
        }

        element.style.filter = 'unset';
        element.style.transform = 'unset';
      }}
    >
      {value}
    </div>
  );
};

export default CompleteBox;
