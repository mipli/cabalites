import {Component} from './Component';
import {IController} from '../IController.ts';

export class TurnTaker extends Component {
  get type() {
    return 'turnTaker';
  }

  constructor(private controller: IController) {
    super();
  }

  takeTurn() {
    const actions = this.controller.getActions();
    return {
      actions: actions,
      time: 100
    }
  }
}
