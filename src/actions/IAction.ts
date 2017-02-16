import ActionResult from './ActionResult';
import {IEntity, EntityManager} from '../EntityManager';

export interface IAction {
  type: string;
  cancelled: boolean;
  perform(): ActionResult;
};
