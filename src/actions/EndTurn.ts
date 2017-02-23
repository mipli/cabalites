import * as Components from '../components';
import * as Core from '../core';
import * as Actions from './index';
import {IAction} from './IAction';
import {IEntity, EntityManager} from '../EntityManager';

export class EndTurnAction implements IAction {
  get type() {
    return 'endTurn';
  }
  get cost() {
    return 0;
  }

  private _cancelled: boolean;

  get cancelled() {
    return this._cancelled;
  }

  set cancelled(value) {
    this._cancelled = value;
  }

  constructor() { 
    this._cancelled = false;
  }

  perform(): boolean {
    return true;
  }
}
