import * as utils from './utils';

/**
 * Returns first position of the item
 */
export function indexOf<T>(array: T[], item: T, equalsFunction?: utils.IEqualsFunction<T>): number {
    const equals = equalsFunction || utils.defaultEquals;
    const length = array.length;
    for (let i = 0; i < length; i++) {
        if (equals(array[i], item)) {
            return i;
        }
    }
    return -1;
}

/**
 * Returns the last position of the item
 */
export function lastIndexOf<T>(array: T[], item: T, equalsFunction?: utils.IEqualsFunction<T>): number {
    const equals = equalsFunction || utils.defaultEquals;
    const length = array.length;
    for (let i = length - 1; i >= 0; i--) {
        if (equals(array[i], item)) {
            return i;
        }
    }
    return -1;
}

/**
 * Returns true if the array contains the item
 */
export function contains<T>(array: T[], item: T, equalsFunction?: utils.IEqualsFunction<T>): boolean {
    return indexOf(array, item, equalsFunction) >= 0;
}


/**
 * Removes the item from the array
 */
export function remove<T>(array: T[], item: T, equalsFunction?: utils.IEqualsFunction<T>): boolean {
    const index = indexOf(array, item, equalsFunction);
    if (index < 0) {
        return false;
    }
    array.splice(index, 1);
    return true;
}

/**
 * Return frequency of item in array
 */
export function frequency<T>(array: T[], item: T, equalsFunction?: utils.IEqualsFunction<T>): number {
    const equals = equalsFunction || utils.defaultEquals;
    const length = array.length;
    let frq = 0;
    for (let i = 0; i < length; i++) {
        if (equals(array[i], item)) {
            frq++;
        }
    }
    return frq;
}

/**
 * Compare to arrays
 */
export function equals<T>(array1: T[], array2: T[], equalsFunction?: utils.IEqualsFunction<T>): boolean {
    const equals = equalsFunction || utils.defaultEquals;

    if (array1.length !== array2.length) {
        return false;
    }
    const length = array1.length;
    for (let i = 0; i < length; i++) {
        if (!equals(array1[i], array2[i])) {
            return false;
        }
    }
    return true;
}

/**
 * Returns shallow a copy of the array
 */
export function copy<T>(array: T[]): T[] {
    return array.concat();
}

/**
 * Swaps the elements at the given positions
 */
export function swap<T>(array: T[], i: number, j: number): boolean {
    if (i < 0 || i >= array.length || j < 0 || j >= array.length) {
        return false;
    }
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
    return true;
}
