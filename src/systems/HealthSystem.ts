import {IContinuousSystem} from './systems';
import {EntityManager} from '../EntityManager';
import * as Components from '../components'
import * as Actions from '../actions';

export class HealthSystem implements IContinuousSystem {
  get priority() {
    return 1;
  }

  private entityManager: EntityManager;

  constructor() {
    this.entityManager = EntityManager.getInstance();
  }

  process(action: Actions.IAction) {
    for (let obj of this.entityManager.iterateEntityAndComponents(['health'])) {
      const health = <Components.Health>(<any>obj.components).health;
      if (health.current <= 0) {
        this.entityManager.deleteEntity(obj.entity);
      }
    }
  }
}
