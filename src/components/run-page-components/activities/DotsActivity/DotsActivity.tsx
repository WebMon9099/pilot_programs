import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStaticActivity } from '../../../../hooks';
import { animate, appendClass } from '../../../../lib';
import { ActivityComponent } from '../../../../types';
import { PushButton } from '../../../core';
import { Circle } from './types';
import Utils from './utils';

const DotsActivity: ActivityComponent = ({
  activityActions,
  activityObject,
  activityState,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [circles, setCircles] = useState<Circle[]>([]);

  const {
    state: circlesNumber,
    choices,
    userAnswer,
    setUserAnswer,
  } = useStaticActivity(
    {
      stateCreator: useCallback(() => {
        activityActions.activityIncreaseMaxScore(1);

        return _.random(5, 11);
      }, [activityActions]),
      stateChangeHandler: useCallback(
        (circlesNumber: number) => {
          const newCircles = Utils.generateNewSet(
            dimensions,
            circlesNumber,
            activityState.trainingMode
          );

          setCircles(newCircles);
        },
        [activityState.trainingMode, dimensions]
      ),
      choicesCreator: useCallback(
        (circlesAmount: number) =>
          _.shuffle([
            circlesAmount,
            ..._.sampleSize(_.pull(_.range(5, 11), circlesAmount), 4),
          ]),
        []
      ),
      initialUserAnswer: -1,
      getScore: useCallback((circlesNumber: number, selectedChoice: number) => {
        if (circlesNumber === selectedChoice) return 1;
      }, []),
      options: {
        submitOnSelect: true,
      },
    },
    activityObject,
    activityState,
    activityActions
  );

  useEffect(() => {
    const newCanvasSide = containerRef.current!.clientHeight * 0.8;

    setDimensions({
      width: newCanvasSide,
      height: newCanvasSide,
    });
  }, []);

  useEffect(() => {
    const context = canvasRef.current!.getContext('2d')!;

    Utils.drawOutline(
      context,
      dimensions.width / 2,
      dimensions.height / 2,
      dimensions.width / 2
    );
  }, [dimensions]);

  useEffect(() => {
    if (!activityState.paused) {
      Utils.resetLastVectorChange(circles);

      const context = canvasRef.current!.getContext('2d')!;

      return animate(() =>
        Utils.updateFrame(dimensions, context, activityState.speed, circles)
      );
    }
  }, [activityState.paused, activityState.speed, dimensions, circles]);

  return (
    <div
      {...rest}
      className={appendClass('activity dots-activity', rest.className)}
      ref={containerRef}
    >
      <div
        className="canvas-container"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <div
          className="canvas-background"
          style={{ width: dimensions.width, height: dimensions.height }}
        />
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          style={dimensions}
        />
      </div>
      <div className="choices-buttons">
        {choices.map((choice) => (
          <PushButton
            className="font-inter transition hover:scale-105 active:scale-95 active:brightness-95"
            disabled={activityState.submitted || activityState.paused}
            key={choice}
            onClick={() => setUserAnswer(choice)}
            style={{
              backgroundColor: activityState.submitted
                ? choice === userAnswer
                  ? choice === circlesNumber
                    ? '#92e744'
                    : '#f1504c'
                  : choice === circlesNumber
                  ? '#92e744'
                  : undefined
                : undefined,
              color: activityState.submitted
                ? choice === userAnswer || choice === circlesNumber
                  ? 'white'
                  : undefined
                : undefined,
            }}
          >
            <b>{choice}</b>
          </PushButton>
        ))}
      </div>
    </div>
  );
};

export default DotsActivity;
