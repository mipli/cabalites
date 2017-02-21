import {Component} from './Component';
import * as Map from '../map';

export class Renderable extends Component {
  get type() {
    return 'renderable';
  }

  private _glyph: Map.Glyph
  private _level: number;

  get glyph() { return this._glyph; }
  get level() { return this._level; }
  set level(value) { this._level = value; }

  constructor(glyph: Map.Glyph, level: number = 1) {
    super();
    this._glyph = glyph;
    this._level = level;
  }
}
