import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useStaticActivity } from '../../../../hooks';
import { appendClass } from '../../../../lib';
import { ActivityComponent } from '../../../../types';
import { PushButton } from '../../../core';
import TilesBoard from './TilesBoard';
import { MISSING_TILES_AMOUNT, REVEAL_ON_CHEAT_AMOUNT } from './constants';
import { Game, Tile, TileOpacity, TileType } from './types';
import Utils from './utils';

const LogicActivity: ActivityComponent = ({
  activityActions,
  activityObject,
  activityState,
  ...rest
}) => {
  const [gameState, setGameState] = useState<{
    tiles: Tile[];
    missingTileIndex: number;
  }>({
    tiles: [],
    missingTileIndex: -1,
  });
  const [usedCheats, setUsedCheats] = useState(false);

  const {
    state: missingTileType,
    userAnswer,
    setUserAnswer,
    choices,
  } = useStaticActivity(
    {
      stateCreator: useCallback(() => {
        activityActions.activityIncreaseMaxScore(1);

        return _.sample(Utils.getSelectableTileTypes())!;
      }, [activityActions]),
      stateChangeHandler: useCallback((state: TileType) => {
        const game = new Game();

        const newTiles = game.tiles.reduce((arr, row) => arr.concat(row), []);

        let newMissingTileIndex = -1;
        do {
          newMissingTileIndex = _.random(0, newTiles.length - 1);
        } while (newTiles[newMissingTileIndex].type !== state);

        newTiles[newMissingTileIndex].type = TileType.Question;

        _.sampleSize(_.range(0, newTiles.length), MISSING_TILES_AMOUNT).forEach(
          (index) => (newTiles[index].opacity = TileOpacity.None)
        );

        setGameState({
          tiles: newTiles,
          missingTileIndex: newMissingTileIndex,
        });
      }, []),
      choicesCreator: useCallback(() => Utils.getSelectableTileTypes(), []),
      initialUserAnswer: TileType.NotSelected,
      getScore: useCallback(
        (missingTileType: TileType, userAnswer: TileType) =>
          userAnswer === missingTileType ? 1 : 0,
        []
      ),
      options: {
        submitOnSelect: true,
      },
    },
    activityObject,
    activityState,
    activityActions
  );

  useEffect(() => {
    if (usedCheats) {
      const hiddenTilesIndexes = gameState.tiles.reduce((arr, tile, index) => {
        if (tile.opacity === TileOpacity.None) return [...arr, index];

        return arr;
      }, [] as number[]);

      const newTiles = gameState.tiles;

      _.sampleSize(hiddenTilesIndexes, REVEAL_ON_CHEAT_AMOUNT).forEach(
        (index) => (newTiles[index].opacity = TileOpacity.Half)
      );

      setGameState({
        tiles: newTiles,
        missingTileIndex: gameState.missingTileIndex,
      });
    }
  }, [gameState.missingTileIndex, gameState.tiles, usedCheats]);

  return (
    <div
      {...rest}
      className={appendClass('activity logic-activity', rest.className)}
    >
      {activityState.trainingMode && (
        <PushButton
          className="cheat-button !font-inter transition hover:scale-105 active:scale-95 active:brightness-95"
          disabled={
            activityState.submitted || activityState.paused || usedCheats
          }
          onClick={() => setUsedCheats(true)}
        >
          Cheat
        </PushButton>
      )}
      <TilesBoard
        tiles={
          activityState.submitted && activityState.trainingMode
            ? gameState.tiles.map((tile) => {
                if (tile.opacity === TileOpacity.None)
                  tile.opacity = TileOpacity.Half;
                return tile;
              })
            : gameState.tiles
        }
        missingTileIndex={gameState.missingTileIndex}
        missingTileType={missingTileType}
        userAnswer={userAnswer}
        showAnswer={activityState.submitted && activityState.trainingMode}
      />
      <div className="buttons">
        {choices.map((type, index) => {
          return (
            <PushButton
              key={index}
              style={{
                backgroundColor:
                  activityState.submitted && activityState.trainingMode
                    ? userAnswer === type
                      ? type === missingTileType
                        ? '#92e744'
                        : '#f1504c'
                      : type === missingTileType
                      ? '#92e744'
                      : undefined
                    : undefined,
                borderColor:
                  activityState.submitted && activityState.trainingMode
                    ? userAnswer === type
                      ? type === missingTileType
                        ? '#92e744'
                        : '#f1504c'
                      : type === missingTileType
                      ? '#92e744'
                      : undefined
                    : undefined,
              }}
              disabled={activityState.submitted || activityState.paused}
              onClick={() => setUserAnswer(type)}
            >
              <img
                style={{
                  opacity:
                    activityState.submitted &&
                    (userAnswer === type || missingTileType === type)
                      ? 1
                      : undefined,
                  filter:
                    activityState.submitted &&
                    (userAnswer === type || type === missingTileType)
                      ? 'brightness(400%)'
                      : undefined,
                }}
                src={require(`./images/${type}`)}
                alt="tile_type"
              />
            </PushButton>
          );
        })}
      </div>
    </div>
  );
};

export default LogicActivity;
