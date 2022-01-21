import { Player } from "../Player";

export class PlayerSubmittedVoteEvent {
    constructor(public player: Player, public definition: string) {}
};