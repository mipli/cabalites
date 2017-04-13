import {PriorityQueue} from '../containers';
import * as Core from '../core';

interface distanceFunction {
  (a: Core.Vector2, b: Core.Vector2): number;
}

export class Astar {
  constructor(
    private walkableCheck: (pos: Core.Vector2) => boolean,
    private distance: distanceFunction
  ) {
  }

  private static createPositionSorter = (target: Core.Vector2, dist: distanceFunction) => {
    return (a: Core.Vector2, b: Core.Vector2) => {
      const aDistance = dist(a, target);
      const bDistance = dist(b, target);
      return bDistance - aDistance;
    };
  };

  private getNeighbours(position: Core.Vector2): Core.Vector2[] {
    const neighbours: Core.Vector2[] = [];
    Core.Directions.All.forEach((dir: Core.DirectionInfo) => {
      neighbours.push(position.add(dir.vector));
    });
    return neighbours;
  }

  findPath(start: Core.Vector2, target: Core.Vector2): Core.Vector2[] {
    if (start.equals(target)) {
      return [];
    }

    let path = []
    let frontier = new PriorityQueue<Core.Vector2>(Astar.createPositionSorter(target, this.distance));
    let cameFrom: {[pos: string]: Core.Vector2} = {};

    frontier.enqueue(start);

    cameFrom[start.toString()] = null;

    while(!frontier.isEmpty) {
      let current = frontier.dequeue();

      if (current.equals(target)) {
        break;
      }

      let neighbours = this.getNeighbours(current);
      neighbours.forEach((neighbour) => {
        if (!this.walkableCheck(neighbour)) {
          return;
        }
        if (cameFrom[neighbour.toString()]) {
          return;
        }

        frontier.enqueue(neighbour);
        cameFrom[neighbour.toString()] = current;
      });
    }

    let pathNode = target;
    path.push(pathNode);
    while (pathNode && !pathNode.equals(start)) {
        pathNode = cameFrom[pathNode.toString()];
        path.unshift(pathNode);
    }

    return path;
  }


}
