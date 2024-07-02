const SliderButton: React.FC<
  React.SVGAttributes<HTMLOrSVGElement> & { fill?: string }
> = ({ fill = '#34424C', ...rest }) => {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 65.1 65.1"
    >
      <g>
        <g id="Layer_1_00000168094639415060967310000009455195103330059952_">
          <circle fill={fill} cx="32.6" cy="32.6" r="32.6" />
          <g>
            <g>
              <circle fill={fill} cx="32.6" cy="32.6" r="32.6" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default SliderButton;
