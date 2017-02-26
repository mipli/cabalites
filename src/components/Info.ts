import {Component} from './Component';

interface Information {
  name?: string,
  entityType?: string
}

export class Info extends Component {
  get type() {
    return 'info';
  }

  private _name: string;
  get name() { return this._name; }
  set name(value: string) { this._name = value; }

  private _entityType: string;
  get entityType() { return this._entityType; }
  set entityType(value: string) { this._entityType = value; }

  constructor(data: Information) {
    super();
    this._name = data.name;
    this._entityType = data.entityType;
  }
}
