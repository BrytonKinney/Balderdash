import * as signalr from "@microsoft/signalr";
import { GameEvent } from "./GameEvent";
import { GameStartedEvent } from "./Events/GameStartedEvent";
class GameConnection {
    _connection;
    ConnectionId;
    GroupId;
    OnGameStarted;
    OnPlayerJoined;
    _isConnectionStarted;
    constructor() {
        this._connection = new signalr.HubConnectionBuilder().withUrl("/game").build();
        this.ConnectionId = "";
        this.GroupId = "";
        this._isConnectionStarted = false;
        this.OnGameStarted = new GameEvent();
        this.OnPlayerJoined = new GameEvent();
        this.registerEvents();
        this._connection.start().then(() => { return this._isConnectionStarted = true; });
    }
    registerEvents() {
        this._connection.on("gameStarted", (response) => {
            if (this._connection.connectionId != null) {
                this.ConnectionId = this._connection.connectionId;
            }
            this.GroupId = response.gameId;
            this.OnGameStarted.trigger(new GameStartedEvent(this.GroupId, this.ConnectionId));
        });
        this._connection.on("playerJoined", (response) => {
            this.OnPlayerJoined.trigger(response);
        });
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