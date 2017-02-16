import {IAction} from './actions';

export interface IController {
  getAction(): IAction;
}
