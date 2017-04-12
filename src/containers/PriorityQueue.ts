import * as utils from './utils';
import Heap from './Heap';

export default class PriorityQueue<T> {
  private heap: Heap<T>;

  get count() {
    return this.heap.count;
  }

  get isEmpty() {
    return this.heap.isEmpty;
  }

  constructor(compareFunction?: utils.ICompareFunction<T>) {
    this.heap = new Heap<T>(compareFunction);
  }

  enqueue(element: T): boolean {
    return this.heap.push(element);
  }

  dequeue(): T {
    return this.heap.pop();
  }

  peek(): T {
    return this.heap.peek();
  }

  clear(): void {
    this.heap.clear()
  }

}
