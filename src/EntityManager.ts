import * as Core from './core';
import {Component} from './components';

export interface IEntity {
  guid: string;
}

export class EntityManager {
  private static instance: EntityManager;

  private entities: {[guid: string]: any[]};

  private constructor() {
    this.entities = {};
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

  public addComponent(entity: IEntity, component: Component) {
    if (typeof this.entities[entity.guid] === 'undefined') {
      this.entities[entity.guid] = []
    }
    this.entities[entity.guid].push(component);
    component.registerEntity(entity);
    component.initialize();
  }

  public getComponent(entity: IEntity, type: string): Component {
    const components = this.entities[entity.guid];
    for (let component of components) {
      if (component.type === type) {
        return component;
      }
    }
    return null;
  }

  public* iterateEntityAndComponents(componentTypes: string[]): IterableIterator<{entity: IEntity, components: {[type: string]: Component}}> {
    for (let guid in this.entities) {
      const components: {[type: string]: Component} = {};
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
