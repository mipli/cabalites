(<any>window).options = {};
const hash = window.location.hash;
if (hash) {
  const options = hash.substr(1).split('&').map((arg) => {
    const opt = arg.split('=');
    return {
      key: opt[0],
      value: opt.length > 1 ? opt[1] : true
    }
  });
  options.forEach((opt) => {
    (<any>window).options[opt.key] = opt.value;
  });
}

import {EntityManager} from './EntityManager';
import Game from './Game';
import * as Core from './core';

window.addEventListener('keydown', (event) => {
  if (event.keyCode === 70) { //F
    (<any>window).DEBUG = !(<any>window).DEBUG;
  }
});

(<any>window).getEntity = (guid: number) => {
  return EntityManager.getInstance().getEntity({guid: guid});
}

(<any>window).getComponent = (guid: number, type: string) => {
  return EntityManager.getInstance().getComponent({guid: guid}, type);
};;

(<any>window).getTile = (x: number, y: number) => {
  return Game.getInstance().map.tiles[x][y];
};;

(<any>window).getGame = () => {
  return Game.getInstance();
};;

(<any>window).Core = Core;

const game = Game.getInstance();
game.initialize();
