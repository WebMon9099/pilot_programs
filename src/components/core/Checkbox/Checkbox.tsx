import { useEffect, useState } from 'react';
import { appendClass } from '../../../lib';
import PushButton, { type PushButtonProps } from '../PushButton';

interface CheckboxProps extends PushButtonProps {
  initialyChecked?: boolean;
  overrideChecked?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  initialyChecked = false,
  overrideChecked,
  onCheckedChange,
  ...rest
}) => {
  const [checked, setChecked] = useState(initialyChecked || false);

  useEffect(() => {
    if (overrideChecked !== undefined) setChecked(overrideChecked);
  }, [overrideChecked]);

  return (
    <PushButton
      {...rest}
      className={appendClass('checkbox', rest.className)}
      onClick={() => {
        setChecked(!checked);

        if (onCheckedChange) onCheckedChange(!checked);
      }}
    >
      <div className="checked-div" style={{ opacity: checked ? 1 : 0 }} />
    </PushButton>
  );
};

export default Checkbox;
