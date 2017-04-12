import {IEntity} from './EntityManager';
import {PriorityQueue} from './containers';

interface Schedulee {
  entity: IEntity,
  time: number,
  queueInsertionCount: number
}

export class Scheduler {
  private static instance: Scheduler;
  private _time: number;
  private waiting: boolean;
  private queueInsertionCount: number;
  get time() { return this._time; }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Scheduler();
    }
    return this.instance;
  }

  private deletedEntities: IEntity[];
  private instantaneousEntities: IEntity[];


  private queue: PriorityQueue<Schedulee>;

  private constructor() {
    this.deletedEntities = [];
    this.instantaneousEntities = [];
    this.queueInsertionCount = 0;
    this._time = 0;
    this.waiting = false;;
    this.queue = new PriorityQueue<Schedulee>((a: Schedulee, b: Schedulee) => {
      if (a.time < b.time) {
        return -1;
      } else if (a.time > b.time) {
        return 1;
      }
      if (a.queueInsertionCount < b.queueInsertionCount) {
        return -1;
      } else if (a.queueInsertionCount > b.queueInsertionCount) {
        return 1;
      }
      return 0;
    });
  }

  add(entity: IEntity, time: number) {
    this.queue.enqueue({
      entity: entity,
      time: this._time + time,
      queueInsertionCount: this.queueInsertionCount++
    });
  }

  addInstantaneous(entity: IEntity) {
    this.instantaneousEntities.push(entity);
  }

  tick(): IEntity {
    if (this.waiting) {
      return null;
    }
    if (this.instantaneousEntities.length > 0) {
      this.waiting = true;
      return this.instantaneousEntities.pop();
    }
    const schedulee = this.queue.dequeue();
    if (!schedulee) {
      return null;
    }
    this._time = schedulee.time;
    const entity = schedulee.entity;

    const deleted = this.deletedEntities.find((e) => {
      return e.guid === entity.guid;
    });
    if (deleted) {
      return this.tick();
    }

    this.waiting = true;

    return entity;
  }

  remove(entity: IEntity) {
    this.deletedEntities.push(entity);
  }

  tickDone() {
    this.waiting = false;
  }
}
