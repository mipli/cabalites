import * as Components from './components';
import * as Processors from './processors';
import * as Systems from './systems';
import * as Core from './core';
import * as Map from './map';
import * as Actions from './actions';

import {EntityManager, IEntity} from './EntityManager';
import InputController from './InputController';
import RandomWalkController from './RandomWalkController';
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
      console.log('Tile', this.map.getTile(new Core.Vector2(event.x, event.y)));
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

    dungeonGenerator.rooms.forEach((room: Map.Room) => {
      room.openings.forEach((opening) => {
        this.createDoor(opening.x, opening.y);
      });
    });


    const renderingProcessor = Processors.createRenderingProcessor(c, this.map);
    this.engine.addContinuousProcessor(renderingProcessor);
    this.engine.addReactiveSystem(new Systems.CollisionSystem(this.engine.entityManager, this.map));
    this.engine.addContinuousSystem(new Systems.SightSystem());

    const player1 = this.createPlayer(this.map.width, this.map.height, 0xaaaaee);
    renderingProcessor.setFocusEntity(player1);
    this.engine.start();

    const player2 = this.createPlayer(this.map.width, this.map.height, 0xaaeeaa);

    this.createOrc();
    this.createOrc();
    this.createOrc();
    this.createOrc();
    this.createOrc();
  }

  createOrc() {
    let guid = this.engine.entityManager.createEntity();
    this.engine.entityManager.addComponent(guid, new Components.Position(this.map.getEmptyPosition()));
    this.engine.entityManager.addComponent(guid, new Components.Renderable(new Map.Glyph('o', 0xdddddd)));
    this.engine.entityManager.addComponent(guid, new Components.Flags({collidable: true}));
    this.engine.entityManager.addComponent(guid, new Components.Sight(15));
    this.engine.entityManager.addComponent(guid, new Components.TurnTaker(
      new RandomWalkController(guid)
    ));
  }

  createDoor(x: number, y: number) {
    const guid = this.engine.entityManager.createEntity();
    this.engine.entityManager.addComponent(guid, new Components.Position(new Core.Vector2(x, y)));
    this.engine.entityManager.addComponent(guid, new Components.Renderable(new Map.Glyph('+', 0xaaaaaa)));
    this.engine.entityManager.addComponent(guid, new Components.Flags({static: true, collidable: true, sightBlocking: true}));
    this.engine.entityManager.addComponent(guid, new Components.Openable((entity: IEntity) => {
      const entityManager = EntityManager.getInstance();
      const pos = <Components.Position>entityManager.getComponent(entity, 'position');
      const guid = this.engine.entityManager.createEntity();
      entityManager.addComponent(guid, new Components.Position(new Core.Vector2(x, y)));
      entityManager.addComponent(guid, new Components.Flags({static: true}));
      entityManager.addComponent(guid, new Components.Renderable(new Map.Glyph('-', 0xaaaaaa)));

      entityManager.deleteEntity(entity);
      return true;
    }));
    return guid;
  }


  createPlayer(width: number, height: number, color: Core.Color) {
    const guid = this.engine.entityManager.createEntity();
    this.engine.entityManager.addComponent(guid, new Components.Position(this.map.getEmptyPosition()));
    this.engine.entityManager.addComponent(guid, new Components.Renderable(new Map.Glyph('@', color)));
    this.engine.entityManager.addComponent(guid, new Components.Flags({collidable: true}));
    this.engine.entityManager.addComponent(guid, new Components.Tags({player: true}));
    this.engine.entityManager.addComponent(guid, new Components.Sight(20));
    this.engine.entityManager.addComponent(guid, new Components.Knowledge(width, height));
    this.engine.entityManager.addComponent(guid, new Components.TurnTaker(
      new InputController(guid, this.engine.entityManager, new InputHandler())
    ));
    return guid;
  }
}
