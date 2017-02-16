export class Vector2 {
  private _x: number;
  private _y: number;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get length(): number {
    return Math.sqrt(this.dot(this));
  }

  toString(): string {
    return this._x + ', ' + this._y;
  }

  equals(v: Vector2): boolean {
    return this.x === v.x && this.y === v.y;
  }

  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  multiply(s: number): Vector2 {
    return new Vector2(this.x * s, this.y * s);
  }

  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  distanceSquared(v: Vector2): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  distance(v: Vector2): number {
    return Math.sqrt(this.distanceSquared(v));
  }

  getManhattanDistance(v: Vector2): number {
    return Math.abs(this.x - v.x) + Math.abs(this.y + v.y);
  }
}
