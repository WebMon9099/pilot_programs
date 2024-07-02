import { PushButton, PushButtonProps } from '../../../../core';

interface ComputerButtonProps extends PushButtonProps {
  activated?: boolean;
}

const ComputerButton: React.FC<ComputerButtonProps> = ({
  activated,
  hidden,
  ...rest
}) => {
  return (
    <PushButton
      {...rest}
      className="computer-button-container"
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
    >
      <div
        className="inner"
        style={{ backgroundColor: activated ? '#74d813' : undefined }}
      />
    </PushButton>
  );
};

export default ComputerButton;
