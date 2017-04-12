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
      const info = <Components.Info>EntityManager.getInstance().getComponent(character, 'info');
      const health = <Components.Health>EntityManager.getInstance().getComponent(character, 'health');

      this.console.setText(renderable.glyph.glyph, 1, y);
      this.console.setForeground(renderable.glyph.foregroundColor, 1, y);

      this.console.print(''+info.name, 2, y, 0xdddddd);
      this.console.print('HP: ' + health.current + '/' + health.max, 15, y, 0xdddddd);
  }
}
