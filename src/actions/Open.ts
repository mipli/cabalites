import * as Components from '../components';
import * as Core from '../core';
import * as Map from '../map';
import {IAction} from './IAction';
import {IEntity, EntityManager} from '../EntityManager';
import Game from '../Game';

export class OpenAction implements IAction {
  get type() {
    return 'open';
  }
  get cost() {
    return 1;
  }

  private _position: Core.Vector2;
  private _targetPosition: Core.Vector2;
  private _direction: Core.DirectionInfo;
  private _entity: IEntity;
  private _targetEntity: IEntity;
  private _map: Map.Map;
  private entityManager: EntityManager;
  private positionComponent: Components.Position;
  private openableComponent: Components.Openable;

  private _cancelled: boolean;

  get entity() {
    return this._entity;
  }

  get position() {
    return this._position;
  }

  get map() {
    return this._map;
  }

  get targetPosition() {
    return this._targetPosition;
  }

  get targetEntity() {
    return this._targetEntity;
  }

  get cancelled() {
    return this._cancelled;
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
    this._targetPosition = this.positionComponent.vector.add(dir.vector);

    this._map = Game.getInstance().map;

    const tile: Map.Tile = this.map.getTile(this.targetPosition);
    const entities = tile.getEntities();
    for(let i = 0; i < entities.length; i++) {
      const e = entities[i];
      const openableComponent = <Components.Openable>this.entityManager.getComponent(e, 'openable');
      if (openableComponent) {
        this._targetEntity = e;
        this.openableComponent = openableComponent;
      }
    }
  }

  perform() {
    if (!this.openableComponent) {
      return false;
    }
    this.openableComponent.open();
    return true;
  }
}
