// field of view algorithm : restrictive precise angle shadowcasting by Dominik Marczuk
// http://www.roguebasin.com/index.php?title=Restrictive_Precise_Angle_Shadowcasting

/**
 * Section: Field of view
 */

/**
 * Class: Fov
 * Stores the map properties and compute the field of view from a point.
 */
export class Shadowcast {
  private _transparent: boolean[][];
  private startAngle: number[];
  private endAngle: number[];
  private isTransparent: (x: number, y: number) => boolean;


  /**
   * Constructor: constructor
   * Parameters:
   * width - the map width
   * height - the map height
   */
  constructor(private _width: number, private _height: number) {
    this._transparent = [];
    for (let x = 0; x < _width; x++) {
      this._transparent[x] = [];
    }
    this.startAngle = [];
    this.endAngle = [];
  }

  /**
   * Property: width
   * Return the map width (read-only)
   */
  get width() { return this._width; }

  /**
   * Property: height
   * Return the map height (read-only)
   */
  get height() { return this._height; }


  public setIsTransparent(func: (x: number, y: number) => boolean) {
    this.isTransparent = func;
  }

  /**
   * Function: computeFov
   * Compute the field of view using <restrictive precise angle shadowcasting
   * at http://www.roguebasin.com/index.php?title=Restrictive_Precise_Angle_Shadowcasting> by Dominik Marczuk
   * Parameters:
   * x - x coordinate of the point of view
   * y - y coordinate of the point of view
   * maxRadius - maximum distance for a cell to be visible
   * lightWalls - *optional* (default : true) whether walls are included in the field of view.
   */
  public computeFov(x: number, y: number, maxRadius: number, lightWalls: boolean = true) {
    let fov = this.createFov();
    fov[x][y] = true;
    fov = this.computeQuadrantVertical(fov, x, y, maxRadius, lightWalls, 1, 1);
    fov = this.computeQuadrantHorizontal(fov, x, y, maxRadius, lightWalls, 1, 1);
    fov = this.computeQuadrantVertical(fov, x, y, maxRadius, lightWalls, 1, -1);
    fov = this.computeQuadrantHorizontal(fov, x, y, maxRadius, lightWalls, 1, -1);
    fov = this.computeQuadrantVertical(fov, x, y, maxRadius, lightWalls, -1, 1);
    fov = this.computeQuadrantHorizontal(fov, x, y, maxRadius, lightWalls, -1, 1);
    fov = this.computeQuadrantVertical(fov, x, y, maxRadius, lightWalls, -1, -1);
    fov = this.computeQuadrantHorizontal(fov, x, y, maxRadius, lightWalls, -1, -1);
    return fov;
  }

  /**
   * Function: clearFov
   * Reset the field of view information.
   */
  private createFov(): boolean[][] {
    const fov: boolean[][] = [];
    for (let x: number = 0; x < this.width; x++) {
      fov[x] = [];
      for (let y: number = 0; y < this.height; y++) {
        fov[x][y] = false;
      }
    }
    return fov;
  }

  private computeQuadrantVertical(fov: boolean[][], xPov: number, yPov: number, maxRadius: number,
      lightWalls: boolean, dx: number, dy: number) {
    let y: number = yPov + dy;
    let done: boolean = false;
    let iteration: number = 1;
    let minAngle: number = 0;
    let lastLineObstacleCount: number = 0;
    let totalObstacleCount = 0;
    while (!done && y >= 0 && y < this.height) {
      let slopePerCell: number = 1 / iteration;
      let halfSlope: number = slopePerCell * 0.5;
      let processedCell: number = Math.floor((minAngle + halfSlope) / slopePerCell);
      let xMin: number = Math.max(0, xPov - iteration);
      let xMax: number = Math.min(this.width - 1, xPov + iteration);
      done = true;
      for (let x: number = xPov + processedCell * dx; x >= xMin && x <= xMax; x += dx) {
        let centreSlope: number = processedCell * slopePerCell;
        let startSlope: number = centreSlope - halfSlope;
        let endSlope: number = centreSlope + halfSlope;
        let visible: boolean = true;
        let extended: boolean = false;
        if (lastLineObstacleCount > 0 && !fov[x][y]) {
          let idx: number = 0;
          if (visible && !this.canSee(fov, x, y - dy)
              && x - dx >= 0 && x - dx < this.width && !this.canSee(fov, x - dx, y - dy)) {
            visible = false;
          } else {
            while (visible && idx < lastLineObstacleCount) {
              if (this.startAngle[idx] > endSlope || this.endAngle[idx] < startSlope) {
                ++idx;
              } else {
                if (this.isTransparent(x, y)) {
                  if (centreSlope > this.startAngle[idx] && centreSlope < this.endAngle[idx]) {
                    visible = false;
                  }
                } else {
                  if (startSlope >= this.startAngle[idx] && endSlope <= this.endAngle[idx]) {
                    visible = false;
                  } else {
                    this.startAngle[idx] = Math.min(this.startAngle[idx], startSlope);
                    this.endAngle[idx] = Math.max(this.endAngle[idx], endSlope);
                    extended = true;
                  }
                }
                ++idx;
              }
            }
          }
        }
        if (visible) {
          fov[x][y] = true;
          done = false;
          // if the cell is opaque, block the adjacent slopes
          if (!this.isTransparent(x, y)) {
            if (minAngle >= startSlope) {
              minAngle = endSlope;
              // if min_angle is applied to the last cell in line, nothing more
              // needs to be checked.
              if (processedCell === iteration) {
                done = true;
              }
            } else if (!extended) {
              this.startAngle[totalObstacleCount] = startSlope;
              this.endAngle[totalObstacleCount] = endSlope;
              totalObstacleCount++;
            }
            if (!lightWalls) {
              fov[x][y] = false;
            }
          }
        }
        processedCell++;
      }
      if (iteration === maxRadius) {
        done = true;
      }
      iteration++;
      lastLineObstacleCount = totalObstacleCount;
      y += dy;
      if (y < 0 || y >= this.height) {
        done = true;
      }
    }
    return fov;
  }

