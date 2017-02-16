import {IEntity} from '../EntityManager';

export class Component {
  private _entity: IEntity;
  get entity() {
    return this._entity;
  }

  get type(): string {
    throw "Error: Component.type needs to be reimplemented in child class";
  }

  registerEntity(entity: IEntity) {
    this._entity = entity;
  }
  
  initialize() { }
}
