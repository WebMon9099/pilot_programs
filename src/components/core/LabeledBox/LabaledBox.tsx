import { appendClass } from '../../../lib';

interface LabeledBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
}

const LabeledBox: React.FC<LabeledBoxProps> = ({
  label,
  children,
  ...rest
}) => {
  return (
    <div className={appendClass('labeled-box-container', rest.className)}>
      <span className="label">{label}</span>
      <div {...rest} className={appendClass('labeled-box', rest.className)}>
        {children}
      </div>
    </div>
  );
};

export default LabeledBox;
