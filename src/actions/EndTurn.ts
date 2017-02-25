import {IEntity, EntityManager} from '../EntityManager';
import {IAction} from './IAction';
import * as Components from '../components';
import * as Core from '../core';
import * as Actions from './index';

export class EndTurnAction implements IAction {
  get type() {
    return 'endTurn';
  }
  get cost() {
    return 0;
  }

  private _cancelled: boolean;
  private _entity: IEntity;

  get entity() { return this._entity; }

  get cancelled() { return this._cancelled; }
  set cancelled(value) {
    this._cancelled = value;
  }

  constructor(entity: IEntity) { 
    this._entity = entity;
    this._cancelled = false;
  }

  perform(): boolean {
    return true;
  }
}