  private computeQuadrantHorizontal(fov: boolean[][], xPov: number, yPov: number, maxRadius: number,
      lightWalls: boolean, dx: number, dy: number) {
    let x: number = xPov + dx;
    let done: boolean = false;
    let iteration: number = 1;
    let minAngle: number = 0;
    let lastLineObstacleCount: number = 0;
    let totalObstacleCount = 0;
    while (!done && x >= 0 && x < this.width) {
      let slopePerCell: number = 1 / iteration;
      let halfSlope: number = slopePerCell * 0.5;
      let processedCell: number = Math.floor((minAngle + halfSlope) / slopePerCell);
      let yMin: number = Math.max(0, yPov - iteration);
      let yMax: number = Math.min(this.height - 1, yPov + iteration);
      done = true;
      for (let y: number = yPov + processedCell * dy; y >= yMin && y <= yMax; y += dy) {
        let centreSlope: number = processedCell * slopePerCell;
        let startSlope: number = centreSlope - halfSlope;
        let endSlope: number = centreSlope + halfSlope;
        let visible: boolean = true;
        let extended: boolean = false;
        if (lastLineObstacleCount > 0 && !fov[x][y]) {
          let idx: number = 0;
          if (visible && !this.canSee(fov, x - dx, y)
              && y - dy >= 0 && y - dy < this.height && !this.canSee(fov, x - dx, y - dy)) {
            visible = false;
          } else {
            while (visible && idx < lastLineObstacleCount) {
              if (this.startAngle[idx] > endSlope || this.endAngle[idx] < startSlope) {
                ++idx;
              } else {
                if (this.isTransparent(x, y)) {
                  if (centreSlope > this.startAngle[idx] && centreSlope < this.endAngle[idx]) {
                    visible = false;
                  }
                } else {
                  if (startSlope >= this.startAngle[idx] && endSlope <= this.endAngle[idx]) {
                    visible = false;
                  } else {
                    this.startAngle[idx] = Math.min(this.startAngle[idx], startSlope);
                    this.endAngle[idx] = Math.max(this.endAngle[idx], endSlope);
                    extended = true;
                  }
                }
                ++idx;
              }
            }
          }
        }
        if (visible) {
          fov[x][y] = true;
          done = false;
          // if the cell is opaque, block the adjacent slopes
          if (!this.isTransparent(x, y)) {
            if (minAngle >= startSlope) {
              minAngle = endSlope;
              // if min_angle is applied to the last cell in line, nothing more
              // needs to be checked.
              if (processedCell === iteration) {
                done = true;
              }
            } else if (!extended) {
              this.startAngle[totalObstacleCount] = startSlope;
              this.endAngle[totalObstacleCount] = endSlope;
              totalObstacleCount++;
            }
            if (!lightWalls) {
              fov[x][y] = false;
            }
          }
        }
        processedCell++;
      }
      if (iteration === maxRadius) {
        done = true;
      }
      iteration++;
      lastLineObstacleCount = totalObstacleCount;
      x += dx;
      if (x < 0 || x >= this.width) {
        done = true;
      }
    }
    return fov;
  }

  private canSee(fov: boolean[][], x: number, y: number) {
    return fov[x][y] && this.isTransparent(x, y);
  }
}
