import Game from './Game';
import * as Core from './core';

interface VisibilityInformation {
  value: number,
  viewers: number
}

export default class KnowledgeStore {
  private _exploredTiles: boolean[][];
  private _tileVisibility: VisibilityInformation[][];

  constructor() {
    this._exploredTiles = Core.Utils.buildMatrix<boolean>(Game.getInstance().map.width, Game.getInstance().map.height, false);
    this._tileVisibility = Core.Utils.buildMatrix<VisibilityInformation>(Game.getInstance().map.width, Game.getInstance().map.height, () => { return {value: 0, viewers: 0}; });
  }

  markAsSeen(position: Core.Vector2) {
    this._exploredTiles[position.x][position.y] = true;
  }

  hasSeen(position: Core.Vector2): boolean {
    return this._exploredTiles[position.x][position.y];
  }

  isTileVisible(position: Core.Vector2): boolean {
    return this._tileVisibility[position.x][position.y].value === 1;
  }

  markAsVisible(position: Core.Vector2) {
    this._tileVisibility[position.x][position.y].viewers = this._tileVisibility[position.x][position.y].viewers + 1;
    this._tileVisibility[position.x][position.y].value = 1;
  }

  markAsNonVisible(position: Core.Vector2) {
    this._tileVisibility[position.x][position.y].viewers--;
    if (this._tileVisibility[position.x][position.y].viewers <= 0) {
      this._tileVisibility[position.x][position.y].value = 0;
      this._tileVisibility[position.x][position.y].viewers = 0;
    }
  }
}
