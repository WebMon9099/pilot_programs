import { appendClass } from '../../../../../lib';
import type { ShapeColor, ShapeType } from '../../AlignActivity/types';
import { COLORS } from './constants';
import { Circle, Hexagon, Square, Star, Triangle } from './shapes';

const Shape: React.FC<
  React.SVGAttributes<HTMLOrSVGElement> & { type: ShapeType; color: ShapeColor }
> = ({ type, color, ...rest }) => {
  function getShapeElement(shape: { type: ShapeType; color: ShapeColor }) {
    let ShapeElement: React.FC<
      { fill: string } & React.SVGAttributes<HTMLOrSVGElement>
    >;
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
      <ShapeElement
        {...rest}
        className={appendClass('shape', rest.className)}
        fill={COLORS[shape.color]}
      />
    );
  }

  return getShapeElement({ type, color });
};

export default Shape;
