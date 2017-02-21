import {Component} from './Component';
import Game from '../Game';
import * as Core from '../core';
import * as Map from '../map';

export class Position extends Component {
  get type() {
    return 'position';
  }

  private position: Core.Vector2;
  private game: Game;

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  get vector() {
    return this.position;
  }

  constructor(position: Core.Vector2) {
    super()
    this.game = Game.getInstance();
    this.position = position;
  }

  initialize() {
    if (this.position) {
      this.game.map.tiles[this.position.x][this.position.y].addEntity(this.entity);
    }
  }

  set(value: Core.Vector2) {
    this.game.map.tiles[this.position.x][this.position.y].removeEntity(this.entity);
    this.position = value;
    this.game.map.tiles[this.position.x][this.position.y].addEntity(this.entity);
  }

  delete() {
    this.game.map.tiles[this.position.x][this.position.y].removeEntity(this.entity);
  }
}
