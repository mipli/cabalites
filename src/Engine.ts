import {IProcessor, IProcessorSortFunction} from './processors';
import {IReactiveSystem, IContinuousSystem, IPreTurnSystem, IReactiveSystemSortFunction, IContinuousSystemSortFunction, IPreTurnSystemSortFunction} from './systems';
import * as Components from './components';
import * as Actions from './actions';
import {IEntity, EntityManager} from './EntityManager';
import {Scheduler} from './Scheduler';

import {PriorityLinkedList} from './containers';

interface FrameRenderer {
  (elapsedTime: number): void;
}
let renderer: FrameRenderer;
let frameLoop: (callback: (elapsedTime: number) => void) => void;

let frameFunc = (elapsedTime: number) => {
  frameLoop(frameFunc);
  renderer(elapsedTime);
}

let loop = (theRenderer: FrameRenderer) => {
  renderer = theRenderer;
  frameLoop(frameFunc);
}

export default class Engine {
  private static instance: Engine;

  private engineTime: number;
  private elapsedTime: number;
  private engineTickLength: number;

  private paused: boolean;

  private continuousProcessors: PriorityLinkedList<IProcessor>;
  private continuousSystems: PriorityLinkedList<IContinuousSystem>;
  private reactiveSystems: PriorityLinkedList<IReactiveSystem>;
  private preTurnSystems: PriorityLinkedList<IPreTurnSystem>;

  private renderFunction: (elapsed: number) => void;

  private _entityManager: EntityManager;
  private scheduler: Scheduler;

  get entityManager(): EntityManager {
    return this._entityManager;
  }

  private constructor() {
    frameLoop = (function() {
      return window.requestAnimationFrame ||
        (<any>window).webkitRequestAnimationFrame || (<any>window).mozRequestAnimationFrame ||
        (<any>window).oRequestAnimationFrame ||
        (<any>window).msRequestAnimationFrame ||
        function(callback: (elapsedTime: number) => void) {
          window.setTimeout(callback, 1000 / 60, new Date().getTime());
      };
    })();

    window.addEventListener('focus', () => {
      this.paused = false;
    });
    window.addEventListener('blur', () => {
      this.paused = true;
    });

    this.reset();
    this.scheduler = Scheduler.getInstance();
  }

  static getInstance(): Engine {
    if (!this.instance) {
      this.instance = new Engine();
    }
    return this.instance;
  }

  setRenderFunction(renderFunction: (elapsed: number) => void) {
    this.renderFunction = renderFunction;
  }

  reset() {
    this.paused = false;
    this.engineTime = 0;
    this.elapsedTime = 0;
    this.engineTickLength = 10; // milliseconds per engine tick
    this.continuousProcessors = new PriorityLinkedList<IProcessor>(IProcessorSortFunction);
    this.reactiveSystems = new PriorityLinkedList<IReactiveSystem>(IReactiveSystemSortFunction);
    this.preTurnSystems = new PriorityLinkedList<IPreTurnSystem>(IPreTurnSystemSortFunction);
    this.continuousSystems = new PriorityLinkedList<IContinuousSystem>(IContinuousSystemSortFunction);
    this._entityManager = EntityManager.getInstance();
  }

  addContinuousProcessor(processor: IProcessor) {
    this.continuousProcessors.push(processor);
  }

  addContinuousSystem(system: IContinuousSystem) {
    this.continuousSystems.push(system);
  }

  addReactiveSystem(system: IReactiveSystem) {
    this.reactiveSystems.push(system);
  }

  addPreTurnSystems(system: IPreTurnSystem) {
    this.preTurnSystems.push(system);
  }

  start() {
    for (let system of this.continuousSystems) {
      system.process(null);
    }
    for (let processor of this.continuousProcessors) {
      processor.process();
    }
    loop((time) => {
      if (this.paused) {
        return;
      }
      this.elapsedTime = time - this.engineTime;
      this.process(this.elapsedTime);
      this.renderFunction(time);
    });
  }

  process(time: number) {
    const entity = this.scheduler.tick();
    if (entity) {
      this.preTurn(entity);
      const turnTaker = <Components.TurnTaker>this.entityManager.getComponent(entity, 'turnTaker');
      turnTaker.takeTurn(this.scheduler.time, (actions: Actions.IAction[]) => {
        if (this.processEntityActions(turnTaker, actions)) {
          this.scheduler.add(entity, 100);
        } else {
          this.scheduler.addInstantaneous(entity);
        }
        this.scheduler.tickDone();
      });
    }
    for (let processor of this.continuousProcessors) {
      processor.process();
    }
  }

  preTurn(entity: IEntity) {
    for (let system of this.preTurnSystems) {
      system.process(entity);
    }
  }

  processEntityActions(turnTaker: Components.TurnTaker, actions: Actions.IAction[]): boolean {
    if (actions.length === 0) {
      return false;
    }
    let actionPerformed = false;
    let action = actions.shift();
    while (!actionPerformed && action) {
      for (let system of this.reactiveSystems) {
        action = system.process(action);
      }
      if (!action.cancelled) {
        actionPerformed = action.perform();
        if (!actionPerformed) {
          action = actions.shift();
        }
      } else {
        action = actions.shift();
      }
    }
    if (!actionPerformed) {
      return false;
    }

    for (let system of this.continuousSystems) {
      system.process(action);
    }
    this.entityManager.clearDeletedEntities();
    return true;
  }
}
