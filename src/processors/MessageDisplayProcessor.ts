import {IProcessor} from './IProcessor';
import {IEntity, EntityManager} from '../EntityManager';
import Console from '../Console';
import * as Components from '../components';
import * as Core from '../core';

export class MessageDisplayProcessor implements IProcessor {
  get priority() {
    return 1000;
  }

  private entityManager: EntityManager;

  private console: Console;

  constructor(console: Console) {
    this.console = console;
    this.entityManager = EntityManager.getInstance();
  }

  process() {
    this.clear();
    this.entityManager.getTaggedEntities('player').forEach((entity, idx) => {
      this.printCharacterInfo(entity, idx);
    });
  }

  private clear() {
      this.console.setText(' ', 0, 0, this.console.width, this.console.height);
  }

  private printCharacterInfo(character: IEntity, y: number) {
      const turnTaker = <Components.TurnTaker>EntityManager.getInstance().getComponent(character, 'turnTaker');
      const renderable = <Components.Renderable>EntityManager.getInstance().getComponent(character, 'renderable');
      const name = <Components.Name>EntityManager.getInstance().getComponent(character, 'name');
      if (turnTaker.active) {
        this.console.print('>', 0, y, 0xdddddd);
      }

      this.console.setText(renderable.glyph.glyph, 1, y);
      this.console.setForeground(renderable.glyph.foregroundColor, 1, y);

      this.console.print(''+name.name, 2, y, 0xdddddd);
      this.console.print(turnTaker.currentActionPoints + '/' + turnTaker.maxActionPoints, 15, y, 0xdddddd);
  }
}
