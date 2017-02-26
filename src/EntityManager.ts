import * as Core from './core';
import * as Components from './components';

export interface IEntity {
  guid: string;
  deleted?: boolean;
}

export class EntityManager {
  private static instance: EntityManager;

  private entities: {[guid: string]: any[]};
  private deletion: IEntity[];

  private tags: {[tag: string]: IEntity[]};

  private constructor() {
    this.entities = {};
    this.deletion = [];
    this.tags = {};
  }

  static getInstance(): EntityManager {
    if (!this.instance) {
      this.instance = new EntityManager();
    }
    return this.instance;
  }

  public createEntity(): IEntity {
    const guid = Core.Utils.generateGuid();
    return {
      guid: guid
    }
  }

  public deleteEntity(entity: IEntity) {
    entity.deleted = true;
    this.deletion.push(entity);
  }

  public getEntity(entity: IEntity) {
    return this.entities[entity.guid];
  }

  public clearDeletedEntities() {
    while(this.deletion.length > 0) {
      let entity = this.deletion.pop();
      this.entities[entity.guid].map((component) => {
        component.delete();
        return null;
      });
      delete this.entities[entity.guid];
      entity = null;
    }
  }

  getTaggedEntities(tag: string) {
    if (!this.tags[tag]) {
      return [];
    }
    return this.tags[tag];
  }

  public assimilateTags(entity: IEntity) {
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
    if (!this.tags[tag]) {
      this.tags[tag] = [];
    }
    this.tags[tag].push(entity);
  }

  private removeAllTags(entity: IEntity) {
    for (let tag in this.tags) {
      this.removeTag(tag, entity);
    }
  }

  private removeTag(tag: string, entity: IEntity) {
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
    if (typeof this.entities[entity.guid] === 'undefined') {
      this.entities[entity.guid] = []
    }
    this.entities[entity.guid].push(component);
    component.registerEntity(entity);
    component.initialize();
  }

  public getComponent(entity: IEntity, type: string): Components.Component {
    const components = this.entities[entity.guid];
    for (let component of components) {
      if (component.type === type) {
        return component;
      }
    }
    return null;
  }

  public* iterateEntityAndComponents(componentTypes: string[]): IterableIterator<{entity: IEntity, components: {[type: string]: Components.Component}}> {
    for (let guid in this.entities) {
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
