import _ from 'lodash';
import { Tile, TileOpacity, TileType } from './types';

const getSelectableTileTypes = () => {
  return _.tail(_.initial(Object.values(TileType)));
};

const getSVG = (tile: Tile, colorOverride?: string) => {
  const color =
    colorOverride ||
    (() => {
      switch (tile.opacity) {
        case TileOpacity.Full:
          return '#848484';
        case TileOpacity.Half:
          return '#e5e5e5';
        case TileOpacity.None:
          return 'transparent';
      }
    })();

  switch (tile.type) {
    case TileType.Circle:
      return (
        <svg
          id="Layer_1"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 308.97 300.33"
          key={_.uniqueId('tile_')}
        >
          <title>react_iconArtboard 19</title>
          <circle
            className="cls-1"
            cx="154.49"
            cy="150.16"
            r="99.42"
            fill={color}
          />
        </svg>
      );
    case TileType.Hex:
      return (
        <svg
          id="Layer_1"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 308.97 300.33"
          key={_.uniqueId('tile_')}
        >
          <title>react_iconArtboard 21</title>
          <polygon
            className="cls-1"
            points="206.23 59.27 100.75 59.27 48.01 150.62 100.75 241.97 206.23 241.97 258.97 150.62 206.23 59.27"
            fill={color}
          />
        </svg>
      );
    case TileType.Square:
      return (
        <svg
          id="Layer_1"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 308.97 300.33"
          key={_.uniqueId('tile_')}
        >
          <title>react_iconArtboard 18</title>
          <rect
            className="cls-1"
            x="59.45"
            y="56.27"
            width="187.79"
            height="187.79"
            rx="6.78"
            fill={color}
          />
        </svg>
      );
    case TileType.Star:
      return (
        <svg
          id="Layer_1"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 308.97 300.33"
          key={_.uniqueId('tile_')}
        >
          <title>react_iconArtboard 20</title>
          <polygon
            className="cls-1"
            points="155.21 50.25 186.75 114.15 257.27 124.4 206.24 174.14 218.28 244.38 155.21 211.22 92.13 244.38 104.18 174.14 53.15 124.4 123.67 114.15 155.21 50.25"
            fill={color}
          />
        </svg>
      );
    case TileType.Question:
      return (
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 309 300.3"
          key={_.uniqueId('tile_')}
        >
          <g>
            <circle
              className="st0"
              cx="150.9"
              cy="222.7"
              r="21.9"
              fill={'#aaaaaa'}
            />
            <path
              className="st0"
              d="M152.4,55.7c-34.1,0-59.6,23.4-59.6,48.1c0,0,0.6,13.8,16.4,13.8c24.1,0,11.8-33.4,45.3-33.4
		c13.6,0,23.4,8,23.4,22.7c0,22.7-44.7,31.1-44.7,60.3c0,9.8,7.3,17.1,16.2,17.1c17.8,0,15.5-16.2,22.9-23.6
		c9.9-9.9,43.8-24.3,43.8-54.2C216.2,74.4,190.2,55.7,152.4,55.7z"
              fill={'#aaaaaa'}
            />
          </g>
        </svg>
      );
  }
};

const Utils = { getSelectableTileTypes, getSVG };

export default Utils;
