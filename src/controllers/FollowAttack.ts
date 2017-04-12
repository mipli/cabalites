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
  private map: Map.Map;

  constructor(entity: IEntity) { 
    this.entity = entity;
    this.factionComponent = <Components.Faction>EntityManager.getInstance().getComponent(this.entity, 'faction');
    this.positionComponent = <Components.Position>EntityManager.getInstance().getComponent(this.entity, 'position');
    this.knowledgeComponent = <Components.Knowledge>EntityManager.getInstance().getComponent(this.entity, 'knowledge');
    this.map = Game.getInstance().map;
  }

  getActions(turnTaker: Components.TurnTaker, callback: (actions: Actions.IAction[]) => void) {
    for (let pos of this.knowledgeComponent.store.iterateVisiblePositions()) {
      if (pos.equals(this.positionComponent.vector)) {
        continue;
      }
      const tile = this.map.getTile(pos);
      const entities = tile.getEntities();
      if (entities.length === 0) {
        continue;
      }
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        const targetFaction = <Components.Faction>EntityManager.getInstance().getComponent(entity, 'faction');
        if (targetFaction && !this.factionComponent.isFriendlyWith(targetFaction.reputations)) {
          console.log(pos, entity);
        }
      }
    }
    callback([
      new Actions.WalkAction(this.entity, Core.Random.getRandomIndex(Core.Directions.All))
    ]);
  }
}
