import {IEntity, EntityManager} from '../EntityManager';

export interface IAction {
  type: string;
  cost: number;
  cancelled: boolean;
  perform(): boolean;
};
