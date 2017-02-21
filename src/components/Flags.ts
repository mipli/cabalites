import {Component} from './Component';

interface IFlags {
  static?: boolean,
  collidable?: boolean,
  sightBlocking?: boolean
}

export class Flags extends Component {
  get type() {
    return 'flags';
  }

  private flags: IFlags;

  get isCollidable() {
    return this.flags.collidable === true;
  }
  set collidable(value: boolean) {
    this.flags.collidable = value;
  }

  get isStatic() {
    return this.flags.static === true;
  }
  set static(value: boolean) {
    this.flags.static = value;
  }


  get isSightBlocking() {
    return this.flags.sightBlocking === true;
  }
  set sightBlocking(value: boolean) {
    this.flags.sightBlocking = value;
  }

  constructor(flags: IFlags) {
    super();
    this.flags = flags;
  }
}
