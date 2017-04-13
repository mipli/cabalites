import {IController} from './IController';
import {IEntity, EntityManager} from '../EntityManager';
import * as Actions from '../actions';
import * as Core from '../core';
import * as Components from '../components';
import * as Map from '../map';
import Game from '../Game';

export class FollowAttackController implements IController {
  private entity: IEntity;
  private positionComponent: Components.Position;
  private factionComponent: Components.Faction;
  private knowledgeComponent: Components.Knowledge
  private sightComponent: Components.Sight
  private entityManager: EntityManager;
  private map: Map.Map;

  constructor(entity: IEntity) { 
    this.entity = entity;
    this.entityManager = EntityManager.getInstance();
    this.factionComponent = <Components.Faction>this.entityManager.getComponent(this.entity, 'faction');
    this.sightComponent = <Components.Sight>this.entityManager.getComponent(this.entity, 'sight');
    this.positionComponent = <Components.Position>this.entityManager.getComponent(this.entity, 'position');
    this.knowledgeComponent = <Components.Knowledge>this.entityManager.getComponent(this.entity, 'knowledge');
    this.map = Game.getInstance().map;
  }

  getActions(turnTaker: Components.TurnTaker, callback: (actions: Actions.IAction[]) => void) {
    let target: Core.Vector2 = null;
    for (let obj of this.entityManager.iterateEntitiesAndComponentsWithinRadius(this.positionComponent.vector, this.sightComponent.radius, ['position', 'faction'])) {
      if (obj.entity.guid === this.entity.guid) {
        continue;
      }
      const targetFaction = <Components.Faction>(<any>obj.components).faction;
      const targetPosition = <Components.Position>(<any>obj.components).position;

      if (this.positionComponent.vector.distanceSquared(targetPosition.vector) <= 2) {
        continue;
      }

      if (this.knowledgeComponent.store.isTileVisible(targetPosition.vector) && 
          !this.factionComponent.isFriendlyWith(targetFaction.reputations)) {
          target = targetPosition.vector;
      }
    }
    const actions = [];
    if (target) {
      const path = this.map.findPath(this.positionComponent.vector, target);
      console.log('start', this.positionComponent.vector.toString());
      path.forEach((p) => {
        if (!p) {
          console.log('null');
          return;
        }
        console.log(p.toString());
      });
      console.log('end', target.toString());
      if (path.length > 1) {
        const direction = Core.Directions.getDirectionTowards(this.positionComponent.vector, path[1]);
        if (direction) {
          actions.push(new Actions.WalkAction(this.entity, direction));
        }
      }
    }
    actions.push(new Actions.EndTurnAction(this.entity));
    callback(actions);
  }
}
