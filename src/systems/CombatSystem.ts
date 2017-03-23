import {IReactiveSystem} from './systems';
import {EntityManager} from '../EntityManager';
import * as Actions from '../actions';
import * as Components from '../components'
import * as Map from '../map';
import * as Core from '../core';

export class CombatSystem implements IReactiveSystem {
  get priority() {
    return 10;
  }
  private entityManager: any;

  constructor() {
    this.entityManager = EntityManager.getInstance();
  }

  process(action: Actions.IAction): Actions.IAction {
    if (action.type === 'meleeAttack') {
      return this.processMeleeAttack(action);
    }
    return action;
  }

  private processMeleeAttack(action: Actions.IAction): Actions.IAction {
    const meleeAttackAction = <Actions.MeleeAttackAction>action;

    if (!meleeAttackAction.targetEntity || !meleeAttackAction.entity) {
      meleeAttackAction.cancelled = true;
      return meleeAttackAction;
    }

    const attackerFaction = <Components.Faction>EntityManager.getInstance().getComponent(meleeAttackAction.entity, 'faction');
    const attackerStrength = <Components.Strength>EntityManager.getInstance().getComponent(meleeAttackAction.entity, 'strength');

    const targetFaction = <Components.Faction>EntityManager.getInstance().getComponent(meleeAttackAction.targetEntity, 'faction');
    const targetHealth = <Components.Health>EntityManager.getInstance().getComponent(meleeAttackAction.targetEntity, 'health');

    if (attackerFaction && targetFaction && attackerFaction.isFriendlyWith(targetFaction.reputations)) {
      meleeAttackAction.cancelled = true;
      return meleeAttackAction;
    }

    if (!targetHealth || !attackerStrength) {
      meleeAttackAction.cancelled = true;
      return meleeAttackAction;
    }

    targetHealth.modify(-attackerStrength.value);
    return meleeAttackAction;
  }
}
