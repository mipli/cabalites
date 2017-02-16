import * as Core from '../core';
import * as Map from '../map';

export class FoV {
  private isOpaque: (position: Core.Vector2) => boolean;
  private width: number;
  private height: number;
  private radius: number;
  
  private startPosition: Core.Vector2;
  private lightMap: number[][];

  constructor() { }

  init(isOpaque: (position: Core.Vector2) => boolean, width: number, height: number, radius: number) {
    this.isOpaque = isOpaque;
    this.width = width;
    this.height = height;
    this.radius = radius;
  }

  calculate(position: Core.Vector2) {
    this.startPosition = position;
    this.lightMap = Core.Utils.buildMatrix<number>(this.width, this.height, 0);

    if (this.isOpaque(position)) {
      return this.lightMap;
    }

    this.lightMap[position.x][position.y] = 1;
    Core.Directions.Ordinals.forEach((direction) => {
      this.castLight(1, 1.0, 0.0, 0, direction.vector.x, direction.vector.y, 0);
      this.castLight(1, 1.0, 0.0, direction.vector.x, 0, 0, direction.vector.y);
    });

    return this.lightMap;
  }

  private castLight(row: number, start: number, end: number, xx: number, xy: number, yx: number, yy: number) {
    let newStart = 0;
    let blocked = false;

    if (start < end) {
      return;
    }

    for (let distance = row; distance <= this.radius && !blocked; distance++) {
      let deltaY = -distance;
      for (let deltaX = -distance; deltaX <= 0; deltaX++) {
        let cx = this.startPosition.x + (deltaX * xx) + (deltaY * xy);
        let cy = this.startPosition.y + (deltaX * yx) + (deltaY * yy);

        let leftSlope = (deltaX - 0.5) / (deltaY + 0.5);
        let rightSlope = (deltaX + 0.5) / (deltaY - 0.5);

        if (!(cx >= 0 && cy >= 0 && cx < this.width && cy < this.height) || start < rightSlope) {
          continue;
        } else if (end > leftSlope) {
          break;
        }

        let dist = Math.max(Math.abs(deltaX), Math.abs(deltaY));

        if (dist <= this.radius) {
          this.lightMap[cx][cy] = 1;
        }

        if (blocked) {
          if (this.isOpaque(new Core.Vector2(cx, cy))) {
            newStart = rightSlope;
            continue;
          } else {
            blocked = false;
            start = newStart;
          }
        } else if (this.isOpaque(new Core.Vector2(cx, cy)) && distance <= this.radius) {
          blocked = true;
          newStart = rightSlope;
        }
      }
    }
  }
}
