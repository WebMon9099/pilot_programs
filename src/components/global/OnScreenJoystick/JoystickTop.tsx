const JoystickTop: React.FC<
  React.SVGAttributes<HTMLOrSVGElement> & { fill?: string }
> = ({ fill = '#34424C', ...rest }) => {
  return (
    <svg
      {...rest}
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 165.5 165.5"
    >
      <g>
        <g id="Layer_1_00000042714009451046839710000015561182272124698028_">
          <circle fill={fill} cx="82.7" cy="82.7" r="82.7" />
          <g>
            <g>
              <circle fill={fill} cx="82.7" cy="82.7" r="82.7" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default JoystickTop;
