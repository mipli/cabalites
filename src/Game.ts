import * as Components from './components';
import * as Controllers from './controllers';
import * as Processors from './processors';
import * as Systems from './systems';
import * as Core from './core';
import * as Map from './map';
import * as Actions from './actions';

import {EntityManager, IEntity} from './EntityManager';
import KnowledgeStore from './KnowledgeStore';
import InputHandler from './InputHandler';
import PixiConsole from './PixiConsole';
import Console from './Console';
import Engine from './Engine';

export default class Game {
  private static instance: Game;

  private engine: Engine;
  private _map: Map.Map;

  private pixi: PixiConsole;

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
    this.pixi = new PixiConsole(80, 40, 'game', 0xffffff, 0x000000, () => { this.onLoaded() }, (event) => { 
      console.log('Click', event);
      console.log('Tile', this.map.getTile(new Core.Vector2(event.x, event.y)));
    });
  }

  onLoaded() {
    const mainConsole = new Console(80, 35);
    const logConsole = new Console(80, 5);

    this.engine = Engine.getInstance();
    this.engine.setRenderFunction((elapsed: number) => {
      this.pixi.blit(mainConsole, 0, 0);
      this.pixi.blit(logConsole, 0, 35);
      this.pixi.render();
    });
    this.pixi.addBorder(0, 35, 80, 5, 0x777777);

    const inputHandler = new InputHandler();

    const dungeonGenerator = new Map.DungeonGenerator(80, 35);
    this._map = dungeonGenerator.generate();

    dungeonGenerator.rooms.forEach((room: Map.Room) => {
      room.openings.forEach((opening) => {
        if (this._map.tiles[opening.x][opening.y].isEmpty) {
          this.createDoor(opening.x, opening.y);
        }
      });
    });

    const renderingProcessor = Processors.createRenderingProcessor(mainConsole, this.map);
    this.engine.addContinuousProcessor(renderingProcessor);
    this.engine.addContinuousProcessor(new Processors.MessageDisplayProcessor(logConsole));

    const actionLogSystem = new Systems.ActionLogSystem();
    this.engine.addContinuousSystem(actionLogSystem);
    this.engine.addContinuousSystem(new Systems.HealthSystem());

    this.engine.addPreTurnSystems(new Systems.SightSystem());

    this.engine.addReactiveSystem(new Systems.CollisionSystem(this.engine.entityManager, this.map));
    this.engine.addReactiveSystem(new Systems.CombatSystem());

    const knowledgeStore = new KnowledgeStore();
    renderingProcessor.setKnowledgeStore(knowledgeStore);

    (<any>window).knowledge = knowledgeStore;
    (<any>window).actionLog = actionLogSystem;

    const startingRoom = dungeonGenerator.rooms[0];
    const player1 = this.createPlayer(startingRoom.x + 1, startingRoom.y + 1, 0xaaaaee, 'Ninurtach', knowledgeStore);

    this.engine.start();

    for (let o = 0; o < 10; o++) {
      this.createOrc();
    }
  }

  createOrc() {
    let guid = this.engine.entityManager.createEntity();
    this.engine.entityManager.addComponent(guid, new Components.Position(this.map.getEmptyPosition()));
    this.engine.entityManager.addComponent(guid, new Components.Renderable(new Map.Glyph('o', 0xdddddd)));
    this.engine.entityManager.addComponent(guid, new Components.Flags({collidable: true}));
    this.engine.entityManager.addComponent(guid, new Components.Sight(15));
    this.engine.entityManager.addComponent(guid, new Components.Health(5));
    this.engine.entityManager.addComponent(guid, new Components.Knowledge());
    this.engine.entityManager.addComponent(guid, new Components.Info({entityType: 'creature'}));
    this.engine.entityManager.addComponent(guid, new Components.Faction({dungeon: true}));
    this.engine.entityManager.addComponent(guid, new Components.TurnTaker(
      new Controllers.FollowAttackController(guid)
    ));
  }

  createDoor(x: number, y: number) {
    const guid = this.engine.entityManager.createEntity();
    this.engine.entityManager.addComponent(guid, new Components.Position(new Core.Vector2(x, y)));
    this.engine.entityManager.addComponent(guid, new Components.Info({entityType: 'door'}));
    this.engine.entityManager.addComponent(guid, new Components.Renderable(new Map.Glyph('+', 0xaaaaaa)));
    this.engine.entityManager.addComponent(guid, new Components.Flags({static: true, collidable: true, sightBlocking: true}));
    this.engine.entityManager.addComponent(guid, new Components.Openable((entity: IEntity) => {
      const entityManager = EntityManager.getInstance();
      const pos = <Components.Position>entityManager.getComponent(entity, 'position');
      const guid = this.engine.entityManager.createEntity();
      entityManager.addComponent(guid, new Components.Info({entityType: 'door'}));
      entityManager.addComponent(guid, new Components.Position(new Core.Vector2(x, y)));
      entityManager.addComponent(guid, new Components.Flags({static: true}));
      entityManager.addComponent(guid, new Components.Renderable(new Map.Glyph('-', 0xaaaaaa)));

      entityManager.deleteEntity(entity);
      return true;
    }));
    return guid;
  }


  createPlayer(x: number, y: number, color: Core.Color, name: string, knowledgeStore: KnowledgeStore) {
    const guid = this.engine.entityManager.createEntity();
    this.engine.entityManager.addComponent(guid, new Components.Position(new Core.Vector2(x, y)));
    this.engine.entityManager.addComponent(guid, new Components.Renderable(new Map.Glyph('@', color)));
    this.engine.entityManager.addComponent(guid, new Components.TurnTaker(
      new Controllers.InputController(guid, this.engine.entityManager, new InputHandler())
    ));
    this.engine.entityManager.addComponent(guid, new Components.Flags({collidable: true}));
    this.engine.entityManager.addComponent(guid, new Components.Tags({player: true}));
    this.engine.entityManager.addComponent(guid, new Components.Sight(20));
    this.engine.entityManager.addComponent(guid, new Components.Health(10));
    this.engine.entityManager.addComponent(guid, new Components.Strength(10));
    this.engine.entityManager.addComponent(guid, new Components.Info({name: name, entityType: 'character'}));
    this.engine.entityManager.addComponent(guid, new Components.Knowledge(knowledgeStore));
    this.engine.entityManager.addComponent(guid, new Components.Faction({player: true}));
    return guid;
  }
}
