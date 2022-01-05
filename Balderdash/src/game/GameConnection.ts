import * as signalr from "@microsoft/signalr";
import { Player } from "./Player";
import { StartGameResponse, GameJoinedResponse } from "./Responses";
import { GameEvent } from "./GameEvent";
import { GameStartedEvent } from "./Events/GameStartedEvent";

class GameConnection {
    public readonly OnGameStarted: GameEvent<GameStartedEvent>;
    public readonly OnPlayerListUpdated: GameEvent<Player[]>;
    public readonly OnGameJoined: GameEvent<GameJoinedResponse>;

    private _connection: signalr.HubConnection;
    private _isConnectionStarted: boolean;
    private _connectionId: string;
    private _groupId: string;

    constructor() {
        this._connection = new signalr.HubConnectionBuilder().withUrl("/game").build();
        this._connectionId = "";
        this._groupId = "";
        this._isConnectionStarted = false;
        this.OnGameStarted = new GameEvent<GameStartedEvent>();
        this.OnPlayerListUpdated = new GameEvent<Player[]>();
        this.OnGameJoined = new GameEvent<GameJoinedResponse>();
        this.registerEvents();
        this._connection.start().then(() => { return this._isConnectionStarted = true; });
    }

    private registerEvents() : void {
        this._connection.on("gameStarted", (response: StartGameResponse) => {
            if (this._connection.connectionId != null) {
                this._connectionId = this._connection.connectionId;
            }
            this._groupId = response.gameId;
            this.OnGameStarted.trigger(new GameStartedEvent(this._groupId, this._connectionId));
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

    async startGame(currentPlayer: Player): Promise<void> {
        return this._connection.send("startGame", currentPlayer);
    }

    async joinGame(gameId: string, player: Player): Promise<void> {
        return this._connection.send("joinGame", gameId, player);
    }
}
export { GameConnection };