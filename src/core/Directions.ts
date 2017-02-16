import {Vector2} from './Vector2';

export enum DirectionType {
  Cardinal,
  Ordinal
}

export class DirectionInfo {
  private _index: number;
  private _vector: Vector2;
  private _type: DirectionType;
  private _opposite: DirectionInfo;

  get index() {
    return this._index;
  }

  get vector() {
    return this._vector;
  }

  get type() {
    return this._type;
  }

  get opposite() {
    return this._opposite;
  }

  get isOrdinal() {
    return this.type === DirectionType.Ordinal;
  }

  get isCardinal() {
    return this.type === DirectionType.Cardinal;
  }

  constructor(index: number, x: number, y: number, t: DirectionType) {
    this._index = index;
    this._vector = new Vector2(x, y);
    this._type = t;
    this._opposite = null;
  }

  setOpposite(dir: DirectionInfo) {
    if (this._opposite !== null) {
      throw "Cannot set direction opposite more than once";
    }
    this._opposite = dir;
  }
}

export namespace Directions {
  export const North = new DirectionInfo(0, 0, -1, DirectionType.Cardinal);
  export const NorthEast = new DirectionInfo(1, 1, -1, DirectionType.Ordinal);
  export const East = new DirectionInfo(2, 1, 0, DirectionType.Cardinal);
  export const SouthEast = new DirectionInfo(3, 1,  1, DirectionType.Ordinal);
  export const South = new DirectionInfo(4, 0,  1, DirectionType.Cardinal);
  export const SouthWest = new DirectionInfo(5, -1,  1, DirectionType.Ordinal);
  export const West = new DirectionInfo(6, -1, 0, DirectionType.Cardinal);
  export const NorthWest = new DirectionInfo(7, -1, -1, DirectionType.Ordinal);
  export const All = [
    Directions.North,
    Directions.NorthEast,
    Directions.East,
    Directions.SouthEast,
    Directions.South,
    Directions.SouthWest,
    Directions.West,
    Directions.NorthWest
  ];
  export const Ordinals = [
    Directions.NorthEast,
    Directions.NorthWest,
    Directions.SouthWest,
    Directions.SouthEast
  ];
  export const Cardinals = [
    Directions.North,
    Directions.West,
    Directions.South,
    Directions.East
  ];
  export function getClockwiseDirection(dir: DirectionInfo) {
    return Directions.All[(dir.index + 1) % 8];
  };
  export function getCounterClockwiseDirection(dir: DirectionInfo) {
    let idx = dir.index - 1;
    if (idx < 0) {
      idx = 7;
    }
    return Directions.All[idx];
  };
};

Directions.North.setOpposite(Directions.South);
Directions.NorthEast.setOpposite(Directions.SouthWest);
Directions.East.setOpposite(Directions.West);
Directions.SouthEast.setOpposite(Directions.NorthWest);
Directions.South.setOpposite(Directions.North);
Directions.SouthWest.setOpposite(Directions.NorthEast);
Directions.West.setOpposite(Directions.East);
Directions.NorthWest.setOpposite(Directions.SouthEast);
