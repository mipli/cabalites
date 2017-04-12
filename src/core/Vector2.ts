export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get length(): number {
    return Math.sqrt(this.dot(this));
  }

  toString(): string {
    return this.x + ', ' + this.y;
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
