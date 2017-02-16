export interface IProcessor {
  priority: number;
  process: () => void;
}
