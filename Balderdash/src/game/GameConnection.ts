import * as signalr from "@microsoft/signalr";
import { Player } from "./Player";
import { StartGameResponse, GameJoinedResponse } from "./Responses";
import { GameEvent } from "./GameEvent";
import { GameStartedEvent } from "./Events/GameStartedEvent";

class GameConnection {
    private _connection: signalr.HubConnection;

    public ConnectionId: string;
    public GroupId: string;
    public readonly OnGameStarted: GameEvent<GameStartedEvent>;
    public readonly OnPlayerJoined: GameEvent<Player>;
    public readonly OnGameJoined: GameEvent<GameJoinedResponse>;

    private _isConnectionStarted: boolean;

    constructor() {
        this._connection = new signalr.HubConnectionBuilder().withUrl("/game").build();
        this.ConnectionId = "";
        this.GroupId = "";
        this._isConnectionStarted = false;
        this.OnGameStarted = new GameEvent<GameStartedEvent>();
        this.OnPlayerJoined = new GameEvent<Player>();
        this.OnGameJoined = new GameEvent<GameJoinedResponse>();
        this.registerEvents();
        this._connection.start().then(() => { return this._isConnectionStarted = true; });
    }

    private registerEvents() : void {
        this._connection.on("gameStarted", (response: StartGameResponse) => {
            if (this._connection.connectionId != null) {
                this.ConnectionId = this._connection.connectionId;
            }
            this.GroupId = response.gameId;
            this.OnGameStarted.trigger(new GameStartedEvent(this.GroupId, this.ConnectionId));
        });
        this._connection.on("playerJoined", (response: Player) => {
            this.OnPlayerJoined.trigger(response);
        });
        this._connection.on("gameJoined", (response: GameJoinedResponse) => {
            if (this._connection.connectionId != null) {
                this.ConnectionId = this._connection.connectionId;
            }
            this.GroupId = response.gameId;
            this.OnGameJoined.trigger(response);
        });
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