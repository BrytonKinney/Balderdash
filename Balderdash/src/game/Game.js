import { Player } from "./Player";
import * as signalr from "@microsoft/signalr";
var GameOption;
(function (GameOption) {
    GameOption[GameOption["None"] = 0] = "None";
    GameOption[GameOption["JoinGame"] = 1] = "JoinGame";
    GameOption[GameOption["StartGame"] = 2] = "StartGame";
})(GameOption || (GameOption = {}));
;
class Game {
    _players;
    _currentPlayer;
    _connection;
    _canStart;
    _gameId;
    constructor() {
        this._players = new Array();
        this._currentPlayer = new Player("", "", true);
        this._connection = new signalr.HubConnectionBuilder().withUrl("/game").build();
        this._canStart = false;
        this._gameId = "";
        this._connection.on("gameStarted", (response) => {
            if (this._connection.connectionId != null) {
                this._currentPlayer.setId(this._connection.connectionId);
            }
            this._gameId = response.gameId;
        });
        this._connection.start().then(() => { return this._canStart = true; });
    }
    async startGame() {
        await this._connection.send("startGame", this._currentPlayer).then((resp) => {
            console.log(resp);
        });
    }
    get CanStart() {
        return this._canStart;
    }
    get Players() {
        return this._players;
    }
    get CurrentPlayer() {
        return this._currentPlayer;
    }
}
export { Game, GameOption };
//# sourceMappingURL=Game.js.map