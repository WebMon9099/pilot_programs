import { ShapeProps } from './types';

const Triangle: React.FC<ShapeProps> = ({ fill, ...rest }) => (
  <svg
    {...rest}
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1046 905.86"
  >
    <polygon
      style={{ fill }}
      points="25.98 890.86 523 30 1020.02 890.86 25.98 890.86"
    />
    <path
      style={{ fill: 'white' }}
      d="M523,60,994,875.86H52L523,60m0-60L0,905.86H1046L523,0Z"
    />
  </svg>
);

export default Triangle;
