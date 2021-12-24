import { Player } from "./Player";
import * as signalr from "@microsoft/signalr";

class Game {
    _players: Player[];
    _currentPlayer: Player;
    _connection: signalr.HubConnection;
    _canStart: boolean;

    constructor() {
        this._players = new Array<Player>();
        this._currentPlayer = new Player("", "", true);
        this._connection = new signalr.HubConnectionBuilder().withUrl("/game").build();
        this._connection.on("gameStarted", (response) => {
            if (this._connection.connectionId != null) {
                this._currentPlayer.Id = this._connection.ConnectionId;
            }
        });
        this._connection.start().then(() => { return this._canStart = true; });
    }

    async function startGame() : Promise<void> {
        await this._connection.send("startGame", this._currentPlayer).then((resp) => {
            console.log(resp);
        });
    }
}

export { Game };