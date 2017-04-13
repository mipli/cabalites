import {Component} from './Component';
import Game from '../Game';
import * as Core from '../core';

export class Sight extends Component {
  get type() {
    return 'sight';
  }

  private _radius: number;
  get radius() {
    return this._radius;
  }

  private tileVisibility: boolean[][];

  constructor(radius: number) {
    super();
    this._radius = radius;
    this.tileVisibility = Core.Utils.buildMatrix<boolean>(Game.getInstance().map.width, Game.getInstance().map.height, false);
  }

  getTileVisibility(): boolean[][] {
    return this.tileVisibility;
  }

  setTileVisibility(visiblity: boolean[][]) {
    this.tileVisibility = visiblity;
  }

  isTileVisible(position: Core.Vector2): boolean {
    return this.tileVisibility[position.x][position.y];
  }
}
