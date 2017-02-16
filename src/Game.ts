import * as Components from './components';
import * as Processors from './processors';
import * as Systems from './systems';
import * as Core from './core';
import * as Map from './map';
import * as Actions from './actions';

import InputController from './InputController';
import InputHandler from './InputHandler';
import PixiConsole from './PixiConsole';
import Console from './Console';
import Engine from './Engine';

export default class Game {
  private static instance: Game;

  private engine: Engine;
  private _map: Map.Map;

  get map() {
    return this._map;
  }

  public static getInstance(): Game {
    if (!this.instance) {
      this.instance = new Game();
    }
    return this.instance;
  }


  private constructor() { }

  initialize() {
    let p = new PixiConsole(80, 40, 'game', 0xffffff, 0x000000, (event) => { 
      console.log('Click', event);
    });
    let c = new Console(80, 35);
    this.engine = Engine.getInstance();
    this.engine.setRenderFunction((elapsed: number) => {
      p.blit(c, 0, 0);
      p.render();
    });

    let inputHandler = new InputHandler();

    let dungeonGenerator = new Map.DungeonGenerator(80, 35);
    this._map = dungeonGenerator.generate();

    const renderingProcessor = Processors.createRenderingProcessor(c, this.map);
    this.engine.addContinuousProcessor(renderingProcessor);
    this.engine.addReactiveSystem(new Systems.CollisionSystem(this.engine.entityManager, this.map));
    this.engine.addContinuousSystem(new Systems.SightSystem());

    const player = this.createPlayer(this.map.width, this.map.height);
    renderingProcessor.setFocusEntity(player);

    this.engine.start();

    let guid = this.engine.entityManager.createEntity();
    this.engine.entityManager.addComponent(guid, new Components.Position(this.map.getEmptyPosition()));
    this.engine.entityManager.addComponent(guid, new Components.Renderable(new Map.Glyph('o', 0xdddddd)));
    this.engine.entityManager.addComponent(guid, new Components.Collidable());
  }

  createPlayer(width: number, height: number) {
    const guid = this.engine.entityManager.createEntity();
    this.engine.entityManager.addComponent(guid, new Components.Position(this.map.getEmptyPosition()));
    this.engine.entityManager.addComponent(guid, new Components.Renderable(new Map.Glyph('@', 0xdddddd)));
    this.engine.entityManager.addComponent(guid, new Components.Collidable());
    this.engine.entityManager.addComponent(guid, new Components.Sight(10));
    this.engine.entityManager.addComponent(guid, new Components.Knowledge(width, height));
    this.engine.entityManager.addComponent(guid, new Components.TurnTaker(
      new InputController(guid, this.engine.entityManager, new InputHandler())
    ));
    return guid;
  }
}
