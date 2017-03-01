import {Component} from './Component';

export class Strength extends Component {
  get type() {
    return 'strength';
  }

  private _value: number;
  get value() { return this._value; }
  set value(val: number) { this._value = val; }

  constructor(val: number) {
    super();
    this._value = val;
  }
}
