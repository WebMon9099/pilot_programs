import { ActivityActions, ActivityState } from '../state';

export interface ActivityObject<P = any> {
  path: string;
  name: string;
  component: ActivityComponent<P>;
  sessions: number;
  sessionLength: number;
  showAnswerTime: number;
  ignoreSessions?: true;
  hasSpeed: boolean;
  queries?: { [key: string]: { name: string; options: string[] } };
  gear: {
    mouse?: boolean;
    headphones?: boolean;
    joystick?:
      | boolean
      | {
          onScreenJoystick:
            | boolean
            | {
                horizontal: boolean;
                vertical: boolean;
              };
          onScreenSlider: boolean;
        };
  };
  controlsColor?: string;
  settings: boolean;
  customNavbarData?: { [key: string]: { label: string; mobileLabel: string } };
}

interface ActivityComponentProps<P>
  extends React.HTMLAttributes<HTMLDivElement> {
  activityActions: ActivityActions;
  activityObject: ActivityObject;
  activityState: ActivityState;
  activityParams?: P;
}

export type ActivityComponent<P = { [key: string]: string }> = React.FC<
  ActivityComponentProps<P>
>;

export type Median = 'below' | 'average' | 'above';

export interface Result {
  id: string;
  score: number;
  start_time: number;
  end_time: number;
  mode: 'normal' | 'training';
}
