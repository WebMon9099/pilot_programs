import { useEffect, useState } from 'react';
import ResizeObserverCompt from 'resize-observer-polyfill';
import { appendClass } from '../../../lib';
import Utils from './utils';

interface RadioSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  activatedElementIndex: number;
  getElements: () => NodeListOf<HTMLButtonElement> | undefined;
  spacing?: number;
}

const RadioSlider: React.FC<RadioSliderProps> = ({
  activatedElementIndex,
  getElements,
  spacing = 0,
  ...rest
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [elementsWidths, setElementsWidths] = useState<number[]>([]);

  useEffect(() => {
    function enableAnimation() {
      setShowAnimation(true);
    }

    const timeout = setTimeout(enableAnimation, 100);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const elements = Array.from(getElements() || []);

    function onResize(entries: ResizeObserverEntry[]) {
      const newElementsWidths: number[] = [];

      entries.forEach((entry) =>
        newElementsWidths.push(entry.contentRect.width)
      );

      setElementsWidths(newElementsWidths);
    }

    try {
      var observer = new ResizeObserver(onResize);
    } catch {
      observer = new ResizeObserverCompt(onResize);
    }

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [getElements]);

  return (
    <div
      {...rest}
      className={appendClass('radio-slider', rest.className)}
      style={{
        ...Utils.getWidthAndOffest(
          activatedElementIndex,
          elementsWidths,
          spacing
        ),
        transition: showAnimation ? '0.2s' : 'none',
      }}
    />
  );
};

export default RadioSlider;
