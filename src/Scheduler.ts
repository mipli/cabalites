import {IEntity, EntityManager} from './EntityManager';

export class Scheduler {
  private static instance: Scheduler;
  private _turn: number;
  get turn() { return this._turn; }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Scheduler();
    }
    return this.instance;
  }

  private entityManager: EntityManager;

  private entities: IEntity[];
  private nextIndex: number;

  private constructor() {
    this.entityManager = EntityManager.getInstance();
    this.entities = [];
    this.nextIndex = 0;
    this._turn = 1;
  }

  addEntity(entity: IEntity) {
    this.entities.push(entity);
  }

  removeEntity(entity: IEntity) {
    let idx = -1;
    this.entities.forEach((e, index) => {
      if (e.guid === entity.guid) {
        idx = index;
      }
    });
    if (idx >= 0) {
     this.entities.splice(idx, 1);
     this.nextIndex = Math.max(0, this.nextIndex - 1);
    }
  }

  tick(): IEntity {
    const entity = this.entities[this.nextIndex];

    return entity;
  }

  tickDone() {
    this.nextIndex = (this.nextIndex + 1) % this.entities.length;
    if (this.nextIndex === 0) {
      this._turn++;
    }
  }
}
