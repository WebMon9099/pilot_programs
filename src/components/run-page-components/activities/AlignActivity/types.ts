import { ActivityState } from '../../../../types';

export type MathOp = '+' | '-' | '*';

export type ShapeType = 'circle' | 'hexagon' | 'square' | 'star' | 'triangle';

export type ShapeColor = 'blue' | 'green' | 'purple' | 'red' | 'yellow';

export interface Shape {
  type: ShapeType;
  color: ShapeColor;
}

export interface State {
  mathSame: boolean | null;
  shapesSame: boolean;
  gameGood: boolean;
}

export interface LeftGameProps extends React.HTMLAttributes<HTMLDivElement> {
  activityState: ActivityState;
  paused: boolean;
  setGameGood: (gameGood: boolean) => void;
}

export type LeftGameComponent = React.FC<LeftGameProps>;
