import {Component} from './Component';
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
    this.tileVisibility = [];
  }

  setTileVisibility(visiblity: number[][]) {
    this.tileVisibility = visiblity;
  }

  isTileVisible(position: Core.Vector2): boolean {
    if (this.tileVisibility[position.x]) {
      return this.tileVisibility[position.x][position.y] === 1;
    }
    return false;
  }
}
