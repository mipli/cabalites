import {IAction} from '../actions';

export interface IReactiveSystem {
  priority: number;
  process: (action: IAction) => IAction;
}

export interface IContinuousSystem {
  priority: number;
  process: () => void;
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
