import {IContinuousSystem} from './systems';
import {EntityManager} from '../EntityManager';
import Game from '../Game';
import {EffectsHandler} from '../EffectsHandler';
import * as Actions from '../actions';
import * as Components from '../components'
import * as Map from '../map';
import * as Core from '../core';

export class SightSystem implements IContinuousSystem {
  get priority() {
    return 100;
  }

  private entityManager: EntityManager;
  private effectsHandler: EffectsHandler;
  private map: Map.Map;
  private fov: Map.FoV;

  constructor() {
    this.entityManager = EntityManager.getInstance();
    this.effectsHandler = EffectsHandler.getInstance();
    this.map = Game.getInstance().map;

    this.fov = new Map.FoV();
  }

  process() {
    for (let obj of this.entityManager.iterateEntityAndComponents(['sight', 'position', 'knowledge'])) {
      const sight = <Components.Sight>(<any>obj.components).sight;
      const position = <Components.Position>(<any>obj.components).position;
      const knowledge = <Components.Knowledge>(<any>obj.components).knowledge;
      this.fov.init((position) => {
        return this.map.tiles[position.x][position.y].blocksSight(obj.entity);
      }, this.map.width, this.map.height, sight.radius);
      const visibility = this.fov.calculate(position.vector)
      sight.setTileVisibility(visibility);

      for (let x = 0; x < visibility.length; x++) {
        for (let y = 0; y < visibility[x].length; y++) {
          if (visibility[x][y] > 0) {
            knowledge.markAsSeen(new Core.Vector2(x, y));
          }
        }
      }
    }
  }
}
