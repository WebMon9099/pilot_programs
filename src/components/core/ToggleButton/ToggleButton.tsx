import { COLORS } from '../../../constants';
import { appendClass } from '../../../lib';

interface ToggleButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  colors?: {
    onColors: {
      background: string;
      toggle: string;
      text: string;
    };
    offColors: {
      background: string;
      toggle: string;
      text: string;
    };
  };
  disabled?: boolean;
  onToggleChange?: (toggled: boolean) => void;
  showText?: boolean;
  toggled: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  colors,
  disabled = false,
  onToggleChange,
  showText,
  toggled,
  ...rest
}) => {
  const backgroundColor = (() => {
    if (disabled) return COLORS.disabled;

    if (toggled) {
      if (colors) return colors.onColors.background;
      return COLORS.green;
    } else {
      if (colors) return colors.offColors.background;
      return COLORS.red;
    }
  })();

  const toggleColor = (() => {
    if (disabled) return COLORS.disabled;

    if (colors) {
      if (toggled) return colors.onColors.toggle;
      return colors.offColors.toggle;
    }
    return COLORS.white;
  })();

  const textColor = (() => {
    if (disabled) return COLORS.disabled;

    if (colors) {
      if (toggled) return colors.onColors.text;
      return colors.offColors.text;
    }

    return toggleColor;
  })();

  return (
    <div
      {...rest}
      className={appendClass(
        `toggle-button ${disabled && 'disabled'}`,
        rest.className
      )}
      style={{ ...rest.style, backgroundColor }}
      onClick={() => onToggleChange?.(!toggled)}
    >
      <div
        className={`toggle ${toggled ? 'on' : 'off'}`}
        style={{ backgroundColor: toggleColor }}
      />
      <label className={toggled ? 'on' : 'off'} style={{ color: textColor }}>
        {showText === false ? '' : toggled ? 'On' : 'Off'}
      </label>
    </div>
  );
};

export default ToggleButton;
