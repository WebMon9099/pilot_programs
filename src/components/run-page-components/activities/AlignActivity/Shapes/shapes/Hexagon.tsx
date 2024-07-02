import { ShapeProps } from './types';

const Hexagon: React.FC<ShapeProps> = ({ fill, ...rest }) => (
  <svg
    {...rest}
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 886.81"
  >
    <polygon
      style={{ fill }}
      points="258.89 881.81 5.77 443.4 258.89 5 765.11 5 1018.23 443.4 765.11 881.81 258.89 881.81"
    />
    <path
      style={{ fill: 'white' }}
      d="M750.68,30,989.36,443.4,750.68,856.81H273.32L34.64,443.4,273.32,30H750.68M768,0H256L0,443.4,256,886.81H768L1024,443.4,768,0Z"
    />
  </svg>
);

export default Hexagon;
