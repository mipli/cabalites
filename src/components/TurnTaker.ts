import {Component} from './Component';
import {Scheduler} from '../Scheduler';
import * as Controllers  from '../controllers';
import * as Actions from '../actions';

export class TurnTaker extends Component {
  get type() {
    return 'turnTaker';
  }

  constructor(private controller: Controllers.IController) {
    super();
  }

  takeTurn(turn: number, callback: (actions: Actions.IAction[]) => void) {
    this.controller.getActions(this, callback);
  }

  initialize() {
    Scheduler.getInstance().add(this.entity, 0);
  }

  delete() {
    Scheduler.getInstance().remove(this.entity);
  }
}
