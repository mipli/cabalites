import {IReactiveSystem} from './systems';
import {EntityManager} from '../EntityManager';
import * as Actions from '../actions';
import * as Components from '../components'
import * as Map from '../map';
import * as Core from '../core';

export class CollisionSystem implements IReactiveSystem {
  get priority() {
    return 10;
  }
  private entityManager: any;
  private map: Map.Map;

  constructor(entityManager: EntityManager, map: Map.Map) {
    this.entityManager = entityManager;
    this.map = map;
  }

  process(action: Actions.IAction): Actions.IAction {
    if (action.type !== 'walk') {
      return action;
    }
    const walkAction: Actions.WalkAction = <Actions.WalkAction>action;
    const tile = this.map.getTile(walkAction.newPosition);
    if (!this.map.isWalkable(walkAction.newPosition, walkAction.direction)) {
      walkAction.cancelled = true;
    }

    if (!walkAction.cancelled) {
      const entities = tile.getEntities();
      entities.some((entity) => {
        const flags = <Components.Flags>this.entityManager.getComponent(entity, 'flags');
        if (flags.isCollidable) {
          walkAction.cancelled = true;
          return true;
        }
        return false;
      });
    }
    return walkAction;
  }
}
