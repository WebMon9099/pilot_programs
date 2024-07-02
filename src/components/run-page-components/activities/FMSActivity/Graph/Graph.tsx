import { appendClass } from '../../../../../lib';
import type { Attempt } from '../FMSActivity';

interface GraphProps extends React.HTMLAttributes<HTMLDivElement> {
  attempts: Attempt[];
}

const Graph: React.FC<GraphProps> = ({ attempts, ...rest }) => {
  return (
    <div {...rest} className={appendClass('graph', rest.className)}>
      <div className="graph-container">
        <div className="y-axis">
          <div className="cursor">
            <span>0</span>
            <div className="line" />
          </div>
          <div className="cursor">
            <span>1</span>
            <div className="line" />
          </div>
          <div className="cursor">
            <span>2</span>
            <div className="line" />
          </div>
          <div className="cursor">
            <span>3</span>
            <div className="line" />
          </div>
          <div className="cursor">
            <span>4</span>
            <div className="line" />
          </div>
        </div>
        <div className="columns">
          {attempts.map((attempt, i) => (
            <div
              className="column"
              style={{
                height: `calc(${(attempt.totalItems / 4) * 100}%)`,
              }}
              key={i}
            >
              <div
                className="fill"
                style={{
                  height: `calc(${
                    (attempt.recalled / attempt.totalItems) * 100
                  }%)`,
                  backgroundColor:
                    i === attempts.length - 1 ? '#00acdd' : undefined,
                }}
              />
            </div>
          ))}
          {attempts.length < 10 &&
            new Array(10 - attempts.length)
              .fill(null)
              .map((_, i) => <div key={i} />)}
        </div>
      </div>
    </div>
  );
};

export default Graph;
