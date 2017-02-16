import {IAction} from './IAction';

export default class ActionResult {
  private result: boolean | IAction;

  constructor(result: boolean | IAction) {
    this.result = result;
  }

  get succeeded(): boolean {
    return this.result === true;
  }

  get failed(): boolean {
    return this.result === false;
  }

  get alternate(): IAction {
    if (typeof this.result === 'boolean') {
      return undefined;
    }
    return this.result;
  }
}
