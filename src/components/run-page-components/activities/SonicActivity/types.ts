import { ActivityState } from '../../../../types';

export type MathOp = '+' | '-' | '*';

export type ShapeType = 'circle' | 'hexagon' | 'square' | 'star' | 'left-triangle' | 'right-triangle';

export interface State {
  mathSame: boolean | null;
  soundCheckGood: boolean | null;
  detectTriangleGood: boolean | null;
}

export interface LeftGameProps extends React.HTMLAttributes<HTMLDivElement> {
  activityState: ActivityState;
  paused: boolean;
  setGameGood: (detectTriangleGood: boolean) => void;
}

export type LeftGameComponent = React.FC<LeftGameProps>;
