import * as Actions from './actions';
import * as Components from './components';

export interface IController {
  getActions(turnTaker: Components.TurnTaker, callback: (actions: Actions.IAction[]) => void): void;
}
