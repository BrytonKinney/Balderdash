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
        this.registerEvents();
    }
    registerEvents() {
        this._gameConnection.OnGameStarted.on((data) => {
            if (data !== undefined) {
                this._currentPlayer.setId(data.ConnectionId);
            }
        });
        this._gameConnection.OnPlayerListUpdated.on((players) => {
            if (players !== undefined) {
                this._players.splice(0, this._players.length);
                for (const player of players) {
                    this._players.push(player);
                }
            }
        });
        this._gameConnection.OnGameJoined.on((data) => {
            if (data !== undefined) {
                this._currentPlayer.setId(data.playerId);
            }
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