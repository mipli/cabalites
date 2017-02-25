import {IEntity} from '../EntityManager';
import {IContinuousSystem} from './systems';
import * as Actions from '../actions';

interface ActionLog {
  entity: IEntity,
  action: Actions.IAction
}

export class ActionLogSystem implements IContinuousSystem {
  get priority() {
    return 1000;
  }

  private _actions: ActionLog[];
  get actions() {
    return this._actions;
  }

  constructor() {
    this._actions = [];
  }

  process(action: Actions.IAction) {
    if (!action) {
      return;
    }
    this._actions.push({
      entity: action.entity,
      action: action
    });
  }
}

