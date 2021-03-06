import {IController} from './IController.ts';
import {IEntity, EntityManager} from '../EntityManager';
import * as Components from '../components';
import * as Actions from '../actions';
import * as Core from '../core';
import InputHandler from '../InputHandler';

export class InputController implements IController {
  private callback: (actions: Actions.IAction[]) => void;
  private turnTaker: Components.TurnTaker;
  private memo: () => void;

  constructor(private entity: IEntity, private entityManager: EntityManager, private inputHandler: InputHandler) {
    this.bindMovement();
    this.memo = null;
  }

  getActions(turnTaker: Components.TurnTaker, callback: (actions: Actions.IAction[]) => void) {
    this.turnTaker = turnTaker;
    this.callback = callback;
    if (this.memo) {
      this.memo();
      this.memo = null;
    }
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

    this.bindKeyCode(InputHandler.KEY_PERIOD, () => {
      this.sendActions([new Actions.EndTurnAction(this.entity)]);
    });
  }

  private bindKeyCode(keyCode: number, func: () => void) {
    this.inputHandler.listen([keyCode], () => {
      if (!this.callback) {
        this.memo = func;
        return;
      }
      func();
    });
  }

  private sendActions(actions: Actions.IAction[]) {
    this.callback(actions);
    this.callback = null;
  }

  private addMovementAction(direction: Core.DirectionInfo) {
    this.sendActions([
      new Actions.WalkAction(this.entity, direction),
      new Actions.MeleeAttackAction(this.entity, direction),
      new Actions.OpenAction(this.entity, direction)
    ]);
  }
}
