import { appendClass } from '../../../../lib';
import { Callback } from '../../../../types';
import { PushButton } from '../../../core';

interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  actionsDisabled: boolean;
  activityDecreaseSpeed: Callback;
  activityIncreaseSpeed: Callback;
  activityPause: Callback;
  clockModeToggle: Callback;
  trainingMode: boolean;
  hasSettings: boolean;
  showSettings: Callback;
  speedDisabled: boolean;
}

const Menu: React.FC<MenuProps> = ({
  actionsDisabled,
  activityDecreaseSpeed,
  activityIncreaseSpeed,
  activityPause,
  clockModeToggle,
  trainingMode,
  hasSettings,
  showSettings,
  speedDisabled,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={appendClass('menu', rest.className)}
      onClick={(e) => {
        rest.onClick?.(e);

        e.stopPropagation();
      }}
    >
      <PushButton
        className="action major"
        onClick={activityPause}
        disabled={actionsDisabled || !trainingMode}
      >
        <span>Play/Pause</span>
      </PushButton>
      <PushButton
        onClick={showSettings}
        className="action major"
        disabled={!hasSettings}
      >
        <span>Settings</span>
      </PushButton>
      <PushButton
        className="action major"
        onClick={clockModeToggle}
        disabled={actionsDisabled || trainingMode}
      >
        <span>Switch to Elapsed/Remaining</span>
      </PushButton>
      <div>
        <button className="major">
          <span>Go to:</span>
        </button>
        <PushButton className="action minor" disabled>
          <span>Performance</span>
        </PushButton>
        <PushButton className="action minor" disabled>
          <span>User Guide</span>
        </PushButton>
      </div>
      <div>
        <button className="major" disabled={actionsDisabled || !trainingMode}>
          <span>Speed:</span>
        </button>
        <PushButton
          className="action minor"
          disabled={actionsDisabled || speedDisabled || !trainingMode}
          onClick={activityIncreaseSpeed}
        >
          <span>Increase Speed</span>
        </PushButton>
        <PushButton
          className="action minor"
          disabled={actionsDisabled || speedDisabled || !trainingMode}
          onClick={activityDecreaseSpeed}
        >
          <span>Decrease Speed</span>
        </PushButton>
      </div>
    </div>
  );
};

export default Menu;
