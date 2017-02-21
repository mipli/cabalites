import {IAction} from './actions';

export interface IController {
  getActions(): IAction[];
}
