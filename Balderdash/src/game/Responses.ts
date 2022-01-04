import { Player } from "./Player";

class StartGameResponse {
    gameId: string;
    startedSuccessfully: boolean;

    constructor() {
        this.gameId = '';
        this.startedSuccessfully = false;
    }
}

class GameJoinedResponse {
    public gameId: string = "";
    public playerId: string = "";
    public players: Array<Player> = [];
}

export { StartGameResponse, GameJoinedResponse };