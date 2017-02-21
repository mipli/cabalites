import * as Core from '../core';
import * as _Map from './index';

export class Map {
  private _width: number;
  get width() {
    return this._width;
  }
  private _height: number;
  get height() {
    return this._height;
  }
  public tiles: _Map.Tile[][];

  //private astar: _Map.Astar;

  constructor(w: number, h: number) {
    this._width = w;
    this._height = h;
    this.tiles = [];
    for (var x = 0; x < this._width; x++) {
      this.tiles[x] = [];
      for (var y = 0; y < this._height; y++) {
        this.tiles[x][y] = _Map.Tile.createTile(_Map.Tile.EMPTY);
      }
    }

/*
    this.astar = new _Map.Astar(
      (pos: Core.Vector2) => {
        return this.isWalkable(pos);
      },
      Core.Vector2.getManhattanDistance
    );
    */
  }

/*
  getPath(start: Core.Vector2, target: Core.Vector2) {
    let path =  this.astar.findPath(start, target);
    return path;
  }
  */

  private isValidPosition(position: Core.Vector2): boolean {
    if (position.x < 0 || position.x >= this.width || position.y < 0 || position.y >= this.height) {
      return false;
    }
    return true;
  }

  getTile(position: Core.Vector2): _Map.Tile {
    if (!this.isValidPosition(position)) {
      return undefined;
    }
    return this.tiles[position.x][position.y];
  }

  setTile(position: Core.Vector2, tile: _Map.Tile) {
    if (this.isValidPosition(position)) {
      this.tiles[position.x][position.y] = tile;
    }
  }

  forEach(callback: (position: Core.Vector2, tile: _Map.Tile) => void): void {
    for (var y = 0; y < this._height; y++) {
      for (var x = 0; x < this._width; x++) {
        callback(new Core.Vector2(x, y), this.tiles[x][y]);
      }
    }
  }

  getEmptyPosition(): Core.Vector2 {
    let attempts = 0;
    while (attempts < this.width * this.height) {
      const x = Core.Random.get(1, this.width);
      const y = Core.Random.get(1, this.height);
      const vector = new Core.Vector2(x, y);
      if (this.isWalkable(vector) && this.getTile(vector).isEmpty) {
        return vector;
      }
    }
    return null;
  }

  isWalkable(position: Core.Vector2, sourceDirection?: Core.DirectionInfo): boolean {
    const tile = this.getTile(position);
    if (!tile) {
      return false;
    }
    if (!tile.walkable) {
      return false;
    }
    if (sourceDirection && sourceDirection.type === Core.DirectionType.Ordinal) {
      const ccDirection = Core.Directions.getClockwiseDirection(sourceDirection.opposite);
      const cDirection = Core.Directions.getCounterClockwiseDirection(sourceDirection.opposite);
      if (!this.isWalkable(position.add(cDirection.vector)) ||
          !this.isWalkable(position.add(ccDirection.vector))) {
        return false;
      }
    }
    return true;
  }
}
