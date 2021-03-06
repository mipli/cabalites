import {IPreTurnSystem} from './systems';
import {EntityManager, IEntity} from '../EntityManager';
import Game from '../Game';
import {EffectsHandler} from '../EffectsHandler';
import * as Actions from '../actions';
import * as Components from '../components'
import * as Map from '../map';
import * as Core from '../core';

export class SightSystem implements IPreTurnSystem {
  get priority() {
    return 100;
  }

  private entityManager: EntityManager;
  private effectsHandler: EffectsHandler;
  private map: Map.Map;
  private fov: Map.Shadowcast;

  constructor() {
    this.entityManager = EntityManager.getInstance();
    this.effectsHandler = EffectsHandler.getInstance();
    this.map = Game.getInstance().map;

    this.fov = new Map.Shadowcast(this.map.width, this.map.height)
  }

  process(entity: IEntity) {
    this.fov.setIsTransparent((x: number, y: number) => {
      return !this.map.tiles[x][y].blocksSight(entity);
    });

    const components = this.entityManager.getComponents(entity, ['sight', 'position', 'knowledge']);
    const sight = <Components.Sight>(<any>components).sight;
    const position = <Components.Position>(<any>components).position;
    const knowledge = <Components.Knowledge>(<any>components).knowledge;
    if (!(sight || position || knowledge)) {
      return false;
    }
    const visibility = this.fov.computeFov(position.vector.x, position.vector.y, sight.radius);

    for (let x = 0; x < visibility.length; x++) {
      for (let y = 0; y < visibility[x].length; y++) {
        const pos = new Core.Vector2(x, y);
        if (visibility[x][y]) {
          knowledge.markAsSeen(pos);
          if (!sight.isTileVisible(pos)) {
            knowledge.markAsVisible(pos);
          }
        } else {
          if (sight.isTileVisible(pos)) {
            knowledge.markAsNonVisible(pos);
          }
        }
      }
    }
    sight.setTileVisibility(visibility);
    return true;
  }
}
