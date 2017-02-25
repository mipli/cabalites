import {Component} from './Component';
import {Scheduler} from '../Scheduler';
import * as Controllers  from '../controllers';
import * as Actions from '../actions';

export class TurnTaker extends Component {
  get type() {
    return 'turnTaker';
  }
  private previousTurn: number;

  private _active: boolean;
  get active() { return this._active; }
  set active(value: boolean) { this._active = value; }

  private _maxActionPoints: number;
  private _currentActionPoints: number;

  get maxActionPoints() { return this._maxActionPoints; }
  get currentActionPoints() { return this._currentActionPoints; }

  constructor(private controller: Controllers.IController) {
    super();
    this._maxActionPoints = 10;
    this._currentActionPoints = 10;
    this.previousTurn = -1;
    this._active = false;
  }

  takeTurn(turn: number, callback: (actions: Actions.IAction[]) => void) {
    if (!this._active) {
      this._active = true;
      if (this.previousTurn < turn) {
        this.refreshActionPoints();
        this.previousTurn = turn;
      }
      this.controller.getActions(this, callback);
    }
  }

  refreshActionPoints() {
    this._currentActionPoints = this._maxActionPoints;
  }

  useActionPoints(n: number) {
    this._currentActionPoints -= n;
    if (this._currentActionPoints < 0) {
      throw "Less than zero action points, should not be possible!";
    }
  }

  initialize() {
    Scheduler.getInstance().addEntity(this.entity);
  }

  delete() {
    Scheduler.getInstance().removeEntity(this.entity);
  }
}
