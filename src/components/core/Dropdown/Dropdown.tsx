import { useState } from "react";
import { appendClass } from "../../../lib";

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  options: string[];
  emptyLabel: string;
  selected: string;
  onSelection?: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  emptyLabel,
  selected,
  onSelection,
  ...rest
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div {...rest} className={appendClass("dropdown", rest.className)}>
      <button
        className="dropdown-button"
        disabled={options.length === 0}
        onClick={() => setExpanded(!expanded)}
        style={{
          boxShadow: expanded
            ? "0px 5px 5px 0px rgba(0, 0, 0, 0.15)"
            : undefined,
        }}
      >
        <div className="text-container">
          {options.length > 0 ? selected : emptyLabel}
        </div>
        <div className="arrow-container">
          <img
            src={require("./images/svgs/icon_arrow.svg").default}
            alt="Dropdown Button Icon"
            style={{ transform: `rotate(${expanded ? "180" : "0"}deg)` }}
          />
        </div>
      </button>
      {expanded && (
        <ul className="dropdown-menu">
          {options
            .filter((option) => option !== selected)
            .map((option, index) => (
              <button
                key={index}
                className="dropdown-item"
                onClick={() => {
                  setExpanded(false);

                  if (onSelection) onSelection(option);
                }}
              >
                <div className="text-container">{option}</div>
              </button>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
