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

import Game from './Game';

const game = Game.getInstance();
game.initialize();
