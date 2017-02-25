import {Component} from './Component';

export class Name extends Component {
  get type() {
    return 'name';
  }

  private _name: string;
  get name() { return this._name; }
  set name(value: string) { this._name = value; }

  constructor(name: string) {
    super();
    this._name = name;
  }
}
