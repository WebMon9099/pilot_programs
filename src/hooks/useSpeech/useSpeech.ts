import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const msg = new SpeechSynthesisUtterance();

function useSpeech() {
  const location = useLocation();

  // useEffect(() => {
  //   window.speechSynthesis.onvoiceschanged = function () {
  //     const voices = window.speechSynthesis.getVoices();

  //     const selectedVoice = voices.find(
  //       (voice) => voice.name === 'Google UK English Female'
  //     );

  //     msg.voice = selectedVoice || voices[0];
  //   };
  // }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [location.pathname]);

  return { msg };
}

export default useSpeech;
