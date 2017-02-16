import {IProcessor} from './processors';
import {IReactiveSystem, IContinuousSystem} from './systems';
import * as Components from './components';
import {EntityManager} from './EntityManager';

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
    this.engineTickLength = 20; // milliseconds per engine tick
    this.continuousProcessors = new PriorityLinkedList<IProcessor>((a: IProcessor, b: IProcessor) => {
      if (a.priority < b.priority) {
        return -1;
      } else if (a.priority == b.priority) {
        return 0;
      }
      return 1;
    });
    this.reactiveSystems = new PriorityLinkedList<IReactiveSystem>((a: IReactiveSystem, b: IReactiveSystem) => {
      if (a.priority < b.priority) {
        return -1;
      } else if (a.priority == b.priority) {
        return 0;
      }
      return 1;
    });
    this.continuousSystems = new PriorityLinkedList<IContinuousSystem>((a: IContinuousSystem, b: IContinuousSystem) => {
      if (a.priority < b.priority) {
        return -1;
      } else if (a.priority == b.priority) {
        return 0;
      }
      return 1;
    });
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
      system.process();
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
    for (let obj of this.entityManager.iterateEntityAndComponents(['turnTaker'])) {
      const turnTaker = <Components.TurnTaker>(<any>obj.components).turnTaker;
      const turn: any = turnTaker.takeTurn();
      if (turn.action) {
        for (let system of this.reactiveSystems) {
          turn.action = system.process(turn.action);
        }
        if (!turn.action.cancelled) {
          turn.action.perform();
        }
        for (let system of this.continuousSystems) {
          system.process();
        }
      }
    }
    for (let processor of this.continuousProcessors) {
      processor.process();
    }
  }
}
