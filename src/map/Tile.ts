import * as Components from '../components'
import * as Core from '../core';
import * as Map from './index';
import {IEntity, EntityManager} from '../EntityManager';

export interface TileDescription {
  glyph: Map.Glyph | Map.Glyph[];
  walkable: boolean;
  blocksSight: boolean;
}

export class Tile {
  public glyph: Map.Glyph;
  public walkable: boolean;
  private _blocksSight: boolean;
  private entities: IEntity[];

  get isEmpty() {
    return this.entities.length === 0;
  }

  public static EMPTY: TileDescription = {
    glyph: new Map.Glyph(Map.Glyph.CHAR_SPACE, 0x000000, 0x000000),
    walkable: false,
    blocksSight: true,
  };

  public static FLOOR: TileDescription = {
    glyph: [
      new Map.Glyph('.', 0x3a4444, 0x222222),
      new Map.Glyph('.', 0x443a44, 0x222222),
      new Map.Glyph('.', 0x44443a, 0x222222),
      new Map.Glyph(',', 0x3a4444, 0x222222),
      new Map.Glyph(',', 0x443a44, 0x222222),
      new Map.Glyph(',', 0x44443a, 0x222222)
    ],
    walkable: true,
    blocksSight: false,
  };

  public static WALL: TileDescription = {
    glyph: new Map.Glyph(Map.Glyph.CHAR_BLOCK3, 0xaaaaaa, 0x111111),
    walkable: false,
    blocksSight: true,
  };

  public static createTile(desc: TileDescription) {
    let g: Map.Glyph = null;
    if ((<Array<Map.Glyph>>desc.glyph).length && (<Array<Map.Glyph>>desc.glyph).length > 0) {
      g = <Map.Glyph>Core.Random.getRandomIndex(<Array<Map.Glyph>>desc.glyph);
    } else {
      g = <Map.Glyph>desc.glyph;
    }
    return new Tile(g, desc.walkable, desc.blocksSight);
  }

  constructor(glyph: Map.Glyph, walkable: boolean, blocksSight: boolean) {
    this.entities = [];
    this.glyph = glyph;
    this.walkable = walkable;
    this._blocksSight = blocksSight;
  }

  getEntities() {
    return this.entities;
  }

  addEntity(entity: IEntity) {
    this.entities.push(entity);
  }

  removeEntity(entity: IEntity) {
    let idx = -1;
    this.entities.forEach((e, index) => {
      if (e.guid === entity.guid) {
        idx = index;
      }
    });
    if (idx >= 0) {
     this.entities.splice(idx, 1);
    }
  }

  blocksSight(watcher?: IEntity): boolean {
    if (this._blocksSight) {
      return true;
    }
    if (this.isEmpty) {
      return false;
    }
    let blocked = false;
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      if (watcher && entity.guid === watcher.guid) {
        return false;
      }
      if (!blocked) {
        const flags = <Components.Flags>EntityManager.getInstance().getComponent(entity, 'flags');
        if (flags && flags.isSightBlocking) {
          blocked = true;
        }
      }
    }
    return blocked;
  }
}
