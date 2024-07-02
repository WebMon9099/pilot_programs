import { appendClass } from '../../../../../lib';
import { Callback } from '../../../../../types';
import { PushButton } from '../../../../core';

interface RulesPageProps extends React.HTMLAttributes<HTMLDivElement> {
  disableNextButton: boolean;
  onNext: Callback;
  rules: string[];
}

const RulesPage: React.FC<RulesPageProps> = ({
  disableNextButton,
  onNext,
  rules,
  ...rest
}) => {
  return (
    <div {...rest} className={appendClass('rules-page', rest.className)}>
      <div className="rule font-inter">
        <p className="left">
          Press the <b>Top Button</b> if:
        </p>
        <p className="right">{rules[0]}</p>
      </div>
      <div className="rule font-inter">
        <p className="left">
          Press the <b>Right Button</b> if:
        </p>
        <p className="right">{rules[1]}</p>
      </div>
      <div className="rule font-inter">
        <p className="left">
          Press the <b>Bottom Button</b> if:
        </p>
        <p className="right">{rules[2]}</p>
      </div>
      <PushButton
        className="font-inter transition hover:scale-105 active:scale-95 active:brightness-95"
        disabled={disableNextButton}
        onClick={onNext}
      >
        Go
      </PushButton>
    </div>
  );
};

export default RulesPage;
