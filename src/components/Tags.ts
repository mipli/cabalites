import {Component} from './Component';
import {EntityManager} from '../EntityManager';

interface ITags {
  player?: boolean
}

export class Tags extends Component {
  get type() {
    return 'tags';
  }

  private entityManager: EntityManager;
  private _tags: ITags;
  get tags(): any {
    return this._tags;
  }

  get isPlayer() {
    return this._tags.player === true;
  }
  set player(value: boolean) {
    this._tags.player = value;
    this.entityManager.assimilateTags(this.entity);
  }

  constructor(tags: ITags) {
    super();
    this.entityManager = EntityManager.getInstance();
    this._tags = tags;
  }

  initialize() {
    this.entityManager.assimilateTags(this.entity);
  }

  delete() {
    this.entityManager.deleteTags(this.entity, this.toStringArray());
  }

  toStringArray() {
    const tags = [];
    for (let tag in this.tags) {
      tag = <string>tag;
      if (this.tags[tag] === true) {
        tags.push(tag);
      }
    }
    return tags;
  }
}
