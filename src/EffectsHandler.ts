import * as Core from './core';

export interface TintEffect {
  position: Core.Vector2,
  color: Core.Color
}

export class EffectsHandler {
  private static instance: EffectsHandler;
  private tints: TintEffect[][];

  private constructor() {
    this.tints = Core.Utils.buildMatrix<TintEffect>(100, 100, null);
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new EffectsHandler();
    }
    return this.instance;
  }

  public getTileTint(position: Core.Vector2) {
    return this.tints[position.x][position.y];
  }

  public addTileTint(position: Core.Vector2, color: Core.Color) {
    this.tints[position.x][position.y] = {
      position: position,
      color: color 
    };
  }

  public removeTileTint(position: Core.Vector2, color?: Core.Color) {
    this.tints[position.x][position.y] = null;
  }
}
