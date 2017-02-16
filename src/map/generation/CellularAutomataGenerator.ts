import * as Core from '../../core';
import * as Map from '../index';

interface CellularAutomataOptions {
  starvationLimit: number;
  overpopulationLimit: number;
  revivalNumber: number;
};

export class CellularAutomataGenerator {
  private width: number;
  private height: number;

  private stack: Core.Vector2[];

  private cells: number[][];

  private starvationLimit: number;
  private overpopulationLimit: number;
  private revivalNumber: number;
  private iterations: number;

  constructor(cells: number[][], iterations: number = 5, options: CellularAutomataOptions = {
    starvationLimit: 4,
    overpopulationLimit: 7,
    revivalNumber: 8
  }) {
    this.cells = cells;
    this.width = this.cells.length;
    this.height = this.cells[0].length;

    this.iterations = iterations;
    this.starvationLimit = options.starvationLimit;
    this.overpopulationLimit = options.overpopulationLimit;
    this.revivalNumber = options.revivalNumber;
  }


  generate() {
    for (var i = 0; i < this.iterations; i++) {
      this.iterate();
    }
  }

  private iterate() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let aliveNeighbours = Map.Utils.getNeighbours(new Core.Vector2(x, y), this.width, this.height).
          filter((neighbour: Core.Vector2) => {
            return this.cells[neighbour.x][neighbour.y] == 0;
          }).
          length;

        let isAlive = this.cells[x][y] === 0;

        if (!isAlive && aliveNeighbours >= this.revivalNumber) {
          this.cells[x][y] = 0;
        } else if (isAlive && aliveNeighbours <= this.starvationLimit) {
          this.cells[x][y] = 1;
        } else if (isAlive && aliveNeighbours >= this.overpopulationLimit) {
          this.cells[x][y] = 1;
        }
      }
    }
  }


  getCells() {
    return this.cells;
  }
}
