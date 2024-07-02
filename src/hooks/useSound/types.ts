import { Callback } from '../../types';

export type PlaySoundHandler = (
  uri: string,
  afterStart?: Callback,
  onError?: (err: any) => void
) => void;

export interface UseSoundReturnValue {
  setVolume: (volume: number) => void;
  sound: HTMLAudioElement;
  playSound: PlaySoundHandler;
}
