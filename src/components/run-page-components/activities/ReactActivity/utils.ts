import _ from 'lodash';
import { EVENT_KEYS } from '../../../../constants';
import { Callback } from '../../../../types';
import images from './images';

function createSpacebarHandler(callback: Callback) {
  return (event: KeyboardEvent) => {
    if (event.key === EVENT_KEYS.spaceBar) callback();
  };
}

function randomizeImageIndexes() {
  const shouldMatch = _.random(2) === 0;

  let newLeftImageIndex, newRightImageIndex;
  if (shouldMatch) {
    const newIndex = _.random(images.length - 1);

    [newLeftImageIndex, newRightImageIndex] = [newIndex, newIndex];
  } else
    do {
      [newLeftImageIndex, newRightImageIndex] = [
        _.random(images.length - 1),
        _.random(images.length - 1),
      ];
    } while (newLeftImageIndex === newRightImageIndex);

  return [newLeftImageIndex, newRightImageIndex];
}

function isRight(li: number, ri: number) {
  return li === ri;
}

const Utils = { createSpacebarHandler, randomizeImageIndexes, isRight };

export default Utils;
