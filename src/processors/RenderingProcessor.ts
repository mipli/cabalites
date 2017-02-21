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
    this.renderEffects();
  }

  private renderMap() {
    this.map.forEach((position: Core.Vector2, tile: Map.Tile) => {
      let glyph = tile.glyph.glyph;
      let foreground = tile.glyph.foregroundColor;
      let background = tile.glyph.backgroundColor;
      const entities = tile.getEntities();
      const visible = this.isVisible(position);
      const hasSeen = this.hasSeen(position);
      if (!visible && !hasSeen) {
          glyph = Map.Glyph.CHAR_SPACE
          foreground = 0x111111;
          background = 0x111111;
      } else {
        if (!visible && hasSeen) {
          if (entities) {
            const renderables = entities.filter((entity) => {
              return (<Components.Flags>this.entityManager.getComponent(entity, 'flags')).isStatic;
            }).map((entity) => {
              return <Components.Renderable>this.entityManager.getComponent(entity, 'renderable');
            }).sort((a: Components.Renderable, b: Components.Renderable) => {
              return a.level - b.level;
            });
            renderables.forEach((renderable) => {
              glyph = renderable.glyph.glyph;
              if (renderable.glyph.foregroundColor) foreground = renderable.glyph.foregroundColor;
              if (renderable.glyph.backgroundColor) background = renderable.glyph.backgroundColor;
            });
          }
          foreground = Core.ColorUtils.colorMultiply(foreground, this.fogOfWarColor);
          background = Core.ColorUtils.colorMultiply(background, this.fogOfWarColor);
        } else {
          if (entities) {
            const renderables = entities.map((entity) => {
              return <Components.Renderable>this.entityManager.getComponent(entity, 'renderable');
            }).sort((a: Components.Renderable, b: Components.Renderable) => {
              return a.level - b.level;
            });
            renderables.forEach((renderable) => {
              glyph = renderable.glyph.glyph;
              if (renderable.glyph.foregroundColor) foreground = renderable.glyph.foregroundColor;
              if (renderable.glyph.backgroundColor) background = renderable.glyph.backgroundColor;
            });
          }
        }
      }

      this.console.setText(glyph, position.x, position.y);
      this.console.setForeground(foreground, position.x, position.y);
      this.console.setBackground(background, position.x, position.y);
    });
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
    if ((<any>window).DEBUG) {
      return true;
    }
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
