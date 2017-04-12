import {IAction} from '../actions';
import {IEntity} from '../EntityManager';

export interface IReactiveSystem {
  priority: number;
  process: (action: IAction) => IAction;
}

export interface IContinuousSystem {
  priority: number;
  process: (action: IAction) => void;
}

export interface IPreTurnSystem {
  priority: number;
  process: (entity: IEntity) => boolean;
}


export const IReactiveSystemSortFunction = (a: IReactiveSystem, b: IReactiveSystem) => {
  if (a.priority < b.priority) {
    return -1;
  } else if (a.priority == b.priority) {
    return 0;
  }
  return 1;
};

export const IContinuousSystemSortFunction = (a: IContinuousSystem, b: IContinuousSystem) => {
  if (a.priority < b.priority) {
    return -1;
  } else if (a.priority == b.priority) {
    return 0;
  }
  return 1;
};

export const IPreTurnSystemSortFunction = (a: IPreTurnSystem, b: IPreTurnSystem) => {
  if (a.priority < b.priority) {
    return -1;
  } else if (a.priority == b.priority) {
    return 0;
  }
  return 1;
};
