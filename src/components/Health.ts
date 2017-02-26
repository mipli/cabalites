import {Component} from './Component';

export class Health extends Component {
  get type() {
    return 'health';
  }

  private _max: number;
  private _current: number;

  get max() { return this._max; }
  get current() { return this._current; }

  constructor(max: number) {
    super();
    this._max = max;
    this._current = max;
  }

  modify(mod: number) {
    this._current += mod;
    if (this._current > this._max) {
      this._current = this._max;
    }
  }
}
