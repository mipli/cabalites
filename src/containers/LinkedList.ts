import * as array from './array';
import * as utils from './utils';

export interface ILinkedListNode<T> {
  element: T,
  next: ILinkedListNode<T>
}

export default class LinkedList<T> {
  protected head: ILinkedListNode<T>;
  protected tail: ILinkedListNode<T>;

  protected _count: number;

  constructor() {
    this.clear();
  }

  get count(): number {
    return this._count;
  }

  get first(): T {
    return this.head ? this.head.element : undefined;
  }

  get last(): T {
    return this.tail ? this.tail.element : undefined;
  }

  push(element: T, idx?: number): boolean {
    if (utils.isUndefined(idx)) {
      idx = this.count;
    }

    if (idx < 0 || idx > this.count || utils.isUndefined(element)) {
      return false;
    }

    const node = this.createNode(element);
    if (this.count === 0) {
      this.head = node;
      this.tail = node;
    } else if (idx === this.count) {
      this.tail.next = node;
      this.tail = node;
    } else if (idx === 0) {
      node.next = this.head;
      this.head = node.next;
    } else {
      const previousNode = this.getNodeAt(idx - 1);
      node.next = previousNode.next;
      previousNode.next = node;
    }
    this._count++;
    return true;
  }

  remove(element: T, equalsFunction?: utils.IEqualsFunction<T>): boolean {
    const equals = equalsFunction || utils.defaultEquals;
    if (this.count < 1 || utils.isUndefined(element)) {
      return false;
    }
    let previous: ILinkedListNode<T> = null;
    let current: ILinkedListNode<T> = this.head;
    while (current !== null) {
      if (equals(current.element, element)) {
        if (previous) {
          if (current.next) {
            // there are nodes following this one
            previous.next = current.next;
          } else {
            // last node matched
            this.tail = previous;
            previous.next = null;
            current.next = null;
          }
        } else {
          // first node matches
          this.head = current.next;
          if (this.count === 1) {
            this.tail = null;
          }
        }
        current.next = null;
        this._count--;
        return true;
      }
      previous = current;
      current = current.next;
    }
    return false;
  }

  getElementAtIndex(idx: number): T {
    const node = this.getNodeAt(idx);
    return node ? node.element : undefined;
  }

  clear(): void {
    this.head = null;
    this.tail = null;
    this._count = 0;
  }

  toArray(): T[] {
    const array: T[] = [];
    let current: ILinkedListNode<T> = this.head;
    while (current) {
      array.push(current.element);
      current = current.next;
    }
    return array;
  }

  toString(): string {
    return this.toArray().toString();
  }

  [Symbol.iterator](): IterableIterator<T> {
    let next: ILinkedListNode<T> = this.head;
    let current: ILinkedListNode<T> = null;
    return <IterableIterator<T>>{
      next(): IteratorResult<T> {
        if (next) {
          current = next;
          next = current.next;
          return {
            done: false,
            value: current.element
          }
        } else {
          return {
            value: null,
            done: true
          }
        }
      }
    }
  }

  protected getNodeAt(idx: number): ILinkedListNode<T> {
    if (idx < 0 || idx > this.count) {
      return null;
    }
    if (idx == this.count - 1) {
      this.tail;
    }
    let node = this.head;
    for (let i = 0; i < idx; i++) {
      node = node.next;
    }
    return node;
  }

  protected createNode(element: T): ILinkedListNode<T> {
    return {
      element: element,
      next: null
    };
  }
}
