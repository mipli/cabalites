import {Component} from './Component';
import KnowledgeStore from '../KnowledgeStore';
import * as Core from '../core';

export class Knowledge extends Component {
  get type() {
    return 'knowledge';
  }

  private _store: KnowledgeStore;
  get store() { return this._store; }

  constructor(store?: KnowledgeStore) {
    super();
    this._store = store ? store : new KnowledgeStore();
  }

  markAsSeen(position: Core.Vector2) {
    this._store.markAsSeen(position);
  }

  hasSeen(position: Core.Vector2): boolean {
    return this._store.hasSeen(position);
  }

  markAsVisible(position: Core.Vector2) {
    this._store.markAsVisible(position);
  }

  markAsNonVisible(position: Core.Vector2) {
    this._store.markAsNonVisible(position);
  }
}
