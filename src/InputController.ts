import {IController} from './IController.ts';
import {IEntity, EntityManager} from './EntityManager';
import * as Actions from './actions';
import * as Core from './core';
import InputHandler from './InputHandler';

export default class InputController implements IController {
  private actions: Actions.IAction[];
  private active: boolean;

  constructor(private entity: IEntity, private entityManager: EntityManager, private inputHandler: InputHandler) {
    this.active = false;
    this.actions = [];
    this.bindMovement();
  }

  getActions() {
    this.active = true;
    const actions = this.actions;
    if (this.actions.length > 0) {
      this.active = false;
      const current = this.actions;
      this.actions = [];
      return current;
    }
    return [];
  }

  private bindMovement() {
    this.bindKeyCode(InputHandler.KEY_H, () => {
      this.addMovementAction(Core.Directions.West);
    });

    this.bindKeyCode(InputHandler.KEY_Y, () => {
      this.addMovementAction(Core.Directions.NorthWest);
    });

    this.bindKeyCode(InputHandler.KEY_L, () => {
      this.addMovementAction(Core.Directions.East);
    });

    this.bindKeyCode(InputHandler.KEY_U, () => {
      this.addMovementAction(Core.Directions.NorthEast);
    });

    this.bindKeyCode(InputHandler.KEY_J, () => {
      this.addMovementAction(Core.Directions.South);
    });

    this.bindKeyCode(InputHandler.KEY_B, () => {
      this.addMovementAction(Core.Directions.SouthWest);
    });

    this.bindKeyCode(InputHandler.KEY_K, () => {
      this.addMovementAction(Core.Directions.North);
    });

    this.bindKeyCode(InputHandler.KEY_N, () => {
      this.addMovementAction(Core.Directions.SouthEast);
    });
  }

  private bindKeyCode(keyCode: number, func: () => void) {
    this.inputHandler.listen([keyCode], () => {
      if (this.active) {
        func();
      }
    });
  }

  private addMovementAction(direction: Core.DirectionInfo) {
      this.actions.push(new Actions.WalkAction(this.entity, direction));
      this.actions.push(new Actions.OpenAction(this.entity, direction));
  }
}
