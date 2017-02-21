import {Component} from './Component';
import {IEntity} from '../EntityManager';

export interface OpenAction {
  (entity: IEntity): boolean
}

export class Openable extends Component {
  get type() {
    return 'openable';
  }

  private openAction: OpenAction;

  constructor(openAction: OpenAction) {
    super();
    this.openAction = openAction;
  }

  open() {
    return this.openAction(this.entity);
  }
}
