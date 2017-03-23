import {Component} from './Component';

interface ReputationOptions {
  dungeon?: boolean,
  player?: boolean
}

interface Reputations {
  dungeon: boolean,
  player: boolean
}

export class Faction extends Component {
  get type() {
    return 'faction';
  }

  private _reputations: Reputations;
  get reputations() { return this._reputations; }

  constructor(options: ReputationOptions) {
    super();
    this._reputations = {
      dungeon: options.dungeon ? true : false,
      player: options.player ? true : false
    };
    console.log(this._reputations);
  }

  isFriendlyWith(reputations: Reputations): boolean {
    if (reputations.dungeon && this._reputations.dungeon) {
      return true;
    }
    if (reputations.player && this._reputations.player) {
      return true;
    }
    return false;
  }
}
