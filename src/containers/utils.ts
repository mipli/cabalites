const NULL_CONTAINER_STRING = 'CONTAINER_NULL';
const UNDEFINED_CONTAINER_STRING = 'CONTAINER_UNDEFINED';

const _hasOwnProperty = Object.prototype.hasOwnProperty;
export const has = function(obj: any, prop: any) {
  return _hasOwnProperty.call(obj, prop);
};

/**
* Function signature for comparing
* < 0 means a is smaller
* = 0 means they are equal
* > 0 means a is larger
*/
export interface ICompareFunction<T> {
  (a: T, b: T): number;
}

/**
* Function signature for checking equality
*/
export interface IEqualsFunction<T> {
  (a: T, b: T): boolean;
}

/**
* Function signature for iteration
* Return false to break the loop
*/
export interface ILoopFunction<T> {
  (a: T): boolean | void;
}

/**
 * Default function to compare element order
 */
export function defaultCompare<T>(a: T, b: T): number {
  if (a < b) {
    return -1;
  } else if (a === b) {
    return 0;
  } else {
    return 1;
  }
}

/**
 * Default function to test equality
 */
export function defaultEquals<T>(a: T, b: T): boolean {
  return a === b;
}

/**
 * Default function to convert an object to a string.
 */
export function defaultToString(item: any): string {
  if (item === null) {
    return NULL_CONTAINER_STRING;
  } else if (isUndefined(item)) {
    return UNDEFINED_CONTAINER_STRING;
  } else if (typeof item === 'string') {
    return '$string>' + item;
  } else {
    return '$obj>' + item.toString();
  }
}

/**
* Joins all the properies of the object using the provided join string
*/
export function makeString<T>(item: T, join: string = ','): string {
  if (item === null) {
    return NULL_CONTAINER_STRING;
  } else if (isUndefined(item)) {
    return UNDEFINED_CONTAINER_STRING;
  } else if (typeof item === 'string') {
    return item;
  } else {
    let str = '';
    let first = true;
    for (const prop in item) {
      if (has(item, prop)) {
        if (first) {
          first = false;
        } else {
          str = str + join;
        }
        str = str + prop + ':' + (<any>item)[prop];
      }
    }
    return '{' + str + '}';
  }
}

/**
 * Checks if the given argument is a function.
 * @function
 */
export function isFunction(func: any): boolean {
  return typeof func === 'function';
}

/**
 * Checks if the given argument is undefined.
 * @function
 */
export function isUndefined(obj: any): boolean {
  return typeof obj === 'undefined';
}

/**
 * Reverses a compare function.
 * @function
 */
export function reverseCompareFunction<T>(compareFunction: ICompareFunction<T>): ICompareFunction<T> {
  return function(d: T, v: T) {
    return compareFunction(d, v) * -1;
  };
}

/**
 * Returns an equal function given a compare function.
 * @function
 */
export function compareToEquals<T>(compareFunction: ICompareFunction<T>): IEqualsFunction<T> {
  return function(a: T, b: T) {
    return compareFunction(a, b) === 0;
  };
}
