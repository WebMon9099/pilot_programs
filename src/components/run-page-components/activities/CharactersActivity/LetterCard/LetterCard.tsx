import { appendClass } from '../../../../../lib';
import { Answer } from '../types';

interface LetterCardProps extends React.HTMLAttributes<HTMLDivElement> {
  isSame: Answer;
  userAnswer: Answer;
  dots: { top: number[]; bottom: number[] };
  letter: string;
  trainingMode: boolean;
}

const LetterCard: React.FC<LetterCardProps> = ({
  isSame: answer,
  userAnswer,
  dots,
  letter,
  trainingMode,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={appendClass('letter-card', rest.className)}
      style={{
        border:
          trainingMode && userAnswer !== Answer.Neutral
            ? userAnswer === answer
              ? `5px solid #92e744`
              : `5px solid #f1504c`
            : undefined,
        ...rest.style,
      }}
    >
      <div className="top dots">
        {dots.top.map((_, index) => (
          <div className="dot" key={index} />
        ))}
      </div>
      <div className="letter">
        <p>{letter}</p>
      </div>
      <div
        className="bottom dots"
        style={{
          marginTop: letter !== 'J' && letter !== 'Q' ? '20px' : '40px',
        }}
      >
        {dots.bottom.map((_, index) => (
          <div className="dot" key={index} />
        ))}
      </div>
    </div>
  );
};

export default LetterCard;
