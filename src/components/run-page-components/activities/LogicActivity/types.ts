import _ from 'lodash';
import Utils from './utils';

export enum TileType {
  NotSelected = 'NotSelected',
  Circle = 'circle.svg',
  Hex = 'hex.svg',
  Square = 'square.svg',
  Star = 'star.svg',
  Question = 'question.svg',
}

export enum TileOpacity {
  Full = 1,
  Half = 0.5,
  None = 0,
}

export interface Tile {
  type: TileType;
  opacity: TileOpacity;
}

class Board {
  tiles: Tile[][] = [];

  constructor(private size: number) {
    for (let i = 0; i < size; ++i) this.tiles[i] = [];
  }

  reset() {
    for (let i = 0; i < this.size; ++i) this.tiles[i] = [];
  }
}

export class Game {
  private board: Board;

  constructor(size: number = 4) {
    let newBoard = new Board(size);

    const availableTileTypes = Utils.getSelectableTileTypes();

    let isReady = false;
    do {
      newBoard.reset();

      availableTileTypes.forEach((type) => {
        let alreadyInRows: number[] = [];
        let alreadyInColumns: number[] = [];

        for (let i = 0; i < size; ++i) {
          let row;
          let col;

          do {
            row = _.random(size - 1);
            col = _.random(size - 1);
          } while (
            alreadyInRows.includes(row) ||
            alreadyInColumns.includes(col)
          );

          newBoard.tiles[row][col] = {
            type,
            opacity: TileOpacity.Full,
          };

          alreadyInRows.push(row);
          alreadyInColumns.push(col);
        }
      });

      isReady = availableTileTypes.reduce(
        (isTileTypeReady: boolean, tileType) =>
          isTileTypeReady &&
          newBoard.tiles
            .reduce((arr, row) => arr.concat(row), [])
            .reduce((counter, tile) => {
              if (tile.type === tileType) return counter + 1;
              else return counter;
            }, 0) === size,
        true
      );
    } while (!isReady);

    this.board = newBoard;
  }

  get tiles() {
    return this.board.tiles;
  }
}
