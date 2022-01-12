import { Player } from "./Player";
import { GameConnection } from "./GameConnection";
import { GameWord } from "./GameWord";
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
    _currentWord;
    _gameStarted;
    _roundStarted;
    constructor() {
        this._players = new Array();
        this._currentPlayer = new Player("", "", true, "", "", false);
        this._gameConnection = new GameConnection();
        this._currentWord = new GameWord("", "");
        this._gameStarted = false;
        this._roundStarted = false;
        this.registerEvents();
    }
    registerEvents() {
        this._gameConnection.OnGameCreated.on((data) => {
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
                this._gameStarted = data.isGameStarted;
                this._roundStarted = data.isRoundStarted;
            }
        });
        this._gameConnection.OnRandomWordReceived.on((data) => {
            if (data !== undefined) {
                this._currentWord.definition = data.definition;
                this._currentWord.word = data.word;
            }
        });
        this._gameConnection.OnGameStarted.on(() => {
            this._gameStarted = true;
        });
        this._gameConnection.OnRoundStarted.on((player) => {
            if (player !== undefined) {
                this._currentPlayer.setDefinition(player.definition);
                this._currentPlayer.setHasRealDefinition(player.hasRealDefinition);
                this._currentPlayer.setWord(player.word);
                this._roundStarted = true;
            }
        });
    }
    async createGame() {
        await this._gameConnection.createGame(this._currentPlayer);
    }
    async startGame() {
        await this._gameConnection.startGame();
    }
    async joinGame(gameId) {
        await this._gameConnection.joinGame(gameId, this._currentPlayer);
    }
    async getNewWord() {
        await this._gameConnection.getRandomWord();
    }
    async startRound() {
        await this._gameConnection.startRound(this.GameId);
    }
    get CurrentWord() {
        return this._currentWord;
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
    get GameStarted() {
        return this._gameStarted;
    }
    get RoundStarted() {
        return this._roundStarted;
    }
}
export { Game, GameOption };
//# sourceMappingURL=Game.js.map