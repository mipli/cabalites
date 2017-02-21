import * as Core from '../../core';
import * as Map from '../index';

export class DungeonGenerator {
  private width: number;
  private height: number;

  private backgroundColor: Core.Color;
  private foregroundColor: Core.Color;

  private _rooms: Map.Room[];

  get rooms() { return this._rooms }


  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.backgroundColor = 0x000000;
    this.foregroundColor = 0xaaaaaa;
  }

  private generateMap(): number[][] {
    let cells: number[][] = Core.Utils.buildMatrix(this.width, this.height, 1);
    const roomGenerator = new Map.RoomGenerator(cells);

    roomGenerator.generate();
    cells = roomGenerator.getCells();

    this._rooms = roomGenerator.getRooms();

    const mazeGenerator = new Map.MazeRecursiveBacktrackGenerator(cells);
    mazeGenerator.generate();
    cells = mazeGenerator.getCells();

    cells = mazeGenerator.getCells();

    let topologyCombinator = new Map.TopologyCombinator(cells, this._rooms);
    topologyCombinator.initialize();
    let remainingTopologies = topologyCombinator.combine();
    if (remainingTopologies > 5) {
      console.log('remaining topologies', remainingTopologies);
      return null;
    }
    topologyCombinator.pruneDeadEnds();

    return topologyCombinator.getCells();
  }

  generate(): Map.Map {
    let map = new Map.Map(this.width, this.height);
    let cells = null;
    let attempts = 0;
    while (cells === null) {
      attempts++;
      cells = this.generateMap();
      if (attempts > 100) {
        throw 'Could not generate dungeon';
      }
    }

    let tile: Map.Tile;
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        if (cells[x][y] === 0) {
          tile = Map.Tile.createTile(Map.Tile.FLOOR);
        } else {
          tile = Map.Tile.createTile(Map.Tile.WALL);
        }
        map.setTile(new Core.Vector2(x, y), tile);
      }
    }

    return map;
  }
}
