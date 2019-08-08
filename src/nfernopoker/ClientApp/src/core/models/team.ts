import { Player } from "./index";

export class Team {

  constructor() {
    this.owner = "";
    this.ownerEmail = "";
    this.name = "";
    this.players = new Array<Player>();
  }

  owner: string;
  ownerEmail: string;
  name: string
  players: Array<Player>;

}
