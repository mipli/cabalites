import {Component} from './Component';
import * as Core from '../core';

export class Knowledge extends Component {
  get type() {
    return 'knowledge';
  }

  private _exploredTiles: boolean[][];

  constructor(width: number, height: number) {
    super();
    this._exploredTiles = Core.Utils.buildMatrix<boolean>(width, height, false);
  }

  markAsSeen(position: Core.Vector2) {
    this._exploredTiles[position.x][position.y] = true;
  }

  hasSeen(position: Core.Vector2): boolean {
    return this._exploredTiles[position.x][position.y];
  }
}
