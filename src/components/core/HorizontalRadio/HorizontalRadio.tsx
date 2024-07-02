import { useEffect, useRef, useState } from "react";
import { appendClass } from "../../../lib";
import PushButton from "../PushButton";
import RadioSlider from "../RadioSlider";

interface HorizontalRadioProps extends React.HTMLAttributes<HTMLDivElement> {
  options: string[];
  chosen?: string;
  onChoiceChange?: (choice: string) => void;
}

const HorizontalRadio: React.FC<HorizontalRadioProps> = ({
  options,
  chosen,
  onChoiceChange,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [activatedOptionIndex, setActivatedOptionIndex] = useState(
    options.indexOf(chosen || options[0])
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const buttons = containerRef.current.querySelectorAll("button");

    buttons.forEach((button) => {
      const width = button.clientWidth;

      button.style.width = `calc(${width}px + 4rem)`;
    });
  }, []);

  useEffect(() => {
    if (chosen) setActivatedOptionIndex(options.indexOf(chosen));
  }, [options, chosen, activatedOptionIndex]);

  return (
    <div
      {...rest}
      className={appendClass("horizontal-radio", rest.className)}
      ref={containerRef}
    >
      {options.map((option, index) => (
        <PushButton
          key={index}
          className={`${activatedOptionIndex === index && "activated"}`}
          onClick={() => {
            setActivatedOptionIndex(index);

            if (onChoiceChange) onChoiceChange(option);
          }}
        >
          {option}
        </PushButton>
      ))}
      <RadioSlider
        activatedElementIndex={activatedOptionIndex}
        getElements={() => containerRef.current?.querySelectorAll("button")}
      />
    </div>
  );
};

export default HorizontalRadio;
