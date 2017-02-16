import {IController} from './IController.ts';
import {IEntity, EntityManager} from './EntityManager';
import * as Actions from './actions';
import * as Core from './core';
import InputHandler from './InputHandler';

export default class InputController implements IController {
  private action: Actions.IAction;
  private active: boolean;

  constructor(private entity: IEntity, private entityManager: EntityManager, private inputHandler: InputHandler) {
    this.active = false;
    this.bindMovement();
  }

  getAction() {
    this.active = true;
    const action = this.action;
    if (this.action) {
      this.active = false;
      const current = this.action;
      this.action = null;
      return current;
    }
    return null;
  }

  private bindMovement() {
    this.bindKeyCode(InputHandler.KEY_H, () => {
      this.action = new Actions.WalkAction(this.entity, Core.Directions.West);
    });

    this.bindKeyCode(InputHandler.KEY_Y, () => {
      this.action = new Actions.WalkAction(this.entity, Core.Directions.NorthWest);
    });

    this.bindKeyCode(InputHandler.KEY_L, () => {
      this.action = new Actions.WalkAction(this.entity, Core.Directions.East);
    });

    this.bindKeyCode(InputHandler.KEY_U, () => {
      this.action = new Actions.WalkAction(this.entity, Core.Directions.NorthEast);
    });

    this.bindKeyCode(InputHandler.KEY_J, () => {
      this.action = new Actions.WalkAction(this.entity, Core.Directions.South);
    });

    this.bindKeyCode(InputHandler.KEY_B, () => {
      this.action = new Actions.WalkAction(this.entity, Core.Directions.SouthWest);
    });

    this.bindKeyCode(InputHandler.KEY_K, () => {
      this.action = new Actions.WalkAction(this.entity, Core.Directions.North);
    });

    this.bindKeyCode(InputHandler.KEY_N, () => {
      this.action = new Actions.WalkAction(this.entity, Core.Directions.SouthEast);
    });
  }

  private bindKeyCode(keyCode: number, func: () => void) {
    this.inputHandler.listen([keyCode], () => {
      if (this.active) {
        func();
      }
    });
  }
}
