import * as Core from '../core';

enum Direction {
  None = 1,
  North,
  East,
  South,
  West,
}

export namespace Utils {
  function carveable(map: number[][], position: Core.Vector2) {
    if (position.x < 0 || position.x > map.length - 1) {
      return false;
    }
    if (position.y < 0 || position.y > map[0].length - 1) {
      return false;
    }
    return map[position.x][position.y] === 1;
  }

  export function getNeighbours(pos: Core.Vector2, width: number, height: number, onlyCardinal: boolean = false): Core.Vector2[] {
    let x = pos.x;
    let y = pos.y;
    let positions = [];
    if (x > 0) {
      positions.push(new Core.Vector2(x - 1, y));
    }
    if (x < width - 1) {
      positions.push(new Core.Vector2(x + 1, y));
    }
    if (y > 0) {
      positions.push(new Core.Vector2(x, y - 1));
    }
    if (y < height - 1) {
      positions.push(new Core.Vector2(x, y + 1));
    }
    if (!onlyCardinal) {
      if (x > 0 && y > 0) {
        positions.push(new Core.Vector2(x - 1, y - 1));
      }
      if (x > 0 && y < height - 1) {
        positions.push(new Core.Vector2(x - 1, y + 1));
      }
      if (x < width - 1 && y < height - 1) {
        positions.push(new Core.Vector2(x + 1, y + 1));
      }
      if (x < width - 1 && y > 0) {
        positions.push(new Core.Vector2(x + 1, y - 1));
      }
    }
    return positions;
  }

  export function findCarveableSpot(map: number[][]) {
    const width = map.length;
    const height = map[0].length;

    let position = null;

    let carvablesPositions = [];

    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        let position = new Core.Vector2(Core.Random.get(0, width), Core.Random.get(0, height));
        if (Utils.canCarve(map, position, 0, true)) {
          carvablesPositions.push(position);
        }
      }
    }

    if (carvablesPositions.length > 0) {
      return Core.Random.getRandomIndex(carvablesPositions);
    }
    return null;
  }

  export function countSurroundingTiles(map: number[][], position: Core.Vector2, checkDiagonals: boolean = false): number {
    let connections = 0;
    return this.getNeighbours(position, map.length, map[0].length, !checkDiagonals).filter((pos: Core.Vector2) => {
      return map[pos.x][pos.y] === 0;
    }).length;
  }

  export function canCarve(map: number[][], position: Core.Vector2, allowedConnections: number = 0, checkDiagonals: boolean = false): boolean {
    if (!carveable(map, position)) {
      return false;
    }
    return this.countSurroundingTiles(map, position, checkDiagonals) <= allowedConnections;
  }

  export function canExtendTunnel(map: number[][], position: Core.Vector2) {
    if (!carveable(map, position)) {
      return false;
    }
    let connectedFrom = Direction.None;
    let connections = 0;

    if (position.y > 0 && map[position.x][position.y - 1] === 0) {
      connectedFrom = Direction.North;
      connections++;
    }
    if (position.y < map[0].length - 1 && map[position.x][position.y + 1] === 0) {
      connectedFrom = Direction.South;
      connections++;
    }
    if (position.x > 0 && map[position.x - 1][position.y] === 0) {
      connectedFrom = Direction.West;
      connections++;
    }
    if (position.x < map.length - 1 && map[position.x + 1][position.y] === 0) {
      connectedFrom = Direction.East;
      connections++;
    }

    if (connections > 1) {
      return false;
    }

    return canExtendTunnelFrom(map, position, connectedFrom);
  }

  export function canExtendTunnelFrom(map: number[][], position: Core.Vector2, direction: Direction) {
    if (map[position.x][position.y] === 0) {
      return false;
    }

    switch (direction) {
      case Direction.South:
        return carveable(map, new Core.Vector2(position.x - 1, position.y))
                && carveable(map, new Core.Vector2(position.x - 1, position.y - 1))
                && carveable(map, new Core.Vector2(position.x, position.y - 1))
                && carveable(map, new Core.Vector2(position.x + 1, position.y - 1))
                && carveable(map, new Core.Vector2(position.x + 1, position.y));
      case Direction.North:
        return carveable(map, new Core.Vector2(position.x + 1, position.y))
                && carveable(map, new Core.Vector2(position.x + 1, position.y + 1))
                && carveable(map, new Core.Vector2(position.x, position.y + 1))
                && carveable(map, new Core.Vector2(position.x - 1, position.y + 1))
                && carveable(map, new Core.Vector2(position.x - 1, position.y));
      case Direction.West:
        return carveable(map, new Core.Vector2(position.x, position.y - 1))
                && carveable(map, new Core.Vector2(position.x + 1, position.y - 1))
                && carveable(map, new Core.Vector2(position.x + 1, position.y))
                && carveable(map, new Core.Vector2(position.x + 1, position.y + 1))
                && carveable(map, new Core.Vector2(position.x, position.y + 1));
      case Direction.East:
        return carveable(map, new Core.Vector2(position.x, position.y - 1))
                && carveable(map, new Core.Vector2(position.x - 1, position.y - 1))
                && carveable(map, new Core.Vector2(position.x - 1, position.y))
                && carveable(map, new Core.Vector2(position.x - 1, position.y + 1))
                && carveable(map, new Core.Vector2(position.x, position.y + 1));
      case Direction.None:
        return carveable(map, new Core.Vector2(position.x, position.y - 1))
                && carveable(map, new Core.Vector2(position.x - 1, position.y))
                && carveable(map, new Core.Vector2(position.x, position.y + 1))
                && carveable(map, new Core.Vector2(position.x + 1, position.y));
    }
    return false;
  }
}
