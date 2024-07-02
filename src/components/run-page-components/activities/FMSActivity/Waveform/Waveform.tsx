import lottie, { type AnimationItem } from 'lottie-web';
import { useEffect, useRef } from 'react';
import { appendClass } from '../../../../../lib';

interface WaveformProps extends React.HTMLAttributes<HTMLDivElement> {
  paused?: boolean;
}

const Waveform: React.FC<WaveformProps> = ({ paused = false, ...rest }) => {
  const animation = useRef<AnimationItem | undefined>(undefined);
  const waveformElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!waveformElement.current) return;

    animation.current = lottie.loadAnimation({
      container: waveformElement.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('./waveform.json'),
    });
  }, []);

  useEffect(() => {
    if (!animation.current) return;

    if (paused) animation.current.pause();
    else animation.current.play();
  }, [paused]);

  return (
    <div
      {...rest}
      className={appendClass('waveform', rest.className)}
      ref={waveformElement}
    />
  );
};

export default Waveform;
