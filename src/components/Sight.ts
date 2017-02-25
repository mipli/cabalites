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

  private tileVisibility: number[][];

  constructor(radius: number) {
    super();
    this._radius = radius;
    this.tileVisibility = Core.Utils.buildMatrix<number>(Game.getInstance().map.width, Game.getInstance().map.height, 0);
  }

  setTileVisibility(visiblity: number[][]) {
    this.tileVisibility = visiblity;
  }

  isTileVisible(position: Core.Vector2): boolean {
    return this.tileVisibility[position.x][position.y] === 1;
  }
}
