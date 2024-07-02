import { ShapeProps } from './types';

const Circle: React.FC<ShapeProps> = ({ fill, ...rest }) => (
  <svg
    {...rest}
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
  >
    <path
      style={{ fill }}
      d="M512,1019A507.14,507.14,0,0,1,314.65,44.84a507.13,507.13,0,0,1,394.7,934.32A503.79,503.79,0,0,1,512,1019Z"
    />
    <path
      style={{ fill: '#fff' }}
      d="M512,30A482.13,482.13,0,0,1,699.61,956.13,482.13,482.13,0,0,1,324.39,67.87,478.93,478.93,0,0,1,512,30m0-30C229.23,0,0,229.23,0,512s229.23,512,512,512,512-229.23,512-512S794.77,0,512,0Z"
    />
  </svg>
);

export default Circle;
