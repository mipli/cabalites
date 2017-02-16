import {IProcessor} from './IProcessor';
import {EntityManager, IEntity} from '../EntityManager';
import Console from '../Console';
import {EffectsHandler, TintEffect} from '../EffectsHandler';
import * as Components from '../components'
import * as Map from '../map';
import * as Core from '../core';

class RenderingProcessor implements IProcessor {
  private entityManager: EntityManager;
  private effectsHandler: EffectsHandler;
  private console: any;
  private map: Map.Map;
  private fogOfWarColor: Core.Color

  private focusEntity: IEntity;
  private sightComponent: Components.Sight;
  private knowledgeComponent: Components.Knowledge;


  constuctor() { } 

  get priority() {
    return 100;
  }

  init(console: Console, map: Map.Map) {
    this.entityManager = EntityManager.getInstance();
    this.effectsHandler = EffectsHandler.getInstance();
    this.console = console;
    this.map = map;
    this.fogOfWarColor = 0x667777;
  }

  setFocusEntity(focusEntity: IEntity) {
    this.focusEntity = focusEntity;
    this.sightComponent = <Components.Sight>this.entityManager.getComponent(this.focusEntity, 'sight');
    this.knowledgeComponent = <Components.Knowledge>this.entityManager.getComponent(this.focusEntity, 'knowledge');
  }

  process() {
    this.renderMap();
    this.renderEntities();
    this.renderEffects();
  }

  private renderMap() {
    this.map.forEach((position: Core.Vector2, tile: Map.Tile) => {
      let glyph = tile.glyph;
      if (!this.isVisible(position)) {
        if (this.hasSeen(position)) {
          glyph = new Map.Glyph(
            glyph.glyph,
            Core.ColorUtils.colorMultiply(glyph.foregroundColor, this.fogOfWarColor),
            Core.ColorUtils.colorMultiply(glyph.backgroundColor, this.fogOfWarColor)
          );
        } else {
          glyph = new Map.Glyph(Map.Glyph.CHAR_SPACE, 0x111111, 0x111111);
        }
      }
      this.console.setText(glyph.glyph, position.x, position.y);
      this.console.setForeground(glyph.foregroundColor, position.x, position.y);
      this.console.setBackground(glyph.backgroundColor, position.x, position.y);
    });
  }

  private renderEntities() {
    for (let obj of this.entityManager.iterateEntityAndComponents(['renderable', 'position'])) {
      const renderable = <Components.Renderable>(<any>obj.components).renderable;
      const position = <Components.Position>(<any>obj.components).position;
      if (this.isVisible(position.vector)) {
        this.console.setText(renderable.glyph.glyph, position.x, position.y)
        this.console.setForeground(renderable.glyph.foregroundColor, position.x, position.y);
        if (renderable.glyph.backgroundColor) {
          this.console.setBackground(renderable.glyph.backgroundColor, position.x, position.y);
        }
      } else {
        this.console.setText(Map.Glyph.CHAR_SPACE, position.x, position.y)
      }
    }
  }

  private renderEffects() {
    this.map.forEach((position: Core.Vector2, tile: Map.Tile) => {
      if (!this.isVisible(position)) {
        this.console.setTint(null, position.x, position.y);
        return;;
      }
      const tint = this.effectsHandler.getTileTint(position);
      if (tint) {
        this.console.setTint(tint.color, position.x, position.y);
      } else {
        this.console.setTint(null, position.x, position.y);
      }
    });
  }


  private isVisible(position: Core.Vector2) {
    return this.sightComponent.isTileVisible(position);
  }

  private hasSeen(position: Core.Vector2) {
    return this.knowledgeComponent.hasSeen(position);
  }
}

export const createRenderingProcessor = (console: Console, map: Map.Map): RenderingProcessor => {
  const p = new RenderingProcessor();
  p.init(console, map);
  return p;
};
