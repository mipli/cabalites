import {Component} from './Component';
import * as Map from '../map';

export class Renderable extends Component {
  get type() {
    return 'renderable';
  }

  private _glyph: Map.Glyph

  get glyph() {
    return this._glyph;
  }

  constructor(glyph: Map.Glyph) {
    super();
    this._glyph = glyph;
  }
}
