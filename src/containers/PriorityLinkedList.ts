import * as array from './array';
import * as utils from './utils';

import {ILinkedListNode, default as LinkedList} from './LinkedList.ts';

export default class PriorityLinkedList<T> extends LinkedList<T> {
  private compareFunction: utils.ICompareFunction<T>;

  constructor(compareFunction?: utils.ICompareFunction<T>) {
    super();
    this.compareFunction = compareFunction || utils.defaultCompare;
  }

  push(element: T): boolean {
    if (utils.isUndefined(element)) {
      return false;
    }
    const node = this.createNode(element);
    if (this.count === 0) {
      this.head = node;
      this.tail = node;
      this._count++;
      return true;
    }
    let current = this.head;
    let previous = null;
    while (current) {
      if (this.compareFunction(current.element, node.element) === 1) {
        node.next = current;
        if (previous) {
          previous.next = node;
        } else {
          this.head = node;
        }
        this._count++;
        return true;
      }
      if (current.next === null) {
        current.next = node;
        this._count++;
        return true;
      }
      previous = current;
      current = current.next;
    }
    return false;
  }
}
