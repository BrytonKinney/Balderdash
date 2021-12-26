import { Player } from "./Player";
import * as signalr from "@microsoft/signalr";
class Game {
    _players;
    _currentPlayer;
    _connection;
    _canStart;
    constructor() {
        this._players = new Array();
        this._currentPlayer = new Player("", "", true);
        this._connection = new signalr.HubConnectionBuilder().withUrl("/game").build();
        this._canStart = false;
        this._connection.on("gameStarted", (response) => {
            if (this._connection.connectionId != null) {
                this._currentPlayer.Id = this._connection.connectionId;
            }
        });
        this._connection.start().then(() => { return this._canStart = true; });
    }
    async startGame() {
        await this._connection.send("startGame", this._currentPlayer).then((resp) => {
            console.log(resp);
        });
    }
}
export { Game };
//# sourceMappingURL=Game.js.map