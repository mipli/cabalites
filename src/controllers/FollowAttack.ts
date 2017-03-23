import {IController} from './IController';
import {IEntity, EntityManager} from '../EntityManager';
import * as Actions from '../actions';
import * as Core from '../core';
import * as Components from '../components';

export class FollowAttackController implements IController {
  private entity: IEntity;
  private factionComponent: Components.Faction;
  private knowledgeComponent: Components.Knowledge

  constructor(entity: IEntity) { 
    this.entity = entity;
    this.factionComponent = <Components.Faction>EntityManager.getInstance().getComponent(this.entity, 'faction');
    this.knowledgeComponent = <Components.Knowledge>EntityManager.getInstance().getComponent(this.entity, 'Knowledge');
  }

  getActions(turnTaker: Components.TurnTaker, callback: (actions: Actions.IAction[]) => void) {
    turnTaker.active = false;
  }
}
