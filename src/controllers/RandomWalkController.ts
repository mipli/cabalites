import {IController} from './IController';
import {IEntity} from '../EntityManager';
import * as Actions from '../actions';
import * as Core from '../core';
import * as Components from '../components';

export class RandomWalkController implements IController {
  constructor(private entity: IEntity) { }

  getActions(turnTaker: Components.TurnTaker, callback: (actions: Actions.IAction[]) => void) {
    callback([
      new Actions.WalkAction(this.entity, Core.Random.getRandomIndex(Core.Directions.All)),
      new Actions.EndTurnAction(this.entity)
    ]);
  }
}
