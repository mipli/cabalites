import {Component} from './Component';
import KnowledgeStore from '../KnowledgeStore';
import * as Core from '../core';

export class Knowledge extends Component {
  get type() {
    return 'knowledge';
  }

  private store: KnowledgeStore;

  constructor(store?: KnowledgeStore) {
    super();
    this.store = store ? store : new KnowledgeStore();
  }

  markAsSeen(position: Core.Vector2) {
    this.store.markAsSeen(position);
  }

  hasSeen(position: Core.Vector2): boolean {
    return this.store.hasSeen(position);
  }

  markAsVisible(position: Core.Vector2) {
    this.store.markAsVisible(position);
  }

  markAsNonVisible(position: Core.Vector2) {
    this.store.markAsNonVisible(position);
  }
}
