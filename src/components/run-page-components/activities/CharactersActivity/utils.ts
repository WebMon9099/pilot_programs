import _ from 'lodash';
import { DotsObject } from './types';

function generateRandomLetter(skipLetter?: string): string {
  while (true) {
    const letter = String.fromCharCode(_.random(65, 90));

    if (letter !== skipLetter) return letter;
  }
}

function generateRandomDotsNumber(skipDotsNumber?: number): number {
  while (true) {
    const number = _.floor(_.random(3));

    if (number !== skipDotsNumber) return number;
  }
}

function generateQuestion(letter: string, dotsNumber: number): string {
  function getAOrAn(letter: string) {
    switch (letter) {
      case 'A':
      case 'E':
      case 'I':
      case 'O':
      case 'U':
        return 'an';
      default:
        return 'a';
    }
  }

  function getDotsString(dotsNumber: number): string {
    switch (dotsNumber) {
      case 0:
        return 'no dots';
      case 1:
        return 'one dot';
      default:
        return `${dotsNumber} dots`;
    }
  }

  return `Is there ${getAOrAn(letter)} ${letter} with ${getDotsString(
    dotsNumber
  )}?`;
}

function getDotsObject(dotsNumber: number): DotsObject {
  const dots: DotsObject = {
    top: [],
    bottom: [],
  };

  for (let i = 0; i < dotsNumber; ++i) {
    const assignToTop = _.sample([true, false]);

    if (assignToTop) dots.top.push(0);
    else dots.bottom.push(0);
  }

  return dots;
}

const Utils = {
  generateRandomLetter,
  generateRandomDotsNumber,
  generateQuestion,
  getDotsObject: _.memoize(getDotsObject),
};

export default Utils;
