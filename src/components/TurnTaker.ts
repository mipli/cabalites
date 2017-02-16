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
    const action = this.controller.getAction();
    return {
      action: action,
      time: 100
    }
  }
}
