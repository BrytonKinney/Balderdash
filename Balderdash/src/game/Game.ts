import { Player } from "./Player";
import { GameConnection } from "./GameConnection";
import { GameCreatedEvent } from "./Events/GameCreatedEvent";
import { GameJoinedResponse } from "./Responses";
import { GameWord } from "./GameWord";

enum GameOption {
    None = 0,
    JoinGame,
    StartGame
}

class Game {
    private _players: Player[];
    private readonly _currentPlayer: Player;
    private _gameConnection: GameConnection;
    private _currentWord: GameWord;
    private _gameStarted: boolean;
    private _roundStarted: boolean;

    constructor() {
        this._players = new Array<Player>();
        this._currentPlayer = new Player("", "", true, "", "", false);
        this._gameConnection = new GameConnection();
        this._currentWord = new GameWord("", "");
        this._gameStarted = false;
        this._roundStarted = false;
        this.registerEvents();
    }

    private registerEvents(): void {
        this._gameConnection.OnGameCreated.on((data?: GameCreatedEvent): void => {
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
                this._gameStarted = data.isGameStarted;
                this._roundStarted = data.isRoundStarted;
            }
        });
        this._gameConnection.OnRandomWordReceived.on((data?: GameWord) => {
            if (data !== undefined) {
                this._currentWord.definition = data.definition;
                this._currentWord.word = data.word;
            }
        });
        this._gameConnection.OnGameStarted.on(() => {
            this._gameStarted = true;
        });
        this._gameConnection.OnRoundStarted.on((player?: Player) => {
            if (player !== undefined) {
                this._currentPlayer.setDefinition(player.definition);
                this._currentPlayer.setHasRealDefinition(player.hasRealDefinition);
                this._currentPlayer.setWord(player.word);
                this._roundStarted = true;
            }
        });
    }

    async createGame() : Promise<void> {
        await this._gameConnection.createGame(this._currentPlayer);
    }
    async startGame(): Promise<void> {
        await this._gameConnection.startGame();
    }
    async joinGame(gameId: string) : Promise<void> {
        await this._gameConnection.joinGame(gameId, this._currentPlayer);
    }
    async getNewWord(): Promise<void> {
        await this._gameConnection.getRandomWord();
    }
    async startRound(): Promise<void> {
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