import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { NO_SOUND } from './constants';
import { PlaySoundHandler, UseSoundReturnValue } from './types';

const sound = new Audio();

sound.src = NO_SOUND;

function useSound(): UseSoundReturnValue {
  const location = useLocation();
  const shouldPlay = useRef(true);

  const playSound: PlaySoundHandler = useCallback(
    (uri, afterStart, onError) => {
      if (!shouldPlay.current) return;

      sound.src = uri;

      sound.play().then(afterStart, onError);
    },
    []
  );

  const setVolume = useCallback((volume: number) => {
    sound.volume = volume;
  }, []);

  useEffect(() => {
    return () => {
      shouldPlay.current = false;
      sound.pause();
      sound.src = NO_SOUND;
    };
  }, [location.pathname]);

  return { setVolume, sound, playSound };
}

export default useSound;
