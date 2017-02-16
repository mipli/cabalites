import * as array from './array';
import * as utils from './utils';

export default class Heap<T> {
  private data: T[] = [];
  private compareFunction: utils.ICompareFunction<T>;

  constructor(compareFunction?: utils.ICompareFunction<T>) {
    this.compareFunction = compareFunction || utils.defaultCompare;
  }

  get count() {
    return this.data.length;
  }

  get isEmpty() {
    return this.count > 0;
  }

  private getLeftChildIndex(idx: number): number {
    return (2 * idx) + 1;
  }

  private getRightChildIndex(idx: number): number {
    return (2 * idx) + 2;
  }

  private getParentIndex(idx: number): number {
    return Math.floor((idx - 1) / 2);
  }

  private getMinIndex(leftIdx: number, rightIdx: number): number {
    if (rightIdx >= this.count) {
      if (leftIdx >= this.count) {
        return -1;
      }
      return leftIdx;
    }
    if (this.compareFunction(this.data[leftIdx], this.data[rightIdx]) <= 0) {
      return leftIdx;
    }
    return rightIdx;
  }

  private getMinChildIndex(idx: number): number {
    return this.getMinIndex(this.getLeftChildIndex(idx), this.getRightChildIndex(idx));
  }

  private siftUp(idx: number): void {
    let parentIdx = this.getParentIndex(idx);
    while (parentIdx > 0 && this.compareFunction(this.data[parentIdx], this.data[idx]) > 0) {
      array.swap(this.data, parentIdx, idx);
      idx = parentIdx;
      parentIdx = this.getParentIndex(idx);
    }
  }

  private siftDown(idx: number): void {
    let minChildIdx = this.getMinChildIndex(idx);
    while (minChildIdx >= 0 && this.compareFunction(this.data[idx], this.data[minChildIdx]) > 0) {
      array.swap(this.data, minChildIdx, idx);
      idx = minChildIdx;
      minChildIdx = this.getMinChildIndex(idx);
    }
  }

  peek(): T {
    if (this.count > 0) {
      return this.data[0];
    }
    return undefined;
  }

  push(element: T): boolean {
    if (utils.isUndefined(element)) {
      return undefined;
    }
    this.data.push(element);
    this.siftUp(this.count - 1);
    return true;
  }

  pop(): T {
    if (this.count === 0) {
      return undefined;
    }
    const root = this.data[0];
    this.data[0] = this.data[this.count - 1];
    this.data.splice(this.count - 1, 1);
    if (this.count > 0) {
      this.siftDown(0);
    }
    return root;
  }

  clear(): void {
    this.data.length = 0;
  }
}
