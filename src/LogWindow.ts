import Console from './Console';
import * as Components from './components';
import {Logger} from './Logger';
import {IEntity, EntityManager} from './EntityManager';

export default class LogWindow {
  private console: Console;
  private characters: IEntity[];

  constructor(console: Console) {
    this.console = console;
    this.characters = [];
  }

  addCharacter(character: IEntity) {
    this.characters.push(character);
  }

  render() {
    for (let i = 0; i < this.characters.length; i++) {
      const character = this.characters[i];
      const turnTaker = <Components.TurnTaker>EntityManager.getInstance().getComponent(character, 'turnTaker');
      this.console.setText(' ', 0, i, 80, 1);
      if (turnTaker.active) {
        this.console.print('>', 0, i);
      }
      this.console.print(''+i, 2, i);
      this.console.print(turnTaker.currentActionPoints + '/' + turnTaker.maxActionPoints, 10, i);
    }
  }
}
