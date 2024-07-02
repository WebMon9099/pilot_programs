import { appendClass } from '../../../../../lib';
import { PushButton } from '../../../../core';
import { Shape } from '../types';
import { COLORS } from './constants';
import Circle from './shapes/Circle';
import Hexagon from './shapes/Hexagon';
import Square from './shapes/Square';
import Star from './shapes/Star';
import Triangle from './shapes/Triangle';
import { ShapeProps } from './shapes/types';

interface ShapesProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled: boolean;
  shapes: Shape[];
  setShapesSame: (shapesSame: boolean) => void;
}

const Shapes: React.FC<ShapesProps> = ({
  disabled,
  shapes,
  setShapesSame,
  ...rest
}) => {
  function getShapeElement(shape: Shape, index: number) {
    let ShapeElement: React.FC<ShapeProps>;
    switch (shape.type) {
      case 'circle':
        ShapeElement = Circle;
        break;
      case 'hexagon':
        ShapeElement = Hexagon;
        break;
      case 'square':
        ShapeElement = Square;
        break;
      case 'star':
        ShapeElement = Star;
        break;
      case 'triangle':
        ShapeElement = Triangle;
        break;
    }

    return (
      <ShapeElement key={index} className="shape" fill={COLORS[shape.color]} />
    );
  }

  return (
    <div {...rest} className={appendClass('shapes', rest.className)}>
      <div className="shape-container">{shapes.map(getShapeElement)}</div>
      <PushButton
        className="font-inter transition hover:scale-105 active:scale-95 active:brightness-95"
        disabled={disabled}
        onClick={() => setShapesSame(true)}
      >
        Match
      </PushButton>
    </div>
  );
};

export default Shapes;
