export interface IProcessor {
  priority: number;
  process: () => void;
}

export const IProcessorSortFunction = (a: IProcessor, b: IProcessor) => {
  if (a.priority < b.priority) {
    return -1;
  } else if (a.priority == b.priority) {
    return 0;
  }
  return 1;
}
