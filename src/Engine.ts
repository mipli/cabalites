import {IProcessor, IProcessorSortFunction} from './processors';
import {IReactiveSystem, IContinuousSystem, IReactiveSystemSortFunction, IContinuousSystemSortFunction} from './systems';
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
      if (this.elapsedTime >= this.engineTickLength) {
        this.engineTime = time;
        this.process();
      }
      this.renderFunction(time);
    });
  }

  process() {
    const entity = this.scheduler.tick();
    const turnTaker = <Components.TurnTaker>this.entityManager.getComponent(entity, 'turnTaker');
    turnTaker.takeTurn(this.scheduler.turn, (actions: Actions.IAction[]) => {
      if (this.processEntityActions(turnTaker, actions)) {
        this.scheduler.tickDone();
      }
      actions = null;
    });
    for (let processor of this.continuousProcessors) {
      processor.process();
    }
  }

  processEntityActions(turnTaker: Components.TurnTaker, actions: Actions.IAction[]): boolean {
    if (actions.length === 0) {
      return false;
    }
    let actionPerformed = false;
    let action = actions.shift();
    while (!actionPerformed && action) {
      if (action.cost > turnTaker.currentActionPoints) {
        action = actions.shift();
        continue;
      }
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
    if (actionPerformed) {
      this.entityManager.clearDeletedEntities();
      for (let system of this.continuousSystems) {
        system.process(action);
      }
      this.entityManager.clearDeletedEntities();
      if (actionPerformed && action) {
        turnTaker.useActionPoints(action.cost);
      }
      if (turnTaker.currentActionPoints <= 0 || (action && action.type === 'endTurn')) {
        return true;
      }
    }
    return false;
  }
}
