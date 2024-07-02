import _ from 'lodash';

function secondsToTimeString(seconds: number): string {
  const minutes = _.floor(seconds / 60);
  const cleanSeconds = _.floor(seconds - 60 * minutes);

  return `${minutes < 10 ? '0' : ''}${minutes}:${
    cleanSeconds < 10 ? '0' : ''
  }${cleanSeconds}`;
}

const Utils = { secondsToTimeString };

export default Utils;
