import { ShapeProps } from './types';

const Square: React.FC<ShapeProps> = ({ fill, ...rest }) => (
  <svg
    {...rest}
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
  >
    <rect style={{ fill }} x="5" y="5" width="1014" height="1014" />
    <path
      style={{ fill: 'white' }}
      d="M994,30V994H30V30H994m30-30H0V1024H1024V0Z"
    />
  </svg>
);

export default Square;
