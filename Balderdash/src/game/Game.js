import { Player } from "./Player";
import { GameConnection } from "./GameConnection";
var GameOption;
(function (GameOption) {
    GameOption[GameOption["None"] = 0] = "None";
    GameOption[GameOption["JoinGame"] = 1] = "JoinGame";
    GameOption[GameOption["StartGame"] = 2] = "StartGame";
})(GameOption || (GameOption = {}));
class Game {
    _players;
    _currentPlayer;
    _gameConnection;
    constructor() {
        this._players = new Array();
        this._currentPlayer = new Player("", "", true);
        this._gameConnection = new GameConnection();
        this._gameConnection.OnGameStarted.on((data) => {
            if (data !== undefined) {
                this._currentPlayer.setId(data.ConnectionId);
            }
        });
        this._gameConnection.OnPlayerJoined.on((player) => {
            if (player !== undefined)
                this._players.push(player);
        });
    }
    async startGame() {
        await this._gameConnection.startGame(this._currentPlayer);
    }
    async joinGame(gameId) {
        await this._gameConnection.joinGame(gameId, this._currentPlayer);
    }
    get GameId() {
        return this._gameConnection.GroupId;
    }
    get CanStart() {
        return this._gameConnection.IsConnectionStarted;
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