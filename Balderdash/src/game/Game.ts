import { Player } from "./Player";
import { GameConnection } from "./GameConnection";
import { GameStartedEvent } from "./Events/GameStartedEvent";
import { GameJoinedResponse } from "./Responses";

enum GameOption {
    None = 0,
    JoinGame,
    StartGame
}

class Game {
    private _players: Player[];
    private readonly _currentPlayer: Player;
    private _gameConnection: GameConnection;

    constructor() {
        this._players = new Array<Player>();
        this._currentPlayer = new Player("", "", true);
        this._gameConnection = new GameConnection();
        this.registerEvents();
    }

    private registerEvents(): void {
        this._gameConnection.OnGameStarted.on((data?: GameStartedEvent): void => {
            if (data !== undefined) {
                this._currentPlayer.setId(data.ConnectionId);
            }
        });
        this._gameConnection.OnPlayerListUpdated.on((players?: Player[]): void => {
            if (players !== undefined) {
                this._players.splice(0, this._players.length);
                for (const player of players) {
                    this._players.push(player);
                }
            }
        });
        this._gameConnection.OnGameJoined.on((data?: GameJoinedResponse) => {
            if (data !== undefined) {
                this._currentPlayer.setId(data.playerId);
            }
        });
    }

    async startGame() : Promise<void> {
        await this._gameConnection.startGame(this._currentPlayer);
    }
    async joinGame(gameId: string) : Promise<void> {
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