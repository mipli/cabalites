import * as Core from '../core';

export class Room {
  private _y: number;
  private _x: number;
  private _width: number;
  private _height: number;

  private _openings: Core.Vector2[];

  get y() { return this._y; }
  get x() { return this._x; }
  get width() { return this._width; }
  get height() { return this._height; }
  get openings() { return this._openings; }

  constructor(x: number, y: number, width: number, height: number) {
    this._y = y;
    this._x = x;
    this._width = width;
    this._height = height;
    this._openings = [];
  }

  addOpening(point: Core.Vector2) {
    this._openings.push(point);
  }

  hasOpenings(point: Core.Vector2): boolean {
    return this._openings.find((p: Core.Vector2) => p.equals(point)).length > 0;
  }

  removeOpening(point: Core.Vector2) {
    let idx = -1;
    this._openings.forEach((p, index) => {
      if (p.equals(point)) {
        idx = index;
      }
    });
    if (idx >= 0) {
     this._openings.splice(idx, 1);
    }
  }

  contains(point: Core.Vector2): boolean {
    return point.x >= this.x && point.x < this.x + this.width && point.y >= this.y && point.y < this.y + this.height;

  }
}
