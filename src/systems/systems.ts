import {IAction} from '../actions';

export interface IReactiveSystem {
  priority: number;
  process: (action: IAction) => IAction;
}

export interface IContinuousSystem {
  priority: number;
  process: () => void;
}
