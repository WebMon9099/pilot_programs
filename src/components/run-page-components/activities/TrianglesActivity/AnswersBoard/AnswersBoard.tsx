import { appendClass } from "../../../../../lib";
import { Rule, Triangle } from "../types";
import Utils from "../utils";

interface AnswersBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  correctRuleIndex: number;
  rules: Rule[];
  triangle: Triangle;
  // dimensions: { width: number; left: number };
}

const AnswersBoard: React.FC<AnswersBoardProps> = ({
  correctRuleIndex,
  rules,
  triangle,
  // dimensions,
  ...rest
}) => {
  const shouldGreen = (ruleIndex: number) => ruleIndex === correctRuleIndex;

  return (
    <div
      {...rest}
      className={appendClass(
        "answers-board scrollbar-thin scrollbar-thumb-[#e0e0e0]",
        rest.className
      )}
    >
      <p className="title">Previous Triangle:</p>
      <img
        className="triangle"
        src={triangle?.img || ""}
        style={{
          transform: `rotate(${triangle?.orientation}deg)`,
        }}
        alt="triangle"
      />
      <div className="separator"></div>
      <p className="subtitle">Session Rules:</p>
      <div
        className="rule"
        style={
          shouldGreen(0)
            ? {
                backgroundColor: "rgb(146, 239, 103)",
                border: "none",
                boxShadow: "0 4px 6px 0 rgba(0, 0, 0, .1)",
              }
            : undefined
        }
      >
        <div className="title">
          <b style={shouldGreen(0) ? { color: "#48BA18" } : undefined}>
            Top Button:
          </b>
          <img
            src={require(`../images/top_rule_${
              shouldGreen(0) ? "correct" : "incorrect"
            }.svg`)}
            width={20}
            height={20}
            alt="top_rule"
          />
        </div>
        <p style={shouldGreen(0) ? { color: "#48BA18" } : undefined}>
          {Utils.stringifyRule(rules[0])}
        </p>
      </div>
      <div
        className="rule"
        style={shouldGreen(1) ? { backgroundColor: "#92EF67" } : undefined}
      >
        <div className="title">
          <b style={shouldGreen(1) ? { color: "#48BA18" } : undefined}>
            Right Button:
          </b>
          <img
            src={require(`../images/right_rule_${
              shouldGreen(1) ? "correct" : "incorrect"
            }.svg`)}
            width={20}
            height={20}
            alt="right_rule"
          />
        </div>
        <p style={shouldGreen(1) ? { color: "#48BA18" } : undefined}>
          {Utils.stringifyRule(rules[1])}
        </p>
      </div>
      <div
        className="rule"
        style={shouldGreen(2) ? { backgroundColor: "#92EF67" } : undefined}
      >
        <div className="title">
          <b style={shouldGreen(2) ? { color: "#48BA18" } : undefined}>
            Bottom Button:
          </b>
          <img
            src={require(`../images/bottom_rule_${
              shouldGreen(2) ? "correct" : "incorrect"
            }.svg`)}
            width={20}
            height={20}
            alt="bottom_rule"
          />
        </div>
        <p style={shouldGreen(2) ? { color: "#48BA18" } : undefined}>
          {Utils.stringifyRule(rules[2])}
        </p>
      </div>
    </div>
  );
};

export default AnswersBoard;
