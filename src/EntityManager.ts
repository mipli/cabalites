import * as Core from './core';
import * as Components from './components';
import Game from './Game';

export interface IEntity {
  guid: number;
}

export class EntityManager {
  private static instance: EntityManager;

  private entities: {[guid: number]: any[]};
  private deletion: {[guid: number]: IEntity};
  private nextGuid: number;

  private tags: {[tag: string]: IEntity[]};

  private constructor() {
    this.entities = {};
    this.deletion = {};
    this.tags = {};
    this.nextGuid = 1;
  }

  static getInstance(): EntityManager {
    if (!this.instance) {
      this.instance = new EntityManager();
    }
    return this.instance;
  }

  public createEntity(): IEntity {
    return {
      guid: this.nextGuid++
    }
  }

  public deleteEntity(entity: IEntity) {
    this.deletion[entity.guid] = entity;
  }

  public getEntity(entity: IEntity) {
    return this.entities[entity.guid];
  }

  public clearDeletedEntities() {
    for (let guid in this.deletion) {
      let entity = this.deletion[guid];
      this.entities[entity.guid].map((component) => {
        component.delete();
        return null;
      });
      delete this.entities[entity.guid];
      delete this.deletion[guid];
      entity = null;
    }
    this.deletion = {};
  }

  deleteTags(entity: IEntity, tags: string[]) {
    for (let tag in tags) {
      const idx = this.tags[tag].findIndex((e) => e.guid === entity.guid);
      if (idx >= 0) {
        this.tags[tag].splice(idx, 1);
      }
    }
    
  }

  getTaggedEntities(tag: string) {
    if (!this.tags[tag]) {
      return [];
    }
    return this.tags[tag];
  }

  public assimilateTags(entity: IEntity) {
    if (this.deletion[entity.guid]) {
      return;
    }
    const tagComponent = <Components.Tags>this.getComponent(entity, 'tags');
    this.removeAllTags(entity);
    for (let tag in tagComponent.tags) {
      tag = <string>tag;
      if (tagComponent.tags[tag] === true) {
        this.addTag(tag, entity);
      }
    }
  }

  private addTag(tag: string, entity: IEntity) {
    if (this.deletion[entity.guid]) {
      return;
    }
    if (!this.tags[tag]) {
      this.tags[tag] = [];
    }
    this.tags[tag].push(entity);
  }

  private removeAllTags(entity: IEntity) {
    if (this.deletion[entity.guid]) {
      return;
    }
    for (let tag in this.tags) {
      this.removeTag(tag, entity);
    }
  }

  private removeTag(tag: string, entity: IEntity) {
    if (this.deletion[entity.guid]) {
      return;
    }
    if (!this.tags[tag]) {
      return;
    }
    let idx = -1;
    this.tags[tag].forEach((e, index) => {
      if (e.guid === entity.guid) {
        idx = index;
      }
    });
    if (idx >= 0) {
     this.tags[tag].splice(idx, 1);
    }
  }

  public addComponent(entity: IEntity, component: Components.Component) {
    if (this.deletion[entity.guid]) {
      return;
    }
    if (typeof this.entities[entity.guid] === 'undefined') {
      this.entities[entity.guid] = []
    }
    this.entities[entity.guid].push(component);
    component.registerEntity(entity);
    component.initialize();
  }

  public getComponent(entity: IEntity, type: string): Components.Component {
    if (this.deletion[entity.guid]) {
      return null;
    }
    const components = this.entities[entity.guid];
    for (let component of components) {
      if (component.type === type) {
        return component;
      }
    }
    return null;
  }

  public getComponents(entity: IEntity, types: string[]): {[type: string]: Components.Component} {
    if (this.deletion[entity.guid]) {
      return null;
    }
    const components: {[type: string]: Components.Component} = {};
    let foundComponents = 0;
    for (let component of this.entities[entity.guid]) {
      if (types.indexOf(component.type) > -1) {
        foundComponents++;
        components[component.type] = component;
      }
    }
    if (foundComponents === 0) {
      return null;
    }
    return components;
  }


  public* iterateEntitiesAndComponentsWithinRadius(origin: Core.Vector2, radius: number, types: string[]): IterableIterator<{entity: IEntity, components: {[type: string]: Components.Component}}> {
    const minX = Math.max(0, origin.x - radius);
    const maxX = Math.min(Game.getInstance().map.width, origin.x + radius);
    const minY = Math.max(0, origin.y - radius);
    const maxY = Math.min(Game.getInstance().map.height, origin.y + radius);

    for (let x = minX; x < maxX; x++) {
      for (let y = minY; y < maxY; y++) {
        const entities = Game.getInstance().map.getTile(new Core.Vector2(x, y)).getEntities();
        if (entities.length === 0) {
          continue;
        }
        for (let i = 0; i < entities.length; i++) {
          const entity = entities[i];
          const components = this.getComponents(entity, types);
          if (components) {
            yield {
              entity: entity,
              components: components
            }
          }
        }
      }
    }
  }

  public* iterateEntityAndComponents(componentTypes: string[]): IterableIterator<{entity: IEntity, components: {[type: string]: Components.Component}}> {
    for (let key in this.entities) {
      const guid = parseInt(key);
      if (this.deletion[guid]) {
        continue;
      }
      const components: {[type: string]: Components.Component} = {};
      let foundComponents = 0;
      this.entities[guid].forEach((component) => {
        if (componentTypes.indexOf(component.type) > -1) {
          foundComponents++;
          components[component.type] = component;
        }
      });
      if (foundComponents == componentTypes.length) {
        yield {
          entity: {guid: guid},
          components: components
        }
      }
    }
  }
}
