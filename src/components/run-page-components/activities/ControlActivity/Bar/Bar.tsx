import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { animate, appendClass } from "../../../../../lib";

interface BarProps extends React.HTMLAttributes<HTMLDivElement> {
  upperForce: number;
  setUpperState: (state: number) => void;
  paused: boolean;
  side: "left" | "right";
  type: string | undefined;
}

const Bar: React.FC<BarProps> = ({
  upperForce,
  setUpperState,
  paused,
  side,
  type,
  ...rest
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const counterForce = useRef(_.sample([1, -1])!);

  const [imgLoaded, setImgLoaded] = useState(false);
  const [leftOffset, setLeftOffset] = useState(0);
  const [state, setState] = useState(50);

  useEffect(() => {
    if (!imgRef.current || !ballRef.current || !imgLoaded) return;

    const ballX =
      ballRef.current.getBoundingClientRect().left +
      ballRef.current.clientWidth / 2;
    const imgRight = imgRef.current.getBoundingClientRect().right;

    setLeftOffset(imgRight - ballX + 10);
  }, [imgLoaded]);

  useEffect(() => {
    const counterForceChangeInterval = setInterval(() => {
      counterForce.current = _.sample([1, -1])!;
    }, 1000);

    return () => clearInterval(counterForceChangeInterval);
  }, []);

  useEffect(() => {
    if (!paused) {
      return animate(() => {
        setState((state) => {
          const targetState =
            state + (upperForce !== 0 ? upperForce : counterForce.current);

          if (targetState >= 10 && targetState <= 90) return targetState;
          else {
            counterForce.current *= -1;
            return state;
          }
        });
      });
    }
  }, [paused, upperForce]);

  useEffect(() => {
    setUpperState(state);
  }, [setUpperState, state]);

  function getBackground() {
    switch (type) {
      case "Linear":
        return (
          <img
            ref={imgRef}
            src={require("./images/svgs/linear-bar.svg").default}
            alt="linear-bar"
            onLoad={() => setImgLoaded(true)}
          />
        );
      case "Circular":
        return (
          <img
            ref={imgRef}
            src={require("./images/svgs/circular-bar.svg").default}
            alt="linear-bar"
            onLoad={() => setImgLoaded(true)}
          />
        );
      default:
        return null;
    }
  }

  function getBallStyle(): React.CSSProperties {
    switch (type) {
      case "Linear":
        return { top: `${state}%` };
      case "Circular":
        return {
          top: "50%",
          transformOrigin: `${leftOffset}px center`,
          transform: `translate(-50%, -50%) rotate(${
            (70 - state - 20) * 1.75
          }deg)`,
        };
      default:
        return {};
    }
  }

  return (
    <div
      {...rest}
      className={appendClass("bar", rest.className)}
      style={{
        transform:
          leftOffset !== 0 && side === "right" ? "rotate(-90deg)" : undefined,
      }}
    >
      {getBackground()}
      <div ref={ballRef} className="ball" style={getBallStyle()} />
    </div>
  );
};

export default Bar;
