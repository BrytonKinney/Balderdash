import { Player } from "./Player";
import { GameConnection } from "./GameConnection";

enum GameOption {
    None = 0,
    JoinGame,
    StartGame
};

class Game {
    private _players: Player[];
    private _currentPlayer: Player;
    private _gameConnection: GameConnection;

    constructor() {
        this._players = new Array<Player>();
        this._currentPlayer = new Player("", "", true);
        this._gameConnection = new GameConnection(); 
    }

    async startGame() : Promise<void> {
        await this._gameConnection.startGame(this._currentPlayer);
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