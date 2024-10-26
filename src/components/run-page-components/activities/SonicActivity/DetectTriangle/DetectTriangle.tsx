import { appendClass } from '../../../../../lib';
import { PushButton } from '../../../../core';
import { ShapeType } from '../types';
import { useEffect, useState } from 'react';

interface MathProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled: boolean;
  setDetectTriangleGood: (detectTriangleGood: boolean) => void;
  shapes: ShapeType[];
  interval: number;
}

const DetectTriangle: React.FC<MathProps> = ({
  disabled,
  setDetectTriangleGood,
  shapes,
  interval,
  ...rest
}) => {

  const [progressHeight, setProgressHeight] = useState(100);

  useEffect(() => {
    
    const progress_timer = setInterval(() => {
      setProgressHeight(progressHeight => (progressHeight - 1000/interval) > 0? progressHeight - 1000/interval : 0);
    }, 10);

    const main_timer = setInterval(() => {
      setProgressHeight(100);
    }, interval)

    return () => {
      clearInterval(main_timer);
      clearInterval(progress_timer);
    }
  }, [])

  function getShapeElement(shape: ShapeType, index: number) {
    switch (shape) {
      case 'circle':
        return (
          <img key={index} className="shape" alt={shape} src={require('./images/circle.svg').default}/>
        );
      case 'hexagon':
        return (
          <img key={index} className="shape" alt={shape} src={require('./images/hexagon.svg').default}/>
        );
      case 'square':
        return (
          <img key={index} className="shape" alt={shape} src={require('./images/circle.svg').default}/>
        );
      case 'star':
        return (
          <img key={index} className="shape" alt={shape} src={require('./images/star.svg').default}/>
        );
      case 'left-triangle':
        return (
          <img key={index} className="shape" alt={shape} src={require('./images/left-triangle.svg').default}/>
        );
      case 'right-triangle':
        return (
          <img key={index} className="shape" alt={shape} src={require('./images/right-triangle.svg').default}/>
        );
    }
  }

  const detectshape = (kind : String) => {
    if (kind === 'left'){
      if (shapes.includes('left-triangle')){
        setDetectTriangleGood(true);
      } else {
        setDetectTriangleGood(false);
      }
      return;
    }

    if (kind === 'skip'){
      if (shapes.includes('right-triangle') || shapes.includes('left-triangle')){
        setDetectTriangleGood(false);
      } else {
        setDetectTriangleGood(true);
      }
      return;
    }
    if (kind === 'right'){
      if (shapes.includes('right-triangle')){
        setDetectTriangleGood(true);
      } else {
        setDetectTriangleGood(false);
      }
      return;
    }
    setDetectTriangleGood(false);
  }

  return (
    <div {...rest} className={appendClass('detect-triangle', rest.className)}>
      <div className="shape-container">{shapes.map(getShapeElement)}</div>
      <div className='timer-progress-container'>
        <div className='rod'>
          <div className='progress-bar' style={{height:progressHeight + '%'}}></div>
        </div>
      </div>
      <div className="buttons-container">
        <PushButton
          className="font-inter transition hover:scale-105 active:scale-95 active:brightness-95"
          disabled={disabled}
          onClick={() => detectshape('left')}
        >
          <img className="button-img" alt={"left"} src={require('./images/left-triangle-button-icon.svg').default}/>
        </PushButton>
        <PushButton
          className="font-inter transition hover:scale-105 active:scale-95 active:brightness-95"
          disabled={disabled}
          onClick={() => detectshape('right')}
        >
          <img className="button-img" alt={"right"} src={require('./images/right-triangle-button-icon.svg').default}/>
        </PushButton>
      </div>
    </div>
  );
};

export default DetectTriangle;
