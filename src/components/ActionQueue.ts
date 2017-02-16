import {IComponent} from './IComponent';

export class ActionQueue implements IComponent {
  private actions: any[];

  get type() {
    return 'action-queue';
  }

  constructor() {
    this.actions = [];
  }

  add(action: any) {
    this.actions.push(action);
  }

  get(): any {
    return this.actions.unshift();
  }
}
