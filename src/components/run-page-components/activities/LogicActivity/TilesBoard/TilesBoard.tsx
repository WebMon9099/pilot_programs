import { appendClass } from '../../../../../lib';
import { Tile, TileOpacity, TileType } from '../types';
import Utils from '../utils';

interface TilesBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  missingTileIndex: number;
  missingTileType: TileType;
  userAnswer: TileType;
  showAnswer: boolean;
  tiles: Tile[];
}

const TilesBoard: React.FC<TilesBoardProps> = ({
  missingTileIndex,
  missingTileType,
  userAnswer,
  showAnswer,
  tiles,
  ...rest
}) => {
  return (
    <div {...rest} className={appendClass('tiles-board', rest.className)}>
      {tiles.map((tile, index) => {
        if (showAnswer && index === missingTileIndex)
          return Utils.getSVG(
            { type: missingTileType, opacity: TileOpacity.Full },
            userAnswer === missingTileType ? '#92e744' : '#92e744'
          );

        return Utils.getSVG(tile);
      })}
    </div>
  );
};

export default TilesBoard;
