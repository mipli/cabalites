import * as Components from '../components';
import * as Core from '../core';
import * as Actions from './index';
import {IAction} from './IAction';
import {IEntity, EntityManager} from '../EntityManager';

export class WalkAction implements IAction {
  get type() {
    return 'walk';
  }
  private _newPosition: Core.Vector2;
  private _position: Core.Vector2;
  private _entity: IEntity;
  private _direction: Core.DirectionInfo;
  private entityManager: EntityManager;
  private positionComponent: Components.Position;

  private _cancelled: boolean;

  get entity() {
    return this._entity;
  }

  get position() {
    return this._position;
  }

  get newPosition() {
    return this._newPosition;
  }

  get cancelled() {
    return this._cancelled;
  }

  get direction() {
    return this._direction; 
  }

  set cancelled(value) {
    this._cancelled = value;
  }

  constructor(entity: IEntity, dir: Core.DirectionInfo) {
    this._direction = dir;
    this._cancelled = false;
    this._entity = entity;
    this.entityManager = EntityManager.getInstance();

    this.positionComponent = <Components.Position>this.entityManager.getComponent(this.entity, 'position');

    this._position = this.positionComponent.vector;
    this._newPosition = this.positionComponent.vector.add(dir.vector);
  }

  perform(): boolean {
    this.positionComponent.set(this.newPosition);
    return true;
  }
}
