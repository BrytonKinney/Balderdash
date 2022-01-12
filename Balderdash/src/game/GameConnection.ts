﻿import * as signalr from "@microsoft/signalr";
import { Player } from "./Player";
import { StartGameResponse, GameJoinedResponse } from "./Responses";
import { GameEvent } from "./GameEvent";
import { GameCreatedEvent } from "./Events/GameCreatedEvent";
import { GameWord } from "./GameWord";

class GameConnection {
    public readonly OnGameCreated: GameEvent<GameCreatedEvent>;
    public readonly OnPlayerListUpdated: GameEvent<Player[]>;
    public readonly OnGameJoined: GameEvent<GameJoinedResponse>;
    public readonly OnRandomWordReceived: GameEvent<GameWord>;
    public readonly OnGameStarted: GameEvent<void>;
    public readonly OnRoundStarted: GameEvent<Player>;

    private _connection: signalr.HubConnection;
    private _isConnectionStarted: boolean;
    private _connectionId: string;
    private _groupId: string;

    constructor() {
        this._connection = new signalr.HubConnectionBuilder().withAutomaticReconnect().withUrl("/game").build();
        this._connectionId = "";
        this._groupId = "";
        this._isConnectionStarted = false;
        this.OnGameCreated = new GameEvent<GameCreatedEvent>();
        this.OnPlayerListUpdated = new GameEvent<Player[]>();
        this.OnGameJoined = new GameEvent<GameJoinedResponse>();
        this.OnRandomWordReceived = new GameEvent<GameWord>();
        this.OnGameStarted = new GameEvent<void>();
        this.OnRoundStarted = new GameEvent<Player>();
        this.registerEvents();
        this._connection.start().then(() => { return this._isConnectionStarted = true; });
    }

    private registerEvents() : void {
        this._connection.on("gameCreated", (response: StartGameResponse) => {
            if (this._connection.connectionId != null) {
                this._connectionId = this._connection.connectionId;
            }
            this._groupId = response.gameId;
            this.OnGameCreated.trigger(new GameCreatedEvent(this._groupId, this._connectionId));
        });
        this._connection.on("randomWord", (gameWord: GameWord) => {
            this.OnRandomWordReceived.trigger(gameWord);
        });
        this._connection.on("playerListUpdated", (response: Player[]) => {
            this.OnPlayerListUpdated.trigger(response);
        });
        this._connection.on("gameJoined", (response: GameJoinedResponse) => {
            if (this._connection.connectionId != null) {
                this._connectionId = this._connection.connectionId;
            }
            this._groupId = response.gameId;
            this.OnGameJoined.trigger(response);
        });
        this._connection.on("gameStarted", () => {
            this.OnGameStarted.trigger();
        });
        this._connection.on("roundStarted", (player: Player) => {
            this.OnRoundStarted.trigger(player);
        });
    }

    public get ConnectionId() {
        return this._connectionId;
    }

    public get GroupId() {
        return this._groupId;
    }
    
    public get IsConnectionStarted() {
        return this._isConnectionStarted;
    }

    async getRandomWord(): Promise<void> {
        await this._connection.send("sendRandomWordToHost", this.GroupId);
    }
    async startGame(): Promise<void> {
        await this._connection.send("startGame", this.GroupId);
    }

    async createGame(currentPlayer: Player): Promise<void> {
        await this._connection.send("createNewGame", currentPlayer);
    }

    async joinGame(gameId: string, player: Player): Promise<void> {
        await this._connection.send("joinGame", gameId, player);
    }

    async startRound(gameId: string): Promise<void> {
        await this._connection.send("startRound", gameId);
    }
}
export { GameConnection };