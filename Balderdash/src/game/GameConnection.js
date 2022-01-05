import * as signalr from "@microsoft/signalr";
import { GameEvent } from "./GameEvent";
import { GameStartedEvent } from "./Events/GameStartedEvent";
class GameConnection {
    OnGameStarted;
    OnPlayerListUpdated;
    OnGameJoined;
    _connection;
    _isConnectionStarted;
    _connectionId;
    _groupId;
    constructor() {
        this._connection = new signalr.HubConnectionBuilder().withUrl("/game").build();
        this._connectionId = "";
        this._groupId = "";
        this._isConnectionStarted = false;
        this.OnGameStarted = new GameEvent();
        this.OnPlayerListUpdated = new GameEvent();
        this.OnGameJoined = new GameEvent();
        this.registerEvents();
        this._connection.start().then(() => { return this._isConnectionStarted = true; });
    }
    registerEvents() {
        this._connection.on("gameStarted", (response) => {
            if (this._connection.connectionId != null) {
                this._connectionId = this._connection.connectionId;
            }
            this._groupId = response.gameId;
            this.OnGameStarted.trigger(new GameStartedEvent(this._groupId, this._connectionId));
        });
        this._connection.on("playerListUpdated", (response) => {
            this.OnPlayerListUpdated.trigger(response);
        });
        this._connection.on("gameJoined", (response) => {
            if (this._connection.connectionId != null) {
                this._connectionId = this._connection.connectionId;
            }
            this._groupId = response.gameId;
            this.OnGameJoined.trigger(response);
        });
    }
    get ConnectionId() {
        return this._connectionId;
    }
    get GroupId() {
        return this._groupId;
    }
    get IsConnectionStarted() {
        return this._isConnectionStarted;
    }
    async startGame(currentPlayer) {
        return this._connection.send("startGame", currentPlayer);
    }
    async joinGame(gameId, player) {
        return this._connection.send("joinGame", gameId, player);
    }
}
export { GameConnection };
//# sourceMappingURL=GameConnection.js.map