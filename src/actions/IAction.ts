import {IEntity, EntityManager} from '../EntityManager';

export interface IAction {
  entity: IEntity;
  type: string;
  cost: number;
  cancelled: boolean;
  perform(): boolean;
};
