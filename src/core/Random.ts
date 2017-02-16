let randomizer: any;
export namespace Random {
  export function get(min: number = 0, max: number = 1): number {
    const rand = randomizer.quick();
    return Math.floor(min + rand * (max-min));
  }

  export function getFloat() {
    return randomizer.quick();
  }

  export function getRandomIndex<T>(array: T[]): T {
    return array[get(0, array.length)];
  }

  export function randomizeArray<T>(array: T[]): T[] {
    if (array.length <= 1) return array;

    for (let i = 0; i < array.length; i++) {
      const randomChoiceIndex = get(i, array.length);

      [array[i], array[randomChoiceIndex]] = [array[randomChoiceIndex], array[i]];
    }

    return array;
  }
}

((win: any) => {
  const seed = win.options.seed ? win.options.seed : Date.now();
  console.log('Random seed', seed);
  randomizer = new (<any>Math).seedrandom(seed);
})(window);
